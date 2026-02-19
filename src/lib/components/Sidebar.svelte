<script lang="ts">
  import Button from "./Button.svelte";
  import SVG from "./SVG.svelte";
  import { openMidiSettings, showMidiSettings } from '$lib/stores/midi';
  import { showSequencers } from "$lib/stores/sequencers";
  import { showCircuit } from "$lib/stores/circuit";
</script>

<aside class="sidebar">
    <Button
        label="Step"
        padding={'0'}
        onClick={() => showSequencers.update(v => !v)}
        isActive={$showSequencers}
    >
        <SVG type="piano" width="2rem" />
    </Button>

    <Button
        label="Qbts"
        padding={'0'}
        onClick={() => showCircuit.update(v => !v)}
        isActive={$showCircuit}
    >
        <SVG type="piano" width="2rem" />
    </Button>
    
    <Button
        label="MIDI"
        padding={'0'}
        onClick={() => openMidiSettings()}
        isActive={$showMidiSettings}
    >
        <SVG type="midi" width="2rem" />
    </Button>
</aside>

<style lang="scss">
    .sidebar {
        padding: 7.9rem var(--spacer) var(--spacer) var(--spacer);
        background-color: var(--black-lighter);
        min-height: calc(100vh - var(--header-height));
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 3rem;
    }
</style>