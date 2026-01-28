export function isValidBytebeat(expr: string): boolean {
    if(expr.trim() === '') return false;
    // remove strings, numbers, and Math object methods to avoid false positives
    const cleaned = expr
        .replace(/(["'`])(?:\\.|(?!\1).)*\1/g, '') // strings
        .replace(/\b\d+(\.\d+)?\b/g, '')          // numbers
        .replace(/\bMath\.\w+\b/g, '');          // Math methods


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

export function evalBytebeat(expr: string, t: number, c: number): number {
    try {
        const fn = new Function('t', 'c', `return ${expr};`);
        return fn(t, c);
    } catch {
        return t; // fallback to a simple output
    }
}