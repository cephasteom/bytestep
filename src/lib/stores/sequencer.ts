import { get, writable } from "svelte/store";

export const sequencers = 4;
export const divisions = 16;
export const bars = 2;
export const notes = 60;
export const activeSequencer = writable<number | null>(null);

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
    duration = 0.25
) => {
    data.update((sequencers) => {
        const notes = sequencers[sequencer];
        const exists = notes.some(n => n.position === position && n.note === note);

        return {
            ...sequencers,
            [sequencer]: exists
                ? notes.filter(n => !(n.position === position && n.note === note))
                : notes.concat({ position: position, note, amp, duration })
        };
    });
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
        const note = notes.find(n => n.position === fromPosition && n.note === fromNote);
        if (!note) return sequencers;

        return {
            ...sequencers,
            [sequencer]: notes
                .filter(n => !(n.position === fromPosition && n.note === fromNote))
                .concat({ ...note, position: toPosition, note: toNote })
        }
    });
};

/**
 * Query notes at a given position across all sequencers
 * TODO: not quite right - should be able to accept positions not exactly on division boundaries
 * @param position 
 * @returns 
 */
export const query: (position: number) => { [sequencerIndex: number]: Note[] } = (position: number) => {
    return Object.values(get(data)).reduce<{ [sequencerIndex: number]: Note[] }>((acc, s, i) => ({
        ...acc,
        [i]: s.filter((n) => n.position >= position || n.position < position + (1 / divisions))
    }), {});
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
    return (division / divisions);
}