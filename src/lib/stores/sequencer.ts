import { get, writable } from "svelte/store";

export const sequencers = 4;
export const divisions = 16;
export const bars = 2;
export const notes = 60; // 5 octaves

export type Note = {
    position: number; // in cycles
    note: number;
    amp: number;
    duration: number;
};

export type SequencerData = {
    [sequencerIndex: number]: Note[]
};

const createInitialData = (): SequencerData =>
    Array.from({ length: sequencers }).reduce<SequencerData>(
        (sequencerAcc, _, s) => ({
            ...sequencerAcc,
            [s]: []
        }), {});

export const activeSequencer = writable<number | null>(null);
export const data = writable<SequencerData>(createInitialData());

export const toggleNote = (
    sequencer: number,
    division: number,
    note: number,
    amp = 0.75,
    duration = 0.25
) => {
    data.update((sequencers) => {
        const notes = sequencers[sequencer];
        const exists = notes.some(n => n.position === division && n.note === note);

        return {
            ...sequencers,
            [sequencer]: exists
                ? notes.filter(n => !(n.position === division && n.note === note))
                : notes.concat({ position: division, note, amp, duration })
        };
    });
};


export const moveNote = (
    sequencer: number,
    fromDivision: number,
    fromNote: number,
    toDivision: number,
    toNote: number
) => {
    data.update((sequencers) => {
        const notes = sequencers[sequencer];
        const note = notes.find(n => n.position === fromDivision && n.note === fromNote);
        if (!note) return sequencers;

        return {
            ...sequencers,
            [sequencer]: notes
                .filter(n => !(n.position === fromDivision && n.note === fromNote))
                .concat({ ...note, position: toDivision, note: toNote })
        }
    });
};

export const query: (division: number) => { [sequencerIndex: number]: Note[] } = (division: number) => {
    return Object.values(get(data)).reduce<{ [sequencerIndex: number]: Note[] }>((acc, s, i) => ({
        ...acc,
        [i]: s.filter((n) => n.position === division)
    }), {});
};