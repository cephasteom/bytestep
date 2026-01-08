import { writable } from "svelte/store";

export const activeSequencer = writable<number | null>(null);
activeSequencer.subscribe((value) => {
    console.log("Active Sequencer ID:", value);
});