<script lang="ts">
    import { activeSequencer } from "$lib/stores";

    export let id: number;
    const rows = 24;
    const cols = 32;
    let currentRow = -1;

    let cells = Array(rows).fill(null).map(() => Array(cols).fill(false));

    const toggle = () => activeSequencer.update(activeId => 
        activeId === id 
            ? null 
            : id);

    $: collapsed = $activeSequencer !== id;
</script>

<section 
    class="sequencer"
    class:sequencer--collapsed={collapsed}
>
    <div class="sequencer__meta">
        <button on:click={toggle}>{collapsed ? '▲' : '▼'}</button> 
    </div>
    <div class="sequencer__piano">
        {#each Array(rows) as _, rowIndex}
            <div 
                class="sequencer__piano-key" 
                style="grid-row: {rowIndex + 1};"
                class:sequencer__piano-key--accidental={[1, 3, 6, 8, 10].includes(12 - (rowIndex % 12) - 1)}
                class:sequencer__piano-key--active={rowIndex === currentRow}
            ></div>
        {/each}
    </div>
    <div 
        class="sequencer__grid"
        role="application"
        on:mouseleave={() => currentRow = -1}
    >
        {#each Array(cols) as _, colIndex}
            {#each Array(rows) as _, rowIndex}
                <button 
                    class="sequencer__cell" 
                    data-col={colIndex} 
                    data-row={rowIndex}
                    style="grid-column: {colIndex + 1}; grid-row: {rowIndex + 1};}"
                    class:sequencer__cell--highlighted={!(Math.floor(colIndex / 4) % 2)}
                    class:sequencer__cell--active={
                        collapsed
                            ? cells.some(row => row[colIndex]) && rowIndex === 0
                            : cells[rowIndex][colIndex]
                    }
                    aria-label="Toggle cell at row {rowIndex + 1}, column {colIndex + 1}"
                    on:click={() => {
                        collapsed
                            ? (cells = cells.map((row) => row.map((cell, cIndex) => cIndex === colIndex ? false : cell)))
                            : cells[rowIndex][colIndex] = !cells[rowIndex][colIndex]
                    }}
                    on:mouseover={() => currentRow = rowIndex}
                    on:focus={() => currentRow = rowIndex}
                >
                </button>
            {/each}
        {/each}
    </div>
</section>

<style lang="scss">
    .sequencer {
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: grid;
        grid-template-columns: auto auto 1fr;
        max-height: calc(24 * 1.5rem);
        transition: max-height 0.3s ease;
        overflow: hidden;

        &--collapsed {
            transition: max-height 0.3s ease;
            max-height: 1.5rem;
        }

        &__meta {
            width: 3rem;

            & button {
                width: 100%;
                height: 1.5rem;
                background: none;
                border: none;
                color: white;
                font-size: 1rem;
                cursor: pointer;
            }
        }

        &__piano {
            display: grid;
            grid-template-rows: repeat(rows, .5fr);
            grid-template-columns: 1fr;
            width: 1.5rem;

            &-key {
                background-color: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-sizing: border-box;
                height: 1.5rem;
                
                &--accidental {
                    background-color: rgba(0, 0, 0, 0.05);
                }

                &--active {
                    background-color: var(--theme-2);
                }
            }
        }
        &__grid {
            display: grid;
            width: 100%;
            height: 100%;
            grid-template-columns: repeat(cols, 1fr);
            grid-template-rows: repeat(rows, .5fr);
        }

        &__cell {
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-sizing: border-box;
            height: 1.5rem;
            background-color: transparent;
            cursor: pointer;
            padding: 0;
            position: relative;

            &--highlighted {
                background-color: rgba(255, 255, 255, 0.05);
            }
            &:hover:not(&--active) {
                background-color: rgba(255, 255, 255, 0.1);
            }
            &--active {
                background-color: var(--theme-2);
            }
        }
    }
</style>