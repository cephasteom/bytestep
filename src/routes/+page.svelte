<script lang="ts">
    import '/node_modules/normalize.css/normalize.css';
    import '$lib/styles.css';

    import Sequencer from '$lib/sequencer/Sequencer.svelte';
</script>

<main>
    <div class="sequencers">
        <Sequencer id={0} />
        <Sequencer id={1} />
        <Sequencer id={2} />
        <Sequencer id={3} />
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