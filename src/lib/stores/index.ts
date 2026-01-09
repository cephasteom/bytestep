import { writable } from "svelte/store";

export const activeSequencer = writable<number | null>(null);