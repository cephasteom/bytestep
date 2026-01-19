import { WebMidi } from "webmidi";
import { connections } from "./midi";
import { data } from "./sequencer";

/**
 * Load all store data from localStorage
 */
export const loadAllStoreData = () => {
    WebMidi.enable().then(() => {
        const midiConnections = localStorage.getItem("bs.midiConnections") || ''
        connections.update((conns) => ({
            ...conns,
            ...JSON.parse(midiConnections)
        }));
    });

    const sequencerData = localStorage.getItem("bs.sequencerData") || ''
    data.update((d) => ({
        ...d,
        ...JSON.parse(sequencerData)
    }));
}