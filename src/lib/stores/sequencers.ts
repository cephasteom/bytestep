import { get, writable } from "svelte/store";
import { sequencers, bars, divisions } from ".";

export const notes = 127 - 36;
export const activeSequencer = writable<number | null>(0);

export type Note = {
    position: number; // in cycles
    note: number;
    amp: number;
    duration: number;
};

export type SequencerData = { [sequencerIndex: number]: {
    quantize: boolean;
    record: boolean;
    muted: boolean;
    notes: Note[],
    bytebeat: string,
    hasError?: boolean
} };

export const data = writable<SequencerData>(
    Array.from({ length: sequencers }).reduce<SequencerData>(
        (acc, _, s) => ({ 
            ...acc, 
            [s]: { 
                record: false, 
                muted: false,
                quantize: true,
                notes: [],
                bytebeat: "t"
            }
        }), {})
);

export const toggleMute = (sequencer: number) => {
    data.update((sequencers) => ({
        ...sequencers,
        [sequencer]: {
            ...sequencers[sequencer],
            muted: !sequencers[sequencer].muted
        }
    }));
    localStorage.setItem("bs.sequencerData", JSON.stringify(get(data)));
};

export const toggleRecord = (sequencer: number) => {
    data.update((sequencers) => ({
        ...sequencers,
        [sequencer]: {
            ...sequencers[sequencer],
            record: !sequencers[sequencer].record
        }
    }));
    localStorage.setItem("bs.sequencerData", JSON.stringify(get(data)));
};

export const setBytebeat = (sequencer: number, bytebeat: string) => {
    let hasError = false;
    try {
        new Function("t", `return ${bytebeat}`);
    } catch (e) {
        bytebeat = get(data)[sequencer].bytebeat;
        hasError = true;
    }

    data.update((sequencers) => ({
        ...sequencers,
        [sequencer]: {
            ...sequencers[sequencer],
            bytebeat,
            hasError
        }
    }));
    localStorage.setItem("bs.sequencerData", JSON.stringify(get(data)));
};

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
        [sequencer]: {
            ...sequencers[sequencer],
            notes: sequencers[sequencer].notes
                // add note
                .concat({ position, note, amp, duration })
                // ensure unique position and note
                .filter((n, i, arr) => arr.findIndex(o => o.position === n.position && o.note === n.note) === i)
        }
    }));
    localStorage.setItem("bs.sequencerData", JSON.stringify(get(data)));
};

/**
 * Remove a note at position
 */
export const removeNote = (
    sequencer: number,
    position: number,
    note: number
) => {
    data.update((sequencers) => ({
        ...sequencers,
        [sequencer]: {
            ...sequencers[sequencer],
            notes: sequencers[sequencer].notes
                .filter(n => !(floorPosition(n.position) === position && n.note === note))
        }
    }));
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
        const notes = sequencers[sequencer].notes;
        const note = notes.find(n => floorPosition(n.position) === fromPosition && n.note === fromNote);
        if (!note) return sequencers;

        return {
            ...sequencers,
            [sequencer]: {
                ...sequencers[sequencer],
                notes: notes
                    .filter(n => !(floorPosition(n.position) === fromPosition && n.note === fromNote))
                    .concat({ ...note, position: toPosition, note: toNote })
            }
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
        [sequencer]: { 
            ...sequencers[sequencer],
            notes: [] 
        }
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
        const position = divisionToPosition(division);
        return {
        ...acc,
        [i]: s.notes.filter((n) => 
            // note happens on or after position
            n.position >= position 
            // but before next division
            && n.position < floorPosition(position) + (1 / get(divisions)))
    }}, {});
};

/**
 * Does a note at a given position happen within a given division
 * @param division - an integer denoting division of the bar
 * @param position - a position within a cycle
 * @returns 
 */
export const happensWithin = (division: number, position: number) => {
    const div = division % (get(divisions) * bars);
    const pos = Math.floor((position % bars) * get(divisions));
    return div === pos;
};

/**
 * Convert a division to a position within the cycle
 * @param division 
 * @returns 
 */
export const divisionToPosition = (division: number) => {
    return ((division % (get(divisions) * bars)) / get(divisions));
}

/**
 * Floor position to nearest division, e.g. 0.51223 becomes 0.5
 */
export function floorPosition(position: number) {
    return Math.floor(position * get(divisions)) / get(divisions)
}