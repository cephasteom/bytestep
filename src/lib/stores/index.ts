import { writable, derived } from "svelte/store";
import { persist } from "./localstorage";

export const sequencers = writable<number>(3);
sequencers.subscribe(persist('bs.sequencers'));

export const bars = writable<number>(4);
bars.subscribe(persist('bs.bars'));

export const timeSignature = writable<number>(4); // denominator of time signature
timeSignature.subscribe(persist('bs.timeSignature'));

export const divisions = derived(timeSignature, $timeSignature => $timeSignature * 4);

export const showAbout = writable(false);
export const showHelp = writable(false);