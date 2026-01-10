import { get, writable } from "svelte/store";

export const sequencers = 4;
export const rows = 24;
export const cols = 32;

export const data = writable<Array<{ amp: number; duration: number }>[][]>(
    Array(sequencers).fill(null).map(() =>
        Array(rows).fill(null).map(() => 
            Array(cols).fill({amp: 0, duration: 0})))
);

export const toggleCell = (
    sequencerIndex: number,
    rowIndex: number,
    colIndex: number,
    ampValue: number = 0.75
) => {
    data.update((allSequencers) => (
        allSequencers.map((sequencer, sIndex) =>
            sIndex === sequencerIndex
                ? sequencer.map((row, rIndex) =>
                    rIndex === rowIndex
                        ? row.map((cell, cIndex) =>
                            cIndex === colIndex
                                ? { amp: cell.amp > 0 ? 0 : ampValue, duration: 0.1 }
                                : cell
                        )
                        : row
                )
                : sequencer
    )))
}