import { Oscillator, immediate, now } from "tone";

export function memorize<T>(fn: (arg: T) => any): (arg: T) => any {
    const cache = new Map<T, any>();
    return (arg: T) => {
        if (cache.has(arg)) {
            return cache.get(arg);
        }
        const result = fn(arg);
        cache.set(arg, result);
        return result;
    };
}

export function beepAt(time: number) {

    const osc = new Oscillator();
    osc.toDestination();

    osc.start(time);
    osc.stop(time + 0.01);
}