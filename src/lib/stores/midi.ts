import { writable, get } from "svelte/store";
import { WebMidi } from "webmidi";
import { data, addNote } from "./sequencer";
import { isRecording, timeToPosition } from "./transport";
import { immediate } from "tone";

export const inputs = writable<any[]>([]);
export const outputs = writable<any[]>([]);
export const connections = writable<{[sequencer: number]: {input: string | null, output: string | null}}>(
    Object.keys(get(data)).reduce((acc, key) => ({ ...acc, [key]: { input: null, output: null } }), {})
);

const populate = () => {
    inputs.set(WebMidi.inputs.map(input => input.name));
    outputs.set(WebMidi.outputs.map(output => output.name));
};

const addListeners = () => {
    // remove existing listeners
    WebMidi.inputs.forEach(input => input.removeListener());
    // add listeners
    WebMidi.inputs.forEach(input => {
        input.addListener("noteon", (e) => {
            if(!get(isRecording)) return;
            Object.entries(get(connections))
                .filter(([_, conn]) => conn.input === input.name)
                .forEach(([sequencer, _]) => {
                    const position = timeToPosition(immediate() * 1000);
                    addNote(
                        parseInt(sequencer),
                        position,
                        e.note.number,
                        // @ts-ignore
                        e.velocity || 0.75,
                        0.25
                    );
                });
        });
    });
};

const configure = () => {
    populate();
    addListeners();
}

WebMidi.enable().then(() => {
    configure();
    WebMidi.addListener("connected", configure);
    WebMidi.addListener("disconnected", configure);
});

const connect = (type: "input" | "output", sequencer: number, device: string | null) => {
    connections.update((conns) => ({
        ...conns,
        [sequencer]: {
            ...conns[sequencer],
            [type]: device
        }
    }));
    // persist to localstorage
    localStorage.setItem("bs.midiConnections", JSON.stringify(get(connections)));
};

export const connectInput = (sequencer: number, inputName: string | null) => {
    connect("input", sequencer, inputName);
    addListeners();
};

export const connectOutput = (sequencer: number, outputName: string | null) => {
    connect("output", sequencer, outputName);
};