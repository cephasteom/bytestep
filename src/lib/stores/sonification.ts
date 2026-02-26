import { get } from "svelte/store";
import { probabilities, phases, circuit } from "./circuit";
import { data, type Note } from "./sequencers";
import { sequencers, divisions, bars } from "./";

const defaults: { 
    // replace existing notes, add to what's already there, 
    strategy: 'replace' | 'add'
} = {
    strategy: 'replace',
}

/**
 * Using the quantum circuit output, generate notes and populate the sequencers.
 * @param options 
 */
export const sonify = (options: {} = {}) => {
    const { strategy } = {
        ...defaults,
        ...options
    };

    const [pbs, phs, divs, totalBars, totalSequencers] = [
        get(probabilities),
        get(phases),
        get(divisions),
        get(bars),
        get(sequencers)
    ];

    const hits = divs * totalBars;

    // create measurements for all hits
    const measurements: number[][] = Array.from({ length: hits }, () => {
        circuit.run();
        return circuit.measureAll();
    });

    // transform measurements to notes
    const notes: (Note | false)[][] = measurements
        .map((arr, i) =>
            arr.map(measurement => measurement 
                ? ({  
                    position: i / divs,
                    note: 60, // TODO: map something else
                    amp: measurement,
                    duration: 1 / divs 
                }) : false
        ));


    // create sequencer data in a functional style
    data.update(data => Object.fromEntries(
        Array.from({ length: totalSequencers }, (_, s) => [
            s,
            {
                record: false,
                muted: false,
                quantize: true,
                notes: [
                    ...notes.map(arr => arr[s % arr.length]).filter(note => note !== false) as Note[],
                    ...(strategy === 'replace' ? [] : data[s]?.notes || [])
                ],
                bytebeat: "t",
            }
        ])
    ))
};