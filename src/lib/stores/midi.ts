import { writable, get } from "svelte/store";
import { WebMidi } from "webmidi";
import { data } from "./sequencer";

export const inputs = writable<any[]>([]);
export const outputs = writable<any[]>([]);

WebMidi.enable().then(() => {
    inputs.set(WebMidi.inputs.map(input => input.name));
    outputs.set(WebMidi.outputs.map(output => output.name));
});

export const connections = writable<{[sequencer: number]: {input: string | null, output: string | null}}>(
    Object.keys(get(data)).reduce((acc, key) => ({ ...acc, [key]: { input: null, output: null } }), {})
);

connections.subscribe((conns) => console.log("MIDI Connections:", conns));

const connect = (type: "input" | "output", sequencer: number, device: string | null) => {
    connections.update((conns) => ({
        ...conns,
        [sequencer]: {
            ...conns[sequencer],
            [type]: device
        }
    }));
};

export const connectInput = (sequencer: number, inputName: string | null) => {
    connect("input", sequencer, inputName);
};

export const connectOutput = (sequencer: number, outputName: string | null) => {
    connect("output", sequencer, outputName);
};