<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import Input from '$lib/components/Input.svelte';
    import SVG from '$lib/components/SVG.svelte';
    import { openMidiSettings } from '$lib/stores/midi';
    import { activeSequencer, data } from '$lib/stores/sequencers';
    import { 
        clearSequencer, 
        toggleRecord,
        toggleMute,
        setBytebeat,
    } from "$lib/stores/sequencers";

    export let id: number;

    const toggle = () => activeSequencer.update(activeId => activeId === id ? null : id);

    $: collapsed = $activeSequencer !== id;
    $: colour = `var(--theme-${(id % 5) + 1})`;
    $: record = $data[id]?.record || false;
    $: muted = $data[id]?.muted || false;
    $: bytebeat = $data[id]?.bytebeat || "t";
    
</script>

<header>
    <div>
        <h2>Sequencer 0{id + 1}</h2>
        
        <Button
            onClick={() => toggleRecord(id)}
            padding={'0'}
            ariaLabel={record ? "Stop recording" : "Start recording"}
        >
            <SVG 
                type={`circle${record ? "--solid" : ""}`} 
                fill="var(--theme-5)" 
                width={'1.25rem'}
            />
        </Button>

        <Button
            onClick={() => clearSequencer(id)}
            padding={'0'}
            ariaLabel="Clear sequencer"
        >
            <SVG 
                type="erase" 
                width={'1.25rem'}
            />
        </Button>
        
        <Button
            onClick={() => openMidiSettings(id)}
            padding={'0'}
            ariaLabel="Open MIDI settings"
        >
            <SVG 
                type="midi" 
                width={'1.25rem'}
            />
        </Button>

        <Button
            onClick={() => toggleMute(id)}
            padding={'0'}
            ariaLabel={muted ? "Unmute sequencer" : "Mute sequencer"}
        >
            <SVG 
                type={muted ? "mute" : "speaker"}
                width={'1.25rem'}
            />
        </Button>
    </div>
    <div>
        <Input
            value={bytebeat}
            onInput={(value) => setBytebeat(id, value)}
            flashOnInput={true}
            hasError={$data[id]?.hasError}
            prefix="(t, c) => "
            width="12rem"
        />
        <Button
            onClick={toggle}
            padding={'0'}
        >
            <SVG 
                type={collapsed ? 'down' : 'up'} 
                fill={colour} 
                width={'1.25rem'}
            />
        </Button>
    </div>
</header>

<style lang="scss">
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
        h2 {
            width: 8.5rem;
            margin: 0;
            color: white;
        }

        & > div {
            display: flex;
            align-items: center;
            gap: 2rem;

            &:last-child {
                gap: 1rem;
            }
        }
    }
</style>