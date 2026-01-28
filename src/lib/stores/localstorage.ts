import { WebMidi } from "webmidi";
import { connections, midiSettingsActive } from "./midi";
import { data } from "./sequencers";
import { isMetronome } from "./transport";

/**
 * Load all store data from localStorage
 */
export const loadAllStoreData = () => {    
    // populate MIDI connections
    WebMidi.enable().then(() => {
        const midiConnections = localStorage.getItem("bs.midiConnections") || '{}'
        connections.update((conns) => ({
            ...conns,
            ...JSON.parse(midiConnections)
        }));
    });

    midiSettingsActive.set(localStorage.getItem("bs.midiSettingsActive") || 'all');

    // populate sequencer data
    const sequencerData = localStorage.getItem("bs.sequencerData") || '{}'
    data.update((d) => ({
        ...d,
        ...JSON.parse(sequencerData)
    }));

    // populate transport data
    const isMetronomeData = localStorage.getItem("bs.isMetronome") || 'false'
    isMetronome.set(JSON.parse(isMetronomeData));
}

/**
 * Pass to a store to have it persist its data to localStorage on changes
 * @example store.subscribe(persist('bs.storeKey'))
 * @returns A function that can be passed to a store's subscribe method
 */
export function persist(key: string) {
    // ignore the first call to avoid overwriting existing data
    let isFirst = true;
    return (value: any) => {
        if (isFirst) {
            isFirst = false;
            return;
        }
        localStorage.setItem(key, JSON.stringify(value));
    };
}