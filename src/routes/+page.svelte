<script lang="ts">
    import '/node_modules/normalize.css/normalize.css';
    import '$lib/styles.css';
    import { onMount } from 'svelte';
    import { loadAllStoreData } from '$lib/stores/localstorage';
    import { initCodeListeners } from '$lib/stores/code';
    
    import Transport from '$lib/components/transport/Transport.svelte';
    import Sequencers from '$lib/components/sequencer/Sequencers.svelte';
    import Header from '$lib/components/Header.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';

    onMount(() => {
        loadAllStoreData()
        initCodeListeners();
    });
</script>


<main>
    <Header />
    <div class="layout">
        <Sidebar />
        <div class="app">
            <Transport />
            <Sequencers />
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
    }

    .app {
        width: 100%;
        padding: var(--spacer);
        display: flex;
        flex-direction: column;
        gap: var(--spacer);
        height: calc(100vh - var(--header-height));
        box-sizing: border-box;
        overflow: scroll;
    }
</style>