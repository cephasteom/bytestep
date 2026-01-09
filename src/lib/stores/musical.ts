import { writable } from "svelte/store";

export const rows = 24;
export const cols = 32;

export const data = writable<Array<{ pitch: number; amp: number; duration: number }>[][]>([
    Array(rows).fill(null).map(() => Array(cols).fill({pitch: 0, amp: 0, duration: 0})),
    Array(rows).fill(null).map(() => Array(cols).fill({pitch: 0, amp: 0, duration: 0})),
    Array(rows).fill(null).map(() => Array(cols).fill({pitch: 0, amp: 0, duration: 0})),
    Array(rows).fill(null).map(() => Array(cols).fill({pitch: 0, amp: 0, duration: 0})),
]);