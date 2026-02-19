import { timeSignature } from "$lib/stores";
import { get } from "svelte/store";
import { getTransport } from "tone";

export function toneTimeToPosition(toneTime: string): number {
    const [bars, quarters, sixteenths] = toneTime.split(':').map(Number);
    const beats = 1 / get(timeSignature) * quarters;
    const divisions = Math.floor(sixteenths) / (get(timeSignature) * 4);
    return bars + beats + divisions;
}

export function getPosition() : number {
    const toneTime = getTransport().position as string;
    return toneTimeToPosition(toneTime);
}

export function mod(n: number, m: number): number {
    return ((n % m) + m) % m;
}

export function debounce<F extends (...args: any[]) => any>(func: F, wait: number): F {
    let timeout: ReturnType<typeof setTimeout>;
    return function(this: any, ...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    } as F;
}

export function clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
}

export function throttle(func: Function, delay: number) {
    let lastCall = 0;
    return (...args: any[]) => {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}

interface Element {
    x: number;
    y: number;
    width: number;
    height: number;
}
export function areTouching(el1: Element, el2: Element): boolean {
    const x1 = el1.x;
    const y1 = el1.y;
    const width1 = el1.width;
    const height1 = el1.height;

    const x2 = el2.x;
    const y2 = el2.y;
    const width2 = el2.width;
    const height2 = el2.height;

    return (
        x1 < x2 + width2 &&
        x1 + width1 > x2 &&
        y1 < y2 + height2 &&
        y1 + height1 > y2
    );
}
export const arraysAreEqual = (array1: any[], array2: any[]) => 
    array1.length === array2.length && array1.every((value, index) => value === array2[index]);

export function mapToRange(x: number, inMin: number, inMax: number, outMin: number, outMax: number)  {
    return ((x - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}