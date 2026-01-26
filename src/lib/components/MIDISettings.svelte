<script lang="ts">
    import { midiSettingsOpen } from '$lib/stores/midi';
    import { sequencers } from '$lib/stores';
    import Dialog from '$lib/components/Dialog.svelte';
</script>

<Dialog 
    bind:open={$midiSettingsOpen}
    title="MIDI Settings"
>
    <select id="midi-settings">
        <option selected>Global</option>
        {#each Array(sequencers) as _, i}
            <option value={i}>Sequencer 0{i + 1}</option>
        {/each}
    </select>
    <h3>MIDI In</h3>
    <section>
        <label for="midi-in-device">Device</label>
        <select id="midi-in-device">
            <option disabled selected>Select a device</option>
            <!-- Options will be populated dynamically -->
        </select>
        <label for="midi-in-channel">Channel</label>
        <select id="midi-in-channel">
            <option selected>All</option>
            <!-- Options will be populated dynamically -->
        </select>
    </section>

    <h3>MIDI Out</h3>
    <section>
        <label for="midi-out-device">Device</label>
        <select id="midi-out-device">
            <option disabled selected>Select a device</option>
            <!-- Options will be populated dynamically -->
        </select>
        <label for="midi-out-channel">Channel</label>
        <select id="midi-out-channel">
            <option selected>All</option>
            <!-- Options will be populated dynamically -->
        </select>
    </section>
</Dialog>

<style lang="scss">
    h3 {
        padding-bottom: .5rem;
        border-bottom: 1px solid white;
    }

    section {
        margin-bottom: 1rem;
    }
</style>