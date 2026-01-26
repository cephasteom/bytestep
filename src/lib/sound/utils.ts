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

export function isValidBytebeat(expr: string): boolean {
    if(expr.trim() === '') return false;
    // remove strings and numbers to avoid false positives
    const cleaned = expr
        .replace(/(["'`])(?:\\.|(?!\1).)*\1/g, '') // strings
        .replace(/\b\d+(\.\d+)?\b/g, '');          // numbers

    const identifiers = cleaned.match(/\b[a-zA-Z_]\w*\b/g) || [];

    const allowed = new Set(['t', 'c']);

    if(!identifiers.every(id => allowed.has(id))) return false;

    try {
        eval(`(function(t, c) { return ${expr}; })`);
        return true;
    } catch {
        return false;
    }
}

export function mod(n: number, m: number): number {
    return ((n % m) + m) % m;
}