<script lang="ts">
    import '/node_modules/normalize.css/normalize.css';
    import '$lib/styles.css';

    import Sequencer from '$lib/sequencer/Sequencer.svelte';
    import { data } from '$lib/stores/musical';
</script>

<main>
    <div class="sequencers">
        {#each $data as _, index}
            <Sequencer id={index} />
        {/each}
    </div>
</main>

<style lang="scss">
    .sequencers {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: .5rem;
    }
</style>