import { Satori } from '@cephasteom/satori/src/core/Satori.ts';
import { handler as midiHandler } from '@cephasteom/satori/src/core/MIDI';
import { data, notes } from '$lib/stores/sequencers';
import { divisions, bars } from '$lib/stores';
import { get } from 'svelte/store';

export const satori = new Satori(midiHandler);

// TODO: sync cps between the two apps

function notesToSatoriParam(
    notes: {position: number, note: number, amp: number, duration: number}[], 
    param: 'note' | 'amp' | 'duration'
) {
    return Array(get(bars)).fill(null).map((_, bar) => 
        Array(get(divisions)).fill(null).map((_, division) => {
            const position = bar + division / get(divisions)
            const note = notes.find(n => n.position === position);
            return note 
                ? note[param]
                : 0;
        }).join(' ')
    ).join(' | ');
}

console.log(notesToSatoriParam([{position: 0, note: 13, amp: 0.5, duration: 0.0625}], 'note'));

/**
 * Subscribe to sequencer data changes and convert to Satori code.
 */
data.subscribe((sequencers) => {
    const d = Object.values(sequencers).reduce((obj, sequencer, i) => ({
        ...obj,
        [i]: {
            n: notesToSatoriParam(sequencer.notes, 'note'),
            amp: notesToSatoriParam(sequencer.notes, 'amp'),
            dur: notesToSatoriParam(sequencer.notes, 'duration'),
        },
    }), {});
    // satori.evaluate(d)
})
