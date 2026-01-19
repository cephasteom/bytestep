<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import { isPlaying, toggleIsPlaying, isRecording, toggleIsRecording, mapTransportKeys } from '$lib/stores/transport';
    import SVG from '$lib/components/SVG.svelte';
    import { onMount } from 'svelte';

    onMount(() => {
        return mapTransportKeys();
    });
</script>

<div class="transport">
    <Button
        onClick={toggleIsPlaying}
    >
        {#if $isPlaying}
            <SVG type="stop" />
        {:else}
            <SVG type="play" />
        {/if}
    </Button>
    <Button
        onClick={toggleIsRecording}
    >
        {#if $isRecording}
            <SVG type="circle--solid" />
        {:else}
            <SVG type="circle" />
        {/if}
    </Button>
</div>

<style>
    .transport {
        display: flex;
        gap: 0.5rem;
    }
</style>