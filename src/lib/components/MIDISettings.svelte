<script lang="ts">
    import { 
        showMidiSettings, midiSettingsActive,
        inputs, outputs, 
        connectInput, connectOutput, 
        setInputChannel, setOutputChannel,
        connections 
    } from '$lib/stores/midi';
    
    import { sequencers } from '$lib/stores';
    import Dialog from '$lib/components/Dialog.svelte';
    import Select from './Select.svelte';
</script>

<Dialog 
    bind:open={$showMidiSettings}
    title="MIDI Settings"
>
    <h3>Sequencer</h3>
    <Select 
        id="midi-settings-for"
        value={$midiSettingsActive}
        options={ Array.from({length: $sequencers }, (_, i) => ({ label: `${i + 1}`, value: i })) }
        onChange={(value) => midiSettingsActive.set(Number(value))}
    />
    <h3>MIDI In</h3>
    <section>
        <Select 
            id="midi-in-device"
            label="Device"
            value={$connections[$midiSettingsActive]?.input || ''}
            options={ $inputs.map(input => ({ label: input, value: input })) }
            onChange={(value) => connectInput($midiSettingsActive, `${value}`)}
            />
        <Select 
            id="midi-in-channel"
            label="Channel"
            value={$connections[$midiSettingsActive]?.inputChannel === null ? 'all' : $connections[$midiSettingsActive]?.inputChannel}
            options={[{ label: 'All', value: 'all' }, ...Array.from({ length: 16 }, (_, i) => ({ label: `${i + 1}`, value: i }))]}
            onChange={(value) => setInputChannel($midiSettingsActive, value === 'all' ? null : value ? +value : null )}
        />
    </section>

    <h3>MIDI Out</h3>
    <section>
        <Select 
            id="midi-out-device"
            label="Device"
            options={ $outputs.map(output => ({ label: output, value: output })) }
            value={$connections[$midiSettingsActive]?.output || ''}
            onChange={(value) => connectOutput($midiSettingsActive, `${value}`)}
            />
        <Select 
            id="midi-out-channel"
            label="Channel"
            value={$connections[$midiSettingsActive]?.outputChannel === null ? 'all' : $connections[$midiSettingsActive]?.outputChannel}
            options={[{ label: 'All', value: 'all' }, ...Array.from({ length: 16 }, (_, i) => ({ label: `${i + 1}`, value: i }))]}
            onChange={(value) => setOutputChannel($midiSettingsActive, value === 'all' ? null : value ? +value : null )}
            />
    </section>
</Dialog>

<style lang="scss">
    h3 {
        padding-bottom: .5rem;
        border-bottom: 1px solid white;
    }

    section {
        margin-bottom: 1rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
</style>