import { writable } from "svelte/store";

export const sequencers = 4;
export const rows = 24;
export const cols = 32;

export type Cell = {
    amp: number;
    duration: number;
};

export type Grid = {
    [colIndex: number]: Cell;
};

export type Row = {
    [rowIndex: number]: Grid;
};

export type Sequencer = {
    [sequencerIndex: number]: Row;
};

const createInitialData = (): Sequencer =>
    Array.from({ length: sequencers }).reduce<Sequencer>(
        (sequencerAcc, _, s) => ({
            ...sequencerAcc,
            [s]: Array.from({ length: rows }).reduce<Row>(
                (rowAcc, _, r) => ({
                    ...rowAcc,
                    [r]: Array.from({ length: cols }).reduce<Grid>(
                        (colAcc, _, c) => ({
                            ...colAcc,
                            [c]: { amp: 0, duration: 0 }
                        }),
                        {}
                    )
                }),
                {}
            )
        }),
        {}
    );


export const data = writable<Sequencer>(createInitialData());

export const toggleCell = (
    sequencerIndex: number,
    rowIndex: number,
    colIndex: number,
    ampValue: number = 0.75
) => {
    data.update((allSequencers) => {
        const cell =
            allSequencers[sequencerIndex]?.[rowIndex]?.[colIndex];

        if (!cell) return allSequencers;

        return {
            ...allSequencers,
            [sequencerIndex]: {
                ...allSequencers[sequencerIndex],
                [rowIndex]: {
                    ...allSequencers[sequencerIndex][rowIndex],
                    [colIndex]: {
                        amp: cell.amp > 0 ? 0 : ampValue,
                        duration: 0.1
                    }
                }
            }
        };
    });
};

export const moveCell = (
    sequencer: number,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
) => {
    data.update((allSequencers) => {
        const seq = allSequencers[sequencer];
        const cell = seq?.[fromRow]?.[fromCol];

        if (!seq || !cell) return allSequencers;

        const isSameRow = fromRow === toRow;

        return {
            ...allSequencers,
            [sequencer]: {
                ...seq,

                ...(isSameRow
                    ? {
                          [fromRow]: {
                              ...seq[fromRow],
                              [fromCol]: { amp: 0, duration: 0 },
                              [toCol]: cell
                          }
                      }
                    : {
                          [fromRow]: {
                              ...seq[fromRow],
                              [fromCol]: { amp: 0, duration: 0 }
                          },
                          [toRow]: {
                              ...seq[toRow],
                              [toCol]: cell
                          }
                      })
            }
        };
    });
};

