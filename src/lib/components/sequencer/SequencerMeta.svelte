<script lang="ts">
    import Slider from '$lib/components/Slider.svelte';
    export let id: number;
</script>

<aside>
    <h3 class="sr-only">Sequencer Meta</h3>

    <Slider id={`sequencer-${id}-amp`} min={0} max={1} value={0.75} colour={`colour${id + 1}`} name="Amplitude" />

</aside>

<style lang="scss">
    aside {
        position: relative;
    }
</style>