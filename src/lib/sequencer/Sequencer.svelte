<script lang="ts">
    import { activeSequencer } from "$lib/stores";
    import { data, toggleNote, moveNote, divisions, bars, notes } from "$lib/stores/musical";

    export let id: number;
    let currentNote = -1;
    let mouseIsDown = false;
    let startDivision = -1;
    let startNote = -1;

    const toggle = () => activeSequencer.update(activeId => 
        activeId === id 
            ? null 
            : id);

    const handleMouseDown = (divisionIndex: number, noteIndex: number) => {
        mouseIsDown = true;
        startDivision = divisionIndex;
        startNote = noteIndex;
    };

    const handleMouseUp = (divisionIndex: number, noteIndex: number) => {
        startDivision === divisionIndex && startNote === noteIndex
            ? toggleNote(id, divisionIndex, noteIndex)
            : moveNote(id, startDivision, startNote, divisionIndex, noteIndex);
        
        startDivision = -1;
        startNote = -1;
        mouseIsDown = false;
    }

    const handleMouseLeave = () => {
        mouseIsDown = false;
        startDivision = -1;
        startNote = -1;
        currentNote = -1;
    };

    $: collapsed = $activeSequencer !== id;
</script>

<section class="sequencer">
    <div class="sequencer__meta">
        <button on:click={toggle}>{collapsed ? '▲' : '▼'}</button>
    </div>

    <div 
        class="sequencer__content"
        class:sequencer__content--collapsed={collapsed}
    >
        <div class="sequencer__piano">
            {#each Array(notes) as _, noteIndex}
                <div 
                    class="sequencer__piano-key" 
                    style="grid-row: {(notes - noteIndex) + 1};"
                    class:sequencer__piano-key--accidental={[1, 3, 6, 8, 10].includes(noteIndex % 12) || collapsed}
                    class:sequencer__piano-key--active={!collapsed && noteIndex === currentNote}
                ></div>
            {/each}
        </div>
        
        <div 
            class="sequencer__grid"
            role="application"
            on:mouseleave={handleMouseLeave}
        >
            {#each Array(divisions * bars) as _, divisionIndex}
                {#each Array(notes) as _, noteIndex}
                    <button 
                        class="sequencer__cell" 
                        style="grid-column: {divisionIndex + 1}; grid-row: {(notes - noteIndex) + 1};}"
                        class:sequencer__cell--highlighted={!(Math.floor(divisionIndex / 4) % 2)}
                        class:sequencer__cell--active={$data[id][divisionIndex][noteIndex].amp > 0}
                        class:mouseIsDown={mouseIsDown}
                        aria-label="Toggle cell at row {noteIndex + 1}, column {divisionIndex + 1}"
                        on:mouseover={() => currentNote = noteIndex}
                        on:focus={() => currentNote = noteIndex}
                        on:mousedown={() => handleMouseDown(divisionIndex, noteIndex)}
                        on:mouseup={() => handleMouseUp(divisionIndex, noteIndex)}
                    >
                    </button>
                {/each}
            {/each}
        </div>
    </div>
</section>

<style lang="scss">
    .sequencer {
        // border: 1px solid rgba(255, 255, 255, 0.1);
        display: grid;
        grid-template-columns: 3rem auto;

        &__meta {
            width: 3rem;
            display: grid;
            grid-template-rows: repeat(notes, .5fr);

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
        
        &__content {
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-left: 0;
            border-right: 0;
            box-sizing: border-box;
            display: grid;
            grid-template-columns: auto 1fr;
            max-height: calc(24 * (1.5em + 2px) - 2px);
            transition: max-height 0.3s ease;
            overflow: scroll;

            &--collapsed {
                transition: max-height 0.3s ease;
                max-height: 1.5rem;
            }
        }

        &__piano {
            display: grid;
            gap: 2px;
            grid-template-rows: repeat(notes, .5fr);
            grid-template-columns: 1fr;
            width: 1.5rem;
            margin-top: -3px;
            
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
            grid-template-columns: repeat(calc(divisions * bars), 1fr);
            grid-template-rows: repeat(notes, .5fr);
            margin-top: -3px;

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