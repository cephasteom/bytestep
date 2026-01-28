import { writable, get } from "svelte/store";
import { WebMidi } from "webmidi";
import { data, addNote, type Note } from "./sequencers";
import { divisions } from ".";
import { isRecording, position } from "./transport";
import { persist } from "./localstorage";

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
            activeNotes[noteIndex].duration = duration > 0 ? duration : (1/get(divisions));
            // add to sequencer
            Object.entries(get(connections))
                .filter(([_, conn]) => conn.input === input.name)
                .forEach(([sequencer, i]) => {
                    if(!get(data)[+sequencer]?.record) return;
                    addNote(
                        parseInt(sequencer),
                        note.position,
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