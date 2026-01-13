<script lang="ts">
    import { activeSequencer } from "$lib/stores";
    import { data, toggleNote, moveNote, divisions, bars, notes } from "$lib/stores/musical";

    export let id: number;
    let currentRow = -1;
    
    // for moving
    let mouseIsDown = false;
    let startCol = -1;
    let startRow = -1;

    const toggle = () => activeSequencer.update(activeId => 
        activeId === id 
        ? null 
        : id);

    const handleMouseDown = (colIndex: number, rowIndex: number) => {
        mouseIsDown = true;
        startCol = colIndex;
        startRow = rowIndex;
    };

    const handleMouseUp = (colIndex: number, rowIndex: number) => {
        startCol === colIndex && startRow === rowIndex
            ? toggleNote(id, colIndex, rowIndex)
            : moveNote(id, startCol, startRow, colIndex, rowIndex);
        
        startCol = -1;
        startRow = -1;
        mouseIsDown = false;
    }

    const handleMouseLeave = () => {
        mouseIsDown = false;
        startCol = -1;
        startRow = -1;
        currentRow = -1;
    };

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
        {#each Array(notes) as _, rowIndex}
            <div 
                class="sequencer__piano-key" 
                style="grid-row: {rowIndex + 1};"
                class:sequencer__piano-key--accidental={[1, 3, 6, 8, 10].includes(12 - (rowIndex % 12) - 1) || collapsed}
                class:sequencer__piano-key--active={!collapsed && rowIndex === currentRow}
            ></div>
        {/each}
    </div>
    
    <div 
        class="sequencer__grid"
        role="application"
        on:mouseleave={handleMouseLeave}
    >
        {#each Array(divisions * bars) as _, colIndex}
            {#each Array(notes) as _, rowIndex}
                <button 
                    class="sequencer__cell" 
                    style="grid-column: {colIndex + 1}; grid-row: {rowIndex + 1};}"
                    class:sequencer__cell--highlighted={!(Math.floor(colIndex / 4) % 2)}
                    class:sequencer__cell--active={$data[id][colIndex][rowIndex].amp > 0}
                    class:mouseIsDown={mouseIsDown}
                    aria-label="Toggle cell at row {rowIndex + 1}, column {colIndex + 1}"
                    on:mouseover={() => currentRow = rowIndex}
                    on:focus={() => currentRow = rowIndex}
                    on:mousedown={() => handleMouseDown(colIndex, rowIndex)}
                    on:mouseup={() => handleMouseUp(colIndex, rowIndex)}
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
        max-height: calc(24 * 3em);
        transition: max-height 0.3s ease;
        overflow: hidden;

        &--collapsed {
            transition: max-height 0.3s ease;
            max-height: 1.5rem;
        }

        &__meta {
            width: 3rem;
            display: grid;
            grid-template-rows: repeat(rows, .5fr);

            & button {
                width: 100%;
                height: 1.5rem;
                background: rgba(255, 255, 255, 0.1);
                border: 0;
                color: white;
                font-size: .75rem;
                cursor: pointer;
                text-transform: uppercase;
            }
        }

        &__piano {
            display: grid;
            gap: 2px;
            grid-template-rows: repeat(rows, .5fr);
            grid-template-columns: 1fr;
            width: 1.5rem;
            
            &-key {
                background-color: rgba(255, 255, 255, 0.05);
                border: 0;
                box-sizing: border-box;
                height: 1.5rem;
                
                &--accidental {
                    background-color: rgba(0, 0, 0, 0.05);
                }

                &--active {
                    background-color: rgba(255, 255, 255, 0.5);
                }
            }
        }
        &__grid {
            display: grid;
            gap: 2px;
            background-color: rgba(255, 255, 255, 0.1);
            width: 100%;
            height: 100%;
            grid-template-columns: repeat(cols, 1fr);
            grid-template-rows: repeat(rows, .5fr);
        }

        &__cell {
            border: 0;
            box-sizing: border-box;
            height: 1.5rem;
            background-color: transparent;
            cursor: pointer;
            padding: 0;
            position: relative;
            background-color: rgba(255, 255, 255, 0.05);

            &--highlighted {
                background-color: rgba(255, 255, 255, 0.1);
            }
            &:hover:not(&--active) {
                background-color: rgba(255, 255, 255, 0.1);
            }
            &--active {
                background-color: rgba(255, 255, 255, 0.5);
            }

            &.mouseIsDown:hover {
                background-color: rgba(255, 255, 255, 0.5);
            }
        }
    }
</style>