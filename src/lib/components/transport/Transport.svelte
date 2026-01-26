<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import { 
        isPlaying, toggleIsPlaying, 
        isRecording, toggleIsRecording, 
        isMetronome, toggleIsMetronome,
        mapTransportKeys, 
        bpm
    } from '$lib/stores/transport';
    import { timeSignature } from '$lib/stores/';
    import SVG from '$lib/components/SVG.svelte';
    import { onMount } from 'svelte';
    import Input from '$lib/components/Input.svelte';

    onMount(() => {
        // return mapTransportKeys();
    });
</script>

<div class="transport">
    <div class="transport__item">
        <Button
            onClick={toggleIsPlaying}
        >
            <SVG type={$isPlaying ? 'stop' : 'play'} fill={$isPlaying ? "var(--theme-4)" : "var(--theme-1)"} />
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
        <Input 
            bind:value={$bpm} 
            units="BPM"
        />
    </div>

    <div class="transport__item">
        <Input 
            bind:value={$timeSignature} 
            units="/ 4" 
        />
    </div>

    <div class="transport__item">
        <Button
            onClick={toggleIsMetronome}
        >
            <SVG type="metronome" fill={$isMetronome ? "var(--theme-1)" : "white"} />
        </Button>
    </div>
</div>

<style lang="scss">
    .transport {
        display: flex;
        align-items: center;
        gap: var(--spacer);
        background-color: var(--black-lighter);
        border-radius: var(--border-radius);
        padding: calc(var(--spacer) / 2) var(--spacer);

        &__item {
            padding-right: var(--spacer);
            border-right: 1px solid var(--grey-lighter);

            &:last-child {
                border-right: none;
                padding-right: 0;
            }
        }
    }
</style>