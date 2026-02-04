<script lang="ts">
    import { onMount } from 'svelte';
    
    import { bars, timeSignature } from '$lib/stores/';
    import { 
        isPlaying, toggleIsPlaying, 
        isRecording, toggleIsRecording, 
        isMetronome, toggleIsMetronome,
        mapTransportKeys, 
        bpm
    } from '$lib/stores/transport';
    import { globalBytebeat, setGlobalBytebeat } from '$lib/stores/sequencers';
    
    import { clamp } from '$lib/utils';
    
    import SVG from '$lib/components/SVG.svelte';
    import Input from '$lib/components/Input.svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import Button from '$lib/components/Button.svelte';

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
            <Tooltip text="Global Record">
                <Button
                    onClick={toggleIsRecording}
                >
                    <SVG type={`circle${$isRecording ? "--solid" : ""}`} fill="var(--theme-5)" />
                </Button>
            </Tooltip>
        </div>

        <div class="transport__item">
            <Tooltip text="Tempo">
                <Input 
                    value={$bpm} 
                    onInput={(value) => bpm.set(clamp(parseInt(value) || 120, 20, 250) )}
                    width="2.25rem"
                    suffix="BPM"
                />
            </Tooltip>
        </div>

        <div class="transport__item">
            <Tooltip text="Beats per bar">
                <Input 
                    value={$timeSignature} 
                    onInput={(value) => timeSignature.set(clamp(parseInt(value) || 4, 1, 7) )}
                    width=".75rem"
                    suffix="/ 4" 
                />
            </Tooltip>
        </div>

        <div class="transport__item">
            <Tooltip text="Number of bars in the loop">
                <Input 
                    value={$bars} 
                    onInput={(value) => bars.set(clamp(parseInt(value) || 2, 1, 4) )}
                    width=".75rem"
                    suffix="bars" 
                />
            </Tooltip>
        </div>        

        <div class="transport__item">
            <Tooltip text="Toggle metronome">
                <Button
                    onClick={toggleIsMetronome}
                >
                    <SVG type="metronome" fill={$isMetronome ? "var(--theme-1)" : "white"} />
                </Button>
            </Tooltip>
        </div>
    </div>
    <Tooltip text="Bytebeat expression for global time. t = time, c = cycle.">
        <Input
            value={$globalBytebeat.bytebeat}
            onInput={(value) => setGlobalBytebeat(value)}
            hasError={$globalBytebeat.hasError}
            flashOnInput={true}
            prefix="(t, c) => "
            width="14.3rem"
        />
    </Tooltip>
</div>

<style lang="scss">
    .transport {
        display: flex;
        justify-content: space-between;
        align-items: center;
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