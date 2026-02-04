import { Gain, Oscillator } from "tone";

export function beepAt(time: number, amp: number = 1) {

    const osc = new Oscillator();
    const gain = new Gain(amp);
    osc.connect(gain);
    gain.toDestination();

    osc.start(time);
    osc.stop(time + 0.01);
}