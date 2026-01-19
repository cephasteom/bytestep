import { getTransport, immediate, Loop, getDraw, now } from 'tone'
import { writable, get } from 'svelte/store';
import { bars, divisions, divisionToPosition, query } from './sequencer';
import { connections } from './midi';
import { WebMidi } from 'webmidi';

export const cps = writable(.5);
export const t = writable(-1); // time pointer in divisions
export const startedAt = writable<number | null>(null);

export const isPlaying = writable(false);
export const toggleIsPlaying = () => isPlaying.update(p => !p);

export const isRecording = writable(false);
export const toggleIsRecording = () => isRecording.update(r => !r);

const transport = getTransport()
const draw = getDraw();

isPlaying.subscribe(playing => {
    playing
        ? startedAt.set(immediate() * 1000)
        : isRecording.set(false);
});
isRecording.subscribe(recording => recording && isPlaying.set(true));

new Loop(time => {
    const delta = time - immediate()

    // get time pointer
    const nextT = get(t) + 1;
    // advance time pointer at scheduled time
    draw.schedule(() => get(isPlaying) && t.set(nextT), time);
    // set transport bpm based on cps store
    transport.bpm.setValueAtTime(240 * get(cps), time);

    const events = query(divisionToPosition(nextT));
    const conns = get(connections);
    Object.entries(events).forEach(([sequencerIndex, notes]) => {
        const output = conns[parseInt(sequencerIndex)]?.output;
        if (!output) return;

        const midiOutput = WebMidi.getOutputByName(output);
        if (!midiOutput) return;

        // TODO: this always quantizes to the division start, consider note timing
        const timestamp = (delta * 1000);

        notes.forEach(({ note, amp, duration }) => {
            midiOutput.playNote(note, { attack: amp, duration, time: timestamp });
        });
    });

}, `${divisions}n`).start(0);

const play = () => transport.start('+0.1');
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
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
};

/**
 * Convert a time in ms to a position within the cycle.
 * @param time 
 * @returns
 */
export function timeToPosition(time: number) {
    const pointer = time - get(startedAt)!;
    const cycleDuration = (1/get(cps)) * 1000; // in ms
    const positionInCycle = (pointer % (cycleDuration * bars)) / cycleDuration;
    return positionInCycle;
}