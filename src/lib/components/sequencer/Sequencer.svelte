<script lang="ts">
    import { activeSequencer, clearSequencer } from "$lib/stores/sequencer";
    import { inputs, outputs, connectInput, connectOutput, connections } from "$lib/stores/midi";
    import { t } from '$lib/stores/transport';
    import { data, toggleNote, moveNote, divisions, bars, notes, happensWithin, divisionToPosition } from "$lib/stores/sequencer";
    import Cell from "./Cell.svelte";
    import SVG from "$lib/components/SVG.svelte";
    import Button from "$lib/components/Button.svelte";

    export let id: number;
    let currentNote = -1;
    let mouseIsDown = false;
    let startDivision = -1;
    let startNote = -1;
    let contentElement: HTMLElement;

    const toggle = () => {
        activeSequencer.update(activeId => 
            activeId === id ? null : id);
        contentElement && (contentElement.scrollTop = 0);
    }

    const handleMouseDown = (divisionIndex: number, noteIndex: number) => {
        mouseIsDown = true;
        startDivision = divisionIndex;
        startNote = noteIndex;
    };

    const handleMouseUp = (divisionIndex: number, noteIndex: number) => {
        startDivision === divisionIndex && startNote === noteIndex
            ? toggleNote(id, divisionToPosition(divisionIndex), noteIndex)
            : moveNote(id, divisionToPosition(startDivision), startNote, divisionToPosition(divisionIndex), noteIndex);
        
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

<div class="config">
    <div class="midi">
        <div>
            <label for="midi-input-{id}">MIDI In</label>
            <select 
                id="midi-input-{id}" 
                on:change={(e) => connectInput(id, (e.target as HTMLInputElement).value)}
                value={$connections[id]?.input}
            >
                <option value={null}>None</option>
                {#each $inputs as input}
                    <option value={input}>{input}</option>
                {/each}
            </select>
        </div>
        <div>
            <label for="midi-output-{id}">MIDI Out</label>
            <select 
                id="midi-output-{id}" 
                on:change={(e) => connectOutput(id, (e.target as HTMLInputElement).value)}
                value={$connections[id]?.output}
            >
                <option value={null}>None</option>
                {#each $outputs as output}
                    <option value={output}>{output}</option>
                {/each}
            </select>
        </div>
    </div>
    <Button
        onClick={() => clearSequencer(id)}
    >
        <SVG type="erase" />
    </Button>
</div>
<section class="sequencer">
    <div class="sequencer__meta">
        <button on:click={toggle}>
            {#if collapsed}
                <SVG type="down" />
            {:else}
                <SVG type="up" />
            {/if}
        </button>
    </div>

    <div 
        class="sequencer__content"
        class:sequencer__content--collapsed={collapsed}
        bind:this={contentElement}
    >
        <div class="sequencer__piano">
            {#each Array(notes) as _, noteIndex}
                <div 
                    class="sequencer__piano-key" 
                    style="grid-row: {(notes - noteIndex) + 1};"
                    class:sequencer__piano-key--accidental={[1, 3, 6, 8, 10].includes(noteIndex % 12) || collapsed}
                    class:sequencer__piano-key--active={!collapsed && noteIndex === currentNote}
                >{!(noteIndex % 12) ? `C${Math.floor(noteIndex / 12)}` : ''}</div>
            {/each}
        </div>
        
        <div 
            class="sequencer__grid"
            role="application"
            on:mouseleave={handleMouseLeave}
        >
            {#each Array(divisions * bars) as _, divisionIndex}
                {#each Array(notes) as _, noteIndex}
                    <Cell 
                        division={divisionIndex}
                        note={noteIndex}
                        row={(notes - noteIndex) + 1}
                        highlighted={!(Math.floor(divisionIndex / 4) % 2)}
                        on={$data[id].some(n => happensWithin(divisionIndex, n.position) && (collapsed || n.note === noteIndex))}   
                        active={$t % (divisions * bars) === divisionIndex}
                        handleMouseOver={() => currentNote = noteIndex}
                        handleMouseDown={handleMouseDown}
                        handleMouseUp={handleMouseUp}
                        {mouseIsDown}
                    />
                {/each}
            {/each}
        </div>
    </div>
</section>

<style lang="scss">
    .config {
        display: flex;
        justify-content: space-between;
    }
    .midi {
        display: flex;
        gap: 1rem;

        label {
            margin-right: 0.5rem;
            font-size: 0.875rem;
            color: white;
        }

        select {
            background: rgba(255, 255, 255, 0.1);
            border: 0;
            color: white;
            padding: 0.25rem;
            font-size: 0.875rem;
        }   
    }
    .sequencer {
        display: grid;
        grid-template-columns: 3rem auto;
        margin-bottom: 1rem;

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
                display: flex;
                align-items: center;
                justify-content: center;
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
            transition: max-height 0.15s ease;
            overflow: scroll;

            &--collapsed {
                transition: max-height 0.15s ease;
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
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.625rem;
                color: white;
                
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
    }
</style>