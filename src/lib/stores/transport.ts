import { getTransport, immediate, Loop, getDraw } from 'tone'
import { writable, get, derived } from 'svelte/store';
import { timeSignature, bars, divisions } from '.';
import { divisionToPosition, floorPosition, data } from './sequencers';
import { beepAt, evalBytebeat, mod } from '$lib/sound/utils';
import { persist } from './localstorage';

/**
 * Global transport stores
 */
export const bpm = writable(120); // bpm
bpm.subscribe(persist('bs.bpm'));
export const cps = derived([bpm, timeSignature], ([$bpm, $timeSignature]) => $bpm / $timeSignature / 60); // bpm / timesignature denominator (4) / 60
export const t = writable(-1); // time pointer in divisions
export const c = writable(0); // cycle pointer in bars
export const position = derived(t, $t => divisionToPosition($t)); // position pointer in cycle (0 - bars)
export const startedAt = writable<number | null>(null);

/**
 * Recording enabled/disabled
 */
export const isRecording = writable(false);
export const toggleIsRecording = () => isRecording.update(r => !r);

/**
 * Playing enabled/disabled
 */
export const isPlaying = writable(false);
export const toggleIsPlaying = () => isPlaying.update(p => !p);
isPlaying.subscribe(playing => {
    playing
        ? startedAt.set((immediate()) * 1000)
        : isRecording.set(false);
});
isRecording.subscribe(recording => recording && isPlaying.set(true));

/**
 * Metronome enabled/disabled
 */
export const isMetronome = writable(false);
isMetronome.subscribe(persist('bs.isMetronome'));
export const toggleIsMetronome = () => isMetronome.update(m => !m);

export const sequencerTs = derived([t, c, divisions, data], ([$t, $c, $divisions, $data]) => {
    return Object.entries($data).reduce<Record<number, number>>((
        result: Record<number, number>, 
        [sequencerIndex, sequencerData]
    ) => ({
        ...result,
        [+sequencerIndex]: $t === -1 ? -1 : mod(evalBytebeat(sequencerData.bytebeat || 't', $t, $c), $divisions * bars)
    }), {} as Record<number, number>);
});

/**
 * Transport Loop
 */
const transport = getTransport()
const draw = getDraw();
let loop: Loop;
function createLoop() {
    loop && loop.dispose();

    loop = new Loop(time => {
        // get time pointer
        const nextT = get(t) + 1;
        const nextC = Math.floor(nextT / (get(divisions) * bars));

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
        get(isMetronome) && !(nextT%4) && beepAt(time, nextT % get(divisions) ? 0.25 : 1);
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
        const el = e.target as HTMLElement;
        // Ignore typing contexts
        if (
            el.tagName === 'INPUT' ||
            el.tagName === 'TEXTAREA' ||
            el.isContentEditable
        ) {
            return;
        }
        
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