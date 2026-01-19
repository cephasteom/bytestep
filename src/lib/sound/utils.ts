const audioCtx = new AudioContext();

export function beepAt(time: number) {
    const osc = audioCtx.createOscillator();

    osc.type = 'sine';
    osc.frequency.value = 1000;

    osc.connect(audioCtx.destination);

    const startTime = audioCtx.currentTime + time;

    osc.start(startTime);
    osc.stop(startTime + 10 / 1000);
}
