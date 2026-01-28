<script lang="ts">
    import { sequencerTs } from '$lib/stores/transport';
    import { bars, divisions } from "$lib/stores/";
    import Cell from "./Cell.svelte";

    export let id: number;
    export let colour: string;
</script>

<div class="progress">
    {#each Array($divisions * bars) as _, divisionIndex}
        <Cell 
            division={divisionIndex}
            note={0}
            row={0}
            highlighted={!(Math.floor(divisionIndex / 4) % 2)}
            active={$sequencerTs[id] !== -1 && $sequencerTs[id] % ($divisions * bars) === divisionIndex}
            colour={colour}
            height="0.5rem"
        />
    {/each}
</div>

<style lang="scss">
    .progress {
        display: grid;
        grid-template-columns: repeat(calc(get(divisions) * bars), 1fr);
        grid-template-rows: 1fr;
        gap: 3px;
        position: relative;
    }
</style>