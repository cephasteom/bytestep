import { get, writable } from "svelte/store";
import { sequencers, bars, divisions } from ".";
import { mod } from "$lib/utils";
import { evalBytebeat, isValidBytebeat } from "$lib/utils/bytebeat";

import { persist } from "./localstorage";

export const notes = 127 - 36;
export const activeSequencer = writable<number | null>(null);
activeSequencer.subscribe(persist('bs.activeSequencer'));

export const showSequencers = writable(true);
showSequencers.subscribe(persist('bs.showSequencers'));

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

export const initialData: SequencerData = Array.from({ length: get(sequencers) }).reduce<SequencerData>(
    (acc, _, s) => ({ 
        ...acc, 
        [s]: { 
            record: false, 
            muted: false,
            quantize: true,
            notes: [],
            bytebeat: "t"
        }
    }), {});

export const data = writable<SequencerData>(initialData);
data.subscribe(persist('bs.sequencerData'));

export const removeLastSequencer = () => {
    data.update((sequencers) => {
        const newSequencers = { ...sequencers };
        delete newSequencers[Object.keys(newSequencers).length - 1];
        return newSequencers;
    });
    sequencers.update(n => Math.max(1, n - 1));
};

export const addSequencer = () => {
    const newIndex = Object.keys(get(data)).length;
    data.update((sequencers) => ({
        ...sequencers,
        [newIndex]: {
            record: false,
            muted: false,
            quantize: true,
            notes: [],
            bytebeat: "t"
        }
    }));
    sequencers.update(n => n + 1);
};

export const globalBytebeat = writable<{ bytebeat: string; hasError: boolean }>({
    bytebeat: "t",
    hasError: false
});
globalBytebeat.subscribe(persist('bs.globalBytebeat'));
export const setGlobalBytebeat = (bytebeat: string) => {
    const isValid = isValidBytebeat(bytebeat);
    globalBytebeat.set({
        bytebeat,
        hasError: !isValid
    });
}

export const toggleMute = (sequencer: number) => {
    data.update((sequencers) => ({
        ...sequencers,
        [sequencer]: {
            ...sequencers[sequencer],
            muted: !sequencers[sequencer].muted
        }
    }));
};

export const toggleRecord = (sequencer: number) => {
    data.update((sequencers) => ({
        ...sequencers,
        [sequencer]: {
            ...sequencers[sequencer],
            record: !sequencers[sequencer].record
        }
    }));
};

export const setBytebeat = (sequencer: number, bytebeat: string) => {
    const isValid = isValidBytebeat(bytebeat);

    data.update((sequencers) => ({
        ...sequencers,
        [sequencer]: {
            ...sequencers[sequencer],
            bytebeat: isValid ? bytebeat : sequencers[sequencer].bytebeat,
            hasError: !isValid
        }
    }));
};

/**
 * Add a note at position
 */
export const addNote = (
    sequencer: number,
    position: number,
    note: number,
    amp = 0.5,
    duration = 1/16
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
};

export const updateNoteAmp = (
    sequencer: number,
    position: number,
    note: number,
    amp: number
) => {
    data.update((sequencers) => ({
        ...sequencers,
        [sequencer]: {
            ...sequencers[sequencer],
            notes: sequencers[sequencer].notes.map(n => {
                if (floorPosition(n.position) === position && n.note === note) {
                    return { ...n, amp };
                }
                return n;
            })
        }
    }));
};

export const updateNoteDuration = (
    sequencer: number,
    position: number,
    note: number,
    duration: number
) => {
    data.update((sequencers) => ({
        ...sequencers,
        [sequencer]: {
            ...sequencers[sequencer],
            notes: sequencers[sequencer].notes.map(n => {
                if (floorPosition(n.position) === position && n.note === note) {
                    return { ...n, duration };
                }
                return n;
            })
        }
    }));
};

/**
 * Query notes at a given division across all sequencers
 * @param position 
 * @returns 
 */
export const query: (division: number) => { [sequencerIndex: number]: Note[] } = (division: number) => {
    return Object.values(get(data)).reduce<{ [sequencerIndex: number]: Note[] }>((acc, s, i) => {
        const c = Math.floor(division / (get(divisions)));
        const globalT = evalBytebeat(get(globalBytebeat).bytebeat || 't', division, c);
        const div = mod(evalBytebeat(s.bytebeat || 't', globalT, c), get(divisions) * get(bars));
        const position = divisionToPosition(div);
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
    const div = division % (get(divisions) * get(bars));
    const pos = Math.floor((position % get(bars)) * get(divisions));
    return div === pos;
};

/**
 * Convert a division to a position within the cycle
 * @param division 
 * @returns 
 */
export const divisionToPosition = (division: number) => {
    return division / get(divisions);
}

/**
 * Floor position to nearest division, e.g. 0.51223 becomes 0.5
 */
export function floorPosition(position: number) {
    return Math.floor(position * get(divisions)) / get(divisions)
}