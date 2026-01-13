import { writable } from "svelte/store";

export const sequencers = 4;
export const divisions = 16;
export const bars = 2;
export const notes = 60; // 5 octaves

export type Note = {
    amp: number;
    duration: number;
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
                [d]: Array.from({ length: notes }).map(() => ({
                    amp: 0,
                    duration: 0
                }))
            }), {})
        }),
        {}
    );

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
        updatedNotes[noteIndex] = { amp: newAmp, duration: 0.1 };

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
        updatedFromNotes[fromNote] = { amp: 0, duration: 0 };

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


// export const sequencers = 4;
// export const rows = 24;
// export const cols = 32;

// export type Cell = {
//     amp: number;
//     duration: number;
// };

// export type Grid = {
//     [colIndex: number]: Cell;
// };

// export type Row = {
//     [rowIndex: number]: Grid;
// };

// export type Sequencer = {
//     [sequencerIndex: number]: Row;
// };

// const createInitialData = (): Sequencer =>
//     Array.from({ length: sequencers }).reduce<Sequencer>(
//         (sequencerAcc, _, s) => ({
//             ...sequencerAcc,
//             [s]: Array.from({ length: rows }).reduce<Row>(
//                 (rowAcc, _, r) => ({
//                     ...rowAcc,
//                     [r]: Array.from({ length: cols }).reduce<Grid>(
//                         (colAcc, _, c) => ({
//                             ...colAcc,
//                             [c]: { amp: 0, duration: 0 }
//                         }),
//                         {}
//                     )
//                 }),
//                 {}
//             )
//         }),
//         {}
//     );


// export const data = writable<Sequencer>(createInitialData());

// export const toggleCell = (
//     sequencerIndex: number,
//     rowIndex: number,
//     colIndex: number,
//     ampValue: number = 0.75
// ) => {
//     data.update((allSequencers) => {
//         const cell =
//             allSequencers[sequencerIndex]?.[rowIndex]?.[colIndex];

//         if (!cell) return allSequencers;

//         return {
//             ...allSequencers,
//             [sequencerIndex]: {
//                 ...allSequencers[sequencerIndex],
//                 [rowIndex]: {
//                     ...allSequencers[sequencerIndex][rowIndex],
//                     [colIndex]: {
//                         amp: cell.amp > 0 ? 0 : ampValue,
//                         duration: 0.1
//                     }
//                 }
//             }
//         };
//     });
// };

// export const moveCell = (
//     sequencer: number,
//     fromRow: number,
//     fromCol: number,
//     toRow: number,
//     toCol: number
// ) => {
//     data.update((allSequencers) => {
//         const seq = allSequencers[sequencer];
//         const cell = seq?.[fromRow]?.[fromCol];

//         if (!seq || !cell) return allSequencers;

//         const isSameRow = fromRow === toRow;

//         return {
//             ...allSequencers,
//             [sequencer]: {
//                 ...seq,

//                 ...(isSameRow
//                     ? {
//                           [fromRow]: {
//                               ...seq[fromRow],
//                               [fromCol]: { amp: 0, duration: 0 },
//                               [toCol]: cell
//                           }
//                       }
//                     : {
//                           [fromRow]: {
//                               ...seq[fromRow],
//                               [fromCol]: { amp: 0, duration: 0 }
//                           },
//                           [toRow]: {
//                               ...seq[toRow],
//                               [toCol]: cell
//                           }
//                       })
//             }
//         };
//     });
// };

