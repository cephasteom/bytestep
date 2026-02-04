<script lang="ts">
    import { sequencers } from '$lib/stores/';
    import { addSequencer } from '$lib/stores/sequencers';
    import Button from '../Button.svelte';
    import Tooltip from '../Tooltip.svelte';
    import Sequencer from './Sequencer.svelte';
</script>

<section class="sequencers">
    {#each Array($sequencers) as _, key}
        <Sequencer id={key} />
    {/each}
    {#if $sequencers < 8}
        <div class="sequencers__add">
            <Tooltip text="Add Sequencer" position="right">
                <Button
                    onClick={addSequencer}
                >+</Button>
            </Tooltip>
        </div>
    {/if}
</section>

<style lang="scss">
    .sequencers {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: var(--spacer);

        &__add {
            display: flex;
            justify-content: flex-start;
        }
    }
</style>