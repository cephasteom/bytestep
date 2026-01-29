import { writable, derived } from "svelte/store";
import { persist } from "./localstorage";

export const sequencers = 3;
export const bars = 4;
export const timeSignature = writable<number>(4); // denominator of time signature
timeSignature.subscribe(persist('bs.timeSignature'));

export const divisions = derived(timeSignature, $timeSignature => $timeSignature * 4);

export const showAbout = writable(false);