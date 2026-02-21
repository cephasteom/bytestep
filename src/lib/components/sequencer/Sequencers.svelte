<script lang="ts">
    import { sequencers } from '$lib/stores/';
    import { addSequencer, removeLastSequencer } from '$lib/stores/sequencers';
    import Sequencer from './Sequencer.svelte';
</script>

<section class="sequencers">
    {#each Array($sequencers) as _, key}
        <Sequencer id={key} />
    {/each}
    <div class="sequencers__buttons">
        {#if $sequencers > 1}
            <button 
                class="sequencers__remove"
                on:click={removeLastSequencer}
            >
                -
            </button>
        {/if}
        {#if $sequencers < 8}
            <button 
                class="sequencers__add"
                on:click={addSequencer}
            >
                +
            </button>
        {/if}
    </div>
</section>

<style lang="scss">
    .sequencers {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: var(--spacer);

        &__buttons {
            display: flex;
            gap: calc(var(--spacer) / 2);
        }

        &__add, &__remove {
            display: flex;
            justify-content: flex-start;
            cursor: pointer;
            border: none;
            background-color: var(--black-lighter);
            border-radius: var(--border-radius);
            padding: calc(var(--spacer) / 2) var(--spacer);
            color: white;
            font-size: 1.25rem;
            text-transform: uppercase;
            letter-spacing: 0.1rem;
        }
    }
</style>