import { get } from "svelte/store";
import { probabilities, phases, circuit } from "./circuit";
import { data, initialData, type Note, type SequencerData } from "./sequencers";
import { sequencers, divisions, bars } from "./";

// TODO: put this in a worker
export const sonify = () => {
    // reset sequencers
    data.set(initialData);

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
    const notes: (Note | false)[][] = measurements.map((arr, i) =>
        arr.map(measurement => measurement 
            ? ({  
                position: i / divs,
                note: 60, // TODO: map something else
                amp: measurement,
                duration: 1 / divs 
            }) : false
    ));

    console.log('Sonified notes:', notes);

    // create sequencer data in a functional style
    const newData: SequencerData = Object.fromEntries(
        Array.from({ length: totalSequencers }, (_, s) => [
            s,
            {
                record: false,
                muted: false,
                quantize: true,
                notes: notes.map(arr => arr[s % arr.length]).filter(note => note !== false) as Note[],
                bytebeat: "t",
            }
        ])
    );

    data.set(newData);
};