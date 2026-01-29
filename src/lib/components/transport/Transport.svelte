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
    import { globalBytebeat, setGlobalBytebeat } from '$lib/stores/sequencers';
  import { clamp } from '$lib/utils';

    onMount(() => mapTransportKeys());
</script>

<div class="transport">
    <div>

    
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
                width="2.25rem"
                suffix="BPM"
            />
        </div>

        <div class="transport__item">
            <Input 
                value={$timeSignature} 
                onInput={(value) => timeSignature.set(clamp(parseInt(value) || 4, 1, 7) )}
                width=".75rem"
                suffix="/ 4" 
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
    <Input
        value={$globalBytebeat.bytebeat}
        onInput={(value) => setGlobalBytebeat(value)}
        hasError={$globalBytebeat.hasError}
        flashOnInput={true}
        prefix="(t, c) => "
        width="14.3rem"
    />
</div>

<style lang="scss">
    .transport {
        display: flex;
        justify-content: space-between;
        & > div {
            display: flex;
            align-items: center;
            gap: var(--spacer);
        }
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