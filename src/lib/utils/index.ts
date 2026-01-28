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