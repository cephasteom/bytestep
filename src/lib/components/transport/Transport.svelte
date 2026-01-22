<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import { isPlaying, toggleIsPlaying, isRecording, toggleIsRecording, mapTransportKeys, toggleIsMetronome, isMetronome } from '$lib/stores/transport';
    import SVG from '$lib/components/SVG.svelte';
    import { onMount } from 'svelte';

    onMount(() => {
        // return mapTransportKeys();
    });
</script>

<div class="transport">
    <div class="transport__item">
        <Button
            onClick={toggleIsPlaying}
        >
            {#if $isPlaying}
                <SVG type="stop" />
            {:else}
                <SVG type="play" />
            {/if}
        </Button>
    </div>
    
    <div class="transport__item">
        <Button
            onClick={toggleIsRecording}
        >
            <SVG type={`circle${$isRecording ? "--solid" : ""}`} fill="var(--theme-5)" />
        </Button>
    </div>

    <div class="transport__item">
        <Button
            onClick={toggleIsMetronome}
        >
            {#if $isMetronome}
                <SVG type="bell--solid" />
            {:else}
                <SVG type="bell" />
            {/if}
        </Button>
    </div>
</div>

<style lang="scss">
    .transport {
        display: flex;
        gap: var(--spacer);
        background-color: var(--black-lighter);
        border-radius: var(--border-radius);
        padding: calc(var(--spacer) / 2) var(--spacer);

        &__item {
            padding-right: var(--spacer);
            border-right: 1px solid var(--grey-lighter);
        }
    }
</style>