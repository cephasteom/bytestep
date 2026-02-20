<script lang="ts">
    import { onMount } from 'svelte';
    
    import '/node_modules/normalize.css/normalize.css';
    import '$lib/styles.css';
    
    import { loadAllStoreData } from '$lib/stores/localstorage';
    import { showSequencers } from '$lib/stores/sequencers';
    import { showCircuit } from '$lib/stores/circuit';
    
    import Transport from '$lib/components/transport/Transport.svelte';
    import Sequencers from '$lib/components/sequencer/Sequencers.svelte';
    import Header from '$lib/components/Header.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';
    import About from '$lib/components/About.svelte';
    import MIDISettings from '$lib/components/MIDISettings.svelte';
    import Circuit from '$lib/components/circuit/Circuit.svelte';

    onMount(loadAllStoreData);
</script>

<main>
    <!-- Modals -->
    <About />
    <MIDISettings />

    <!-- Main app -->
    <Header />
    <div class="layout">
        <Sidebar />
        <div class="app">
            <Transport />

            <div class="app__lower">
                {#if $showCircuit}
                    <Circuit />
                {/if}
                {#if $showSequencers}
                    <Sequencers />
                {/if}
            </div>
        </div>
    </div>
</main>

<style lang="scss">
    main {
        min-height: 100vh;
    }
    .layout {
        min-height: calc(100vh - var(--header-height));
        box-sizing: border-box;
        display: flex;
        align-items: flex-start;
        overflow-x: scroll;
    }

    .app {
        width: 100%;
        height: calc(100vh - var(--header-height));
        overflow: scroll;
        padding: var(--spacer);
        display: flex;
        flex-direction: column;
        gap: var(--spacer);
        box-sizing: border-box;
        min-width: 1200px;

        &__lower {
            display: flex;
            gap: var(--spacer);
            min-height: calc(100% - 6rem);
        }
    }
</style>