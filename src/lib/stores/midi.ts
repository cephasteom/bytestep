import { writable, get } from "svelte/store";
import { WebMidi } from "webmidi";
import { data, addNote, type Note, query, divisionToPosition } from "./sequencers";
import { bars, divisions } from ".";
import { t, isRecording, position, cps } from "./transport";
import { persist } from "./localstorage";
import { immediate, Loop } from "tone";
import { clamp } from "$lib/utils";

/**
 * MIDI inputs and outputs, and connections to sequencers
 */
export const inputs = writable<any[]>([]);
export const outputs = writable<any[]>([]);
export const connections = writable<{[sequencer: number | string]: {
    input: string | null, 
    inputChannel: number | null,
    output: string | null,
    outputChannel: number | null
}}>(
    [
        'all',
        ...Object.keys(get(data))].reduce((acc, key) => ({ 
            ...acc, 
            [key]: { input: null, inputChannel: null, output: null, outputChannel: null } 
        }), {})
);
connections.subscribe(persist('bs.midiConnections'));

/**
 * MIDI Settings Modal
 */
export const showMidiSettings = writable(false);
export const midiSettingsActive = writable<string | number>('all');
export const openMidiSettings = (sequencer: string | number | null = null) => {
    midiSettingsActive.set(sequencer !== null ? sequencer : 'all');
    showMidiSettings.set(true);
}

/**
 * MIDI Setup
 */
const populate = () => {
    inputs.set(WebMidi.inputs.map(input => input.name));
    outputs.set(WebMidi.outputs.map(output => output.name));
};

const addListeners = () => {
    // remove existing listeners
    WebMidi.inputs.forEach(input => input.removeListener());
    
    // add listeners
    WebMidi.inputs.forEach(input => {
        let activeNotes: Note[] = [];

        // note on adds note to activeNotes
        input.addListener("noteon", (e) => {
            if(!get(isRecording)) return;
            activeNotes = [
                ...activeNotes,
                {
                    position: get(position),
                    note: e.note.number,
                    // @ts-ignore
                    amp: e.velocity,
                    duration: 0 // to be updated on noteoff
                }
            ];
        });
        
        input.addListener("noteoff", (e) => {
            const noteIndex = activeNotes.findIndex(n => n.note === e.note.number && n.duration === 0);
            if(noteIndex === -1) return;
            const note = activeNotes[noteIndex];
            const pos = get(position);
            const duration = pos - note.position;

            // update the note with duration
            activeNotes[noteIndex].duration = clamp(duration, 1 / get(divisions), 4);
            // add to sequencer
            Object.entries(get(connections))
                .filter(([_, conn]) => conn.input === input.name)
                .forEach(([sequencer]) => {
                    if(!get(data)[+sequencer]?.record) return;
                    addNote(
                        parseInt(sequencer),
                        note.position % bars,
                        note.note,
                        note.amp,
                        activeNotes[noteIndex].duration
                    );
                });
            // remove from activeNotes
            activeNotes = activeNotes.filter((_, i) => i !== noteIndex);
        });
    });
};

const configure = () => {
    populate();
    addListeners();
}

WebMidi.enable().then(() => {
    configure();
    WebMidi.addListener("connected", configure);
    WebMidi.addListener("disconnected", configure);
});

const connect = (type: "input" | "output", sequencer: number | string, device: string | null) => {
    connections.update((conns) => ({
        ...conns,
        [sequencer]: {
            ...conns[sequencer],
            [type]: device
        }
    }));
};

const setChannel = (type: "input" | "output", sequencer: number | string, channel: number | null) => {
    connections.update((conns) => ({
        ...conns,
        [sequencer]: {
            ...conns[sequencer],
            [`${type}Channel`]: channel
        }
    }));
}

export const connectInput = (sequencer: number | string, inputName: string | null) => {
    connect("input", sequencer, inputName);
    addListeners();
};

export const connectOutput = (
    sequencer: number | string, 
    outputName: string | null
) => connect("output", sequencer, outputName);

export const setInputChannel = (
    sequencer: number | string, 
    channel: number | null
) => setChannel("input", sequencer, channel);

export const setOutputChannel = (
    sequencer: number | string, 
    channel: number | null
) => setChannel("output", sequencer, channel);

/**
 * Handle MIDI output on transport loop
 */
let loop: Loop;
function createLoop() {
    loop && loop.dispose();
    
    loop = new Loop(time => {
        const delta = time - immediate()
        const nextT = get(t) + 1;

        const nextPosition = divisionToPosition(nextT);
        const cycleDuration = (1/get(cps)) * 1000; // in ms

        const events = query(nextT);
        const conns = get(connections);

        Object.entries(events).forEach(([sequencerIndex, notes]) => {
            if(get(data)[+sequencerIndex]?.muted) return;
            const quantize = get(data)[+sequencerIndex]?.quantize ?? true;

            const output = conns[+sequencerIndex]?.output;
            const channel = conns[+sequencerIndex]?.outputChannel;
            if (!output) return;

            const midiOutput = WebMidi.getOutputByName(output);
            if (!midiOutput) return;
            
            notes.forEach(({ position, note, amp, duration }) => {
                const noteDelta = quantize ? 0 : (position - nextPosition) * cycleDuration;

                // cut all notes on that channel just before playing new note
                midiOutput.sendAllNotesOff({ 
                    time: `+${(delta * 1000) + (noteDelta) - 5}`, 
                    channels: channel === null ? undefined : (channel as number + 1)
                });
            
                let options: {[key: string]: any} = { 
                    attack: amp, 
                    duration: duration * cycleDuration, 
                    time: `+${(delta * 1000) + (noteDelta)}`,
                }

                channel !== null && (options.channels = channel as number + 1);
                
                midiOutput.playNote(note, options);
            });
        });

    }, `${get(divisions)}n`).start(0);
}
divisions.subscribe(() => createLoop());