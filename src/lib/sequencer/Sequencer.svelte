<script lang="ts">
    const rows = 24;
    const cols = 32;

    let currentRow = 2;

    const cells = Array(rows).fill(null).map(() => Array(cols).fill(false));
</script>

<section 
    class="sequencer"   
    role="application"
    on:mouseleave={() => currentRow = -1}
>
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
    <div class="sequencer__grid">
        {#each Array(cols) as _, colIndex}
            {#each Array(rows) as _, rowIndex}
                <button 
                    class="sequencer__cell" 
                    data-col={colIndex} 
                    data-row={rowIndex}
                    style="grid-column: {colIndex + 1}; grid-row: {rowIndex + 1};}"
                    class:sequencer__cell--highlighted={!(Math.floor(colIndex / 4) % 2)}
                    class:sequencer__cell--active={cells[rowIndex][colIndex]}
                    aria-label="Toggle cell at row {rowIndex + 1}, column {colIndex + 1}"
                    on:click={() => cells[rowIndex][colIndex] = !cells[rowIndex][colIndex]}
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
        border: 1px solid white;
        border-radius: 2px;
        display: grid;
        grid-template-columns: auto 1fr;

        &__piano {
            display: grid;
            grid-template-rows: repeat(rows, .5fr);
            grid-template-columns: 1fr;
            width: 1.5rem;
            border-right: 1px solid rgba(255, 255, 255, 0.5);

            &-key {
                background-color: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
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
            border: 1px solid rgba(255, 255, 255, 0.1);
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