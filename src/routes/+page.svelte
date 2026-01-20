<script lang="ts">
    import '/node_modules/normalize.css/normalize.css';
    import '$lib/styles.css';
    import { onMount } from 'svelte';
    import { loadAllStoreData } from '$lib/stores/localstorage';
    import { initCodeListeners } from '$lib/stores/code';
    import { sequencers } from '$lib/stores/sequencer';
    
    import Sequencer from '$lib/components/sequencer/Sequencer.svelte';
    import Transport from '$lib/components/transport/Transport.svelte';
    import Editor from '$lib/components/editor/Editor.svelte';

    onMount(() => {
        loadAllStoreData()
        initCodeListeners();
    });
</script>

<main>
    <Editor />
    <Transport />
    
    <div class="sequencers">
        {#each Array(sequencers) as _, key}
            <Sequencer id={key} />
        {/each}
    </div>
</main>

<style lang="scss">
    main {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .sequencers {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: .5rem;
    }
</style>