import { writable, derived } from "svelte/store";

export const sequencers = 4;
export const bars = 2;
export const timeSignature = writable<number>(4); // denominator of time signature

export const divisions = derived(timeSignature, $timeSignature => $timeSignature * 4);