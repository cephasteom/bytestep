<script lang="ts">
    import '/node_modules/normalize.css/normalize.css';
    import '$lib/styles.css';

    import Sequencer from '$lib/components/sequencer/Sequencer.svelte';
    import { sequencers } from '$lib/stores/sequencer';
    import Transport from '$lib/components/transport/Transport.svelte';
    import { onMount } from 'svelte';
    import { loadAllStoreData } from '$lib/stores/localstorage';

    onMount(() => {
        loadAllStoreData();    
    });
</script>

<main>
    <Transport />
    
    <div class="sequencers">
        {#each Array(sequencers) as _, key}
            <Sequencer id={key} />
        {/each}
    </div>
</main>

<style lang="scss">
    main {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .sequencers {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: .5rem;
    }
</style>