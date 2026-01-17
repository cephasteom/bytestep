// TODO: refactor data. should be {sequencerIndex: Note[] } }, with the division stored in the Note object
// this means we aren't fixed to the grid structure and can have notes at any division point

import { get, writable } from "svelte/store";

export const sequencers = 4;
export const divisions = 16;
export const bars = 2;
export const notes = 60; // 5 octaves

export type Note = {
    note: number;
    amp: number;
    duration: number;
    // position: number; // in cycles
};

export type SequencerData = {
    [sequencerIndex: number]: {
        [divisionIndex: number]: Note[];
    };
};

const createInitialData = (): SequencerData =>
    Array.from({ length: sequencers }).reduce<SequencerData>(
        (sequencerAcc, _, s) => ({
            ...sequencerAcc,
            [s]: Array.from({ length: divisions * bars }).reduce<{
                [divisionIndex: number]: Note[];
            }>((divisionAcc, _, d) => ({
                ...divisionAcc,
                [d]: Array.from({ length: notes }).map((_, note) => ({
                    note,
                    amp: 0,
                    duration: 0
                }))
            }), {})
        }),
        {}
    );

export const activeSequencer = writable<number | null>(null);
export const data = writable<SequencerData>(createInitialData());

export const toggleNote = (
    sequencerIndex: number,
    divisionIndex: number,
    noteIndex: number,
    ampValue: number = 0.75
) => {
    data.update((allSequencers) => {
        const note =
            allSequencers[sequencerIndex]?.[divisionIndex]?.[noteIndex];

        if (!note) return allSequencers;

        const newAmp = note.amp > 0 ? 0 : ampValue;

        const updatedNotes = [...allSequencers[sequencerIndex][divisionIndex]];
        updatedNotes[noteIndex] = { ...note, amp: newAmp, duration: 0.1 };

        return {
            ...allSequencers,
            [sequencerIndex]: {
                ...allSequencers[sequencerIndex],
                [divisionIndex]: updatedNotes
            }
        };
    });
};

export const moveNote = (
    sequencerIndex: number,
    fromDivision: number,
    fromNote: number,
    toDivision: number,
    toNote: number
) => {
    data.update((allSequencers) => {
        const seq = allSequencers[sequencerIndex];
        const note = seq?.[fromDivision]?.[fromNote];

        if (!seq || !note) return allSequencers;

        const isSameDivision = fromDivision === toDivision;

        const updatedFromNotes = [...seq[fromDivision]];
        updatedFromNotes[fromNote] = { ...note, amp: 0, duration: 0 };

        const updatedToNotes = isSameDivision
            ? updatedFromNotes
            : [...seq[toDivision]];
        updatedToNotes[toNote] = note;

        return {
            ...allSequencers,
            [sequencerIndex]: {
                ...seq,
                [fromDivision]: updatedFromNotes,
                ...(isSameDivision
                    ? {}
                    : { [toDivision]: updatedToNotes })
            }
        };
    });
};

export const query: (division: number) => { [sequencerIndex: number]: Note[] } = (division: number) => {
    return Object.values(get(data)).reduce<{ [sequencerIndex: number]: Note[] }>((acc, s, i) => ({
        ...acc,
        [i]: s[division % (divisions * bars)].filter(n => n.amp > 0)
    }), {});
};