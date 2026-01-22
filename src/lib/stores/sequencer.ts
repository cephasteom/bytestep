import { get, writable } from "svelte/store";

export const sequencers = 4;
export const divisions = 16;
export const bars = 2;
export const notes = 127 - 36;
export const activeSequencer = writable<number | null>(0);
export const armedSequencers = writable<number[]>([]);
export const toggleArmedSequencer = (index: number) => {
    armedSequencers.update((arr) => 
        arr.includes(index)
            ? arr.filter(i => i !== index)
            : arr.concat(index)
    );
};
export const quantize = writable(true);
export const timeFunctions = writable({} as Record<number, (t: number, c: number) => number>);

export type Note = {
    position: number; // in cycles
    note: number;
    amp: number;
    duration: number;
};

export type SequencerData = { [sequencerIndex: number]: Note[] };

export const data = writable<SequencerData>(
    Array.from({ length: sequencers }).reduce<SequencerData>(
        (acc, _, s) => ({ ...acc, [s]: []}), {})
);

/**
 * Add a note at position
 */
export const addNote = (
    sequencer: number,
    position: number,
    note: number,
    amp = 0.75,
    duration = 0.25
) => {
    data.update((sequencers) => ({
        ...sequencers,

        [sequencer]: sequencers[sequencer]
            // add note
            .concat({ position, note, amp, duration })
            // ensure unique position and note
            .filter((n, i, arr) => arr.findIndex(o => o.position === n.position && o.note === n.note) === i)
    }));
    localStorage.setItem("bs.sequencerData", JSON.stringify(get(data)));
};

/**
 * Add a note if it doesn't exist at the given position/note, or remove it if it does
 * @param sequencer 
 * @param position 
 * @param note 
 * @param amp 
 * @param duration 
 */
export const toggleNote = (
    sequencer: number,
    position: number,
    note: number,
    amp = 0.75,
    duration = 1/divisions
) => {
    data.update((sequencers) => {
        const notes = sequencers[sequencer];
        const exists = notes.some(n => floorPosition(n.position) === position && n.note === note);

        return {
            ...sequencers,
            [sequencer]: exists
                ? notes.filter(n => !(floorPosition(n.position) === position && n.note === note))
                : notes.concat({ position: position, note, amp, duration })
        };
    });
    localStorage.setItem("bs.sequencerData", JSON.stringify(get(data)));
};

/**
 * Move a note from one position/note to another
 * @param sequencer 
 * @param fromPosition 
 * @param fromNote 
 * @param toPosition 
 * @param toNote 
 */
export const moveNote = (
    sequencer: number,
    fromPosition: number,
    fromNote: number,
    toPosition: number,
    toNote: number
) => {
    data.update((sequencers) => {
        const notes = sequencers[sequencer];
        const note = notes.find(n => floorPosition(n.position) === fromPosition && n.note === fromNote);
        if (!note) return sequencers;

        return {
            ...sequencers,
            [sequencer]: notes
                .filter(n => !(floorPosition(n.position) === fromPosition && n.note === fromNote))
                .concat({ ...note, position: toPosition, note: toNote })
        }
    });
    localStorage.setItem("bs.sequencerData", JSON.stringify(get(data)));
};

/**
 * Clear all notes from a sequencer
 * @param sequencer 
 */
export const clearSequencer = (sequencer: number) => {
    data.update((sequencers) => ({
        ...sequencers,
        [sequencer]: []
    }));
    localStorage.setItem("bs.sequencerData", JSON.stringify(get(data)));
};

/**
 * Query notes at a given division across all sequencers
 * @param position 
 * @returns 
 */
export const query: (division: number) => { [sequencerIndex: number]: Note[] } = (division: number) => {
    return Object.values(get(data)).reduce<{ [sequencerIndex: number]: Note[] }>((acc, s, i) => {
        const func = get(timeFunctions)[i] || ((t: number) => t);
        const position = divisionToPosition(func(division, Math.floor(division / (divisions * bars))));
        return {
        ...acc,
        [i]: s.filter((n) => 
            // note happens on or after position
            n.position >= position 
            // but before next division
            && n.position < floorPosition(position) + (1 / divisions))
    }}, {});
};

/**
 * Does a note at a given position happen within a given division
 * @param division - an integer denoting division of the bar
 * @param position - a position within a cycle
 * @returns 
 */
export const happensWithin = (division: number, position: number) => {
    const div = division % (divisions * bars);
    const pos = Math.floor((position % bars) * divisions);
    return div === pos;
};

/**
 * Convert a division to a position within the cycle
 * @param division 
 * @returns 
 */
export const divisionToPosition = (division: number) => {
    return ((division % (divisions * bars)) / divisions);
}

/**
 * Floor position to nearest division, e.g. 0.51223 becomes 0.5
 */
export function floorPosition(position: number) {
    return Math.floor(position * divisions) / divisions
}