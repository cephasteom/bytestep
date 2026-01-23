import { getTransport, immediate, Loop, getDraw } from 'tone'
import { writable, get, derived } from 'svelte/store';
import { timeSignature, bars, divisions } from '.';
import { divisionToPosition, query, quantize, floorPosition, data } from './sequencers';
import { connections } from './midi';
import { WebMidi } from 'webmidi';
import { beepAt } from '$lib/sound/utils';

export const bpm = writable(120); // bpm
export const cps = derived([bpm, timeSignature], ([$bpm, $timeSignature]) => $bpm / $timeSignature / 60); // bpm / timesignature denominator (4) / 60
export const t = writable(-1); // time pointer in divisions
export const c = writable(0); // cycle pointer in bars
export const position = derived(t, $t => divisionToPosition($t)); // position pointer in cycle (0 - bars)
export const startedAt = writable<number | null>(null);
export const isPlaying = writable(false);
export const toggleIsPlaying = () => isPlaying.update(p => !p);

export const isRecording = writable(false);
export const toggleIsRecording = () => isRecording.update(r => !r);

export const isMetronome = writable(false);
export const toggleIsMetronome = () => {
    isMetronome.update(m => !m);
    localStorage.setItem("bs.isMetronome", JSON.stringify(get(isMetronome)));
};

const transport = getTransport()
const draw = getDraw();

isPlaying.subscribe(playing => {
    playing
        ? startedAt.set((immediate()) * 1000)
        : isRecording.set(false);
});
isRecording.subscribe(recording => recording && isPlaying.set(true));

let loop: Loop;
function createLoop() {
    loop && loop.dispose();

    loop = new Loop(time => {
        const delta = time - immediate()
        const divs = get(divisions);
        
        // get time pointer
        const nextT = get(t) + 1;
        const nextC = Math.floor(nextT / (divs * bars));
        const nextPosition = divisionToPosition(nextT);
        const cycleDuration = (1/get(cps)) * 1000; // in ms

        // advance time pointers at scheduled time
        draw.schedule(() => {
            if(!get(isPlaying)) return 
            t.set(nextT)
            c.set(nextC);
        }, time);

        // set time signature
        transport.timeSignature = +get(timeSignature);
        // set transport bpm based on cps store
        transport.bpm.setValueAtTime((+get(timeSignature) * 60) * get(cps), time);

        // if metronome is enabled, play click sound
        get(isMetronome) && !(nextT%4) && beepAt(time);

        const events = query(nextT);
        const conns = get(connections);

        Object.entries(events).forEach(([sequencerIndex, notes]) => {
            if(get(data)[+sequencerIndex]?.muted) return;

            const output = conns[+sequencerIndex]?.output;
            if (!output) return;

            const midiOutput = WebMidi.getOutputByName(output);
            if (!midiOutput) return;
            
            notes.forEach(({ position, note, amp, duration }) => {
                // TODO: this doesn't work when t func is applied and quantize is off
                const noteDelta = get(quantize) ? 0 : (position - nextPosition) * cycleDuration;
                
                midiOutput.playNote(note, { 
                    attack: amp, 
                    duration: duration * cycleDuration, 
                    time: `+${(delta * 1000) + (noteDelta)}`,
                });
            });
        });

    }, `${get(divisions)}n`).start(0);
}
divisions.subscribe(() => createLoop());


const play = () => transport.start();
const stop = () => {
    transport.stop(immediate());
    t.set(-1);
}

isPlaying.subscribe(playing => playing
    ? play()
    : stop()
);

export const mapTransportKeys = () => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
            toggleIsPlaying();
            e.preventDefault();
        }
        if (e.code === 'KeyR' && !e.metaKey && !e.ctrlKey && !e.altKey) {
            toggleIsRecording();
            e.preventDefault();
        }
        if (e.code === 'KeyT' && !e.metaKey && !e.ctrlKey && !e.altKey) {
            toggleIsMetronome();
            e.preventDefault();
        }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
};

/**
 * Convert a time in ms to a position within the cycle.
 * @param time 
 * @returns
 */
export function timeToPosition(time: number, quantize: boolean = true) {
    const pointer = time - get(startedAt)!;
    const cycleDuration = (1/get(cps)) * 1000; // in ms
    const positionInCycle = (pointer % (cycleDuration * bars)) / cycleDuration;
    return quantize ? floorPosition(positionInCycle) : positionInCycle;
}