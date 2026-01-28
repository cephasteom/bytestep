import { WebMidi } from "webmidi";
import { connections, midiSettingsActive } from "./midi";
import { data } from "./sequencers";
import { bpm, isMetronome } from "./transport";
import { timeSignature } from ".";

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

    midiSettingsActive.set(retrieve<string>('bs.midiSettingsActive', 'all'));

    // populate sequencer data
    data.update((d) => ({
        ...d,
        ...retrieve<any>('bs.sequencerData', {})
    }));

    // populate transport data
    isMetronome.set(retrieve<boolean>('bs.isMetronome', false));
    bpm.set(retrieve<number>('bs.bpm', 120));
    timeSignature.set(retrieve<number>('bs.timeSignature', 4));

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

function retrieve<T>(key: string, defaultValue: T): T {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) return defaultValue;
    try {
        return JSON.parse(storedValue) as T;
    } catch {
        return defaultValue;
    }
}