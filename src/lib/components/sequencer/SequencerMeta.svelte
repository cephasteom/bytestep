<script lang="ts">
    import Slider from '$lib/components/Slider.svelte';
    export let id: number;
    export let amp: number = 0.75;
    export let onChangeAmp: (value: number) => void = () => {};

    export let dur: number = 0.75;
    export let onChangeDur: (value: number) => void = () => {};
</script>

<aside>
    <h3 class="sr-only">Sequencer Meta</h3>

    <Slider 
        id={`sequencer-${id}-amp`} 
        min={0} max={1} value={amp} 
        colour={id + 1} name="Amplitude" decimals={2}
        onChange={onChangeAmp}
    />
    <Slider 
        id={`sequencer-${id}-dur`} 
        min={0.125} max={4} step={0.125} value={dur} 
        colour={id + 1} name="Duration" decimals={3}
        onChange={onChangeDur}
    />
</aside>

<style lang="scss">
    aside {
        position: relative;
        display: flex;
        gap: 2rem;
    }
</style>