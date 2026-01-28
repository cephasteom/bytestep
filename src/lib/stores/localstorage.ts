import { WebMidi } from "webmidi";
import { connections, midiSettingsActive } from "./midi";
import { activeSequencer, data, globalBytebeat, showSequencers } from "./sequencers";
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

    showSequencers.set(retrieve<boolean>('bs.showSequencers', true));

    globalBytebeat.set(retrieve<{ bytebeat: string; hasError: boolean }>('bs.globalBytebeat', {
        bytebeat: "t",
        hasError: false
    }));
    // populate sequencer data
    data.update((d) => ({
        ...d,
        ...retrieve<any>('bs.sequencerData', {})
    }));
    activeSequencer.set(retrieve<number | null>('bs.activeSequencer', null));

    // populate transport data
    isMetronome.set(retrieve<boolean>('bs.isMetronome', false));
    bpm.set(retrieve<number>('bs.bpm', 120));
    timeSignature.set(retrieve<number>('bs.timeSignature', 4));
    
}

/**
 * Pass to a store to have it persist its data to localStorage on changes
 * @param key The localStorage key to use
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

/**
 * Retrieve and parse a value from localStorage
 * @param key The localStorage key to retrieve
 * @param defaultValue The default value to return if no value is found
 * @returns The parsed value from localStorage, or the default value
 */
function retrieve<T>(key: string, defaultValue: T): T {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) return defaultValue;
    try {
        return JSON.parse(storedValue) as T;
    } catch {
        return defaultValue;
    }
}