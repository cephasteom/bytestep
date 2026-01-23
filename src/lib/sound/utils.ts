import { Gain, Oscillator, immediate, now } from "tone";

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

export function beepAt(time: number, amp: number = 1) {

    const osc = new Oscillator();
    const gain = new Gain(amp);
    osc.connect(gain);
    gain.toDestination();

    osc.start(time);
    osc.stop(time + 0.01);
}