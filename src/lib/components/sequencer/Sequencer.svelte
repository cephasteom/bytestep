<script lang="ts">
    import { activeSequencer, clearSequencer, armedSequencers, toggleArmedSequencer } from "$lib/stores/sequencer";
    import { inputs, outputs, connectInput, connectOutput, connections } from "$lib/stores/midi";
    import { t, c } from '$lib/stores/transport';
    import { data, toggleNote, moveNote, divisions, bars, notes, happensWithin, divisionToPosition, timeFunctions } from "$lib/stores/sequencer";
    import Cell from "./Cell.svelte";
    import SVG from "$lib/components/SVG.svelte";
    import Button from "$lib/components/Button.svelte";

    export let id: number;
    let currentNote = -1;
    let mouseIsDown = false;
    let startDivision = -1;
    let startNote = -1;

    const toggle = () => activeSequencer.update(activeId => activeId === id ? null : id);

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
    $: colour = `var(--theme-${(id % 5) + 1})`;
    $: timeFunction = $timeFunctions[id] || ((t: number, c: number) => t);
</script>

<section 
    class="sequencer" 
    class:sequencer--collapsed={collapsed}
    style="border-color: {colour};"
>
    <header 
        class="sequencer__header"
    >
        <div>
            <h2>Sequencer 0{id + 1}</h2>
            <Button
                onClick={() => toggleArmedSequencer(id)}
                padding={'0'}
            >
                <SVG 
                    type={`circle${$armedSequencers.includes(id) ? "--solid" : ""}`} 
                    fill="var(--theme-5)" 
                    width={'1rem'}
                />
            </Button>
        </div>
        <div>
            <Button
                onClick={toggle}
                padding={'0'}
            >
                <SVG 
                    type={collapsed ? 'down' : 'up'} 
                    fill={colour} 
                    width={'1rem'}
                />
            </Button>
        </div>
    </header>

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

    <div class="sequencer__content">
        <div class="sequencer__piano">
            {#each Array(notes) as _, noteIndex}
                <div 
                    class="sequencer__piano-key" 
                    style="grid-row: {(notes - noteIndex) + 1};"
                    class:sequencer__piano-key--accidental={[1, 3, 6, 8, 10].includes(noteIndex % 12)}
                    class:sequencer__piano-key--active={noteIndex === currentNote}
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
                        on={$data[id].some(n => happensWithin(divisionIndex, n.position) && n.note === noteIndex)}   
                        active={timeFunction($t, $c) % (divisions * bars) === divisionIndex}
                        handleMouseOver={() => currentNote = noteIndex}
                        handleMouseDown={handleMouseDown}
                        handleMouseUp={handleMouseUp}
                        {mouseIsDown}
                        colour={colour}
                    />
                {/each}
            {/each}
        </div>
    </div>
</section>

<style lang="scss">
    .sequencer {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        background-color: var(--black-lighter);
        padding: 1rem var(--spacer);
        border-radius: var(--border-radius);
        border: 1.5px solid;
        max-height: auto;
        transition: max-height 0.2s ease;
        overflow: scroll;

        &--collapsed {
            max-height: 23px; // header height;
            overflow: hidden;
        }

        &__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
            h2 {
                margin: 0;
                color: white;
            }

            & > div {
                display: flex;
                align-items: center;
                gap: 2rem;
            }
        }
    
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
        &__content {
            box-sizing: border-box;
            display: grid;
            grid-template-columns: auto 1fr;
            overflow: scroll;
        }

        &__piano {
            display: grid;
            gap: 2px;
            grid-template-columns: 1fr;
            width: 3rem;
            margin-top: -3px;
            
            &-key {
                background-color: var(--grey);
                border-right: 3px solid var(--black-lighter);
                box-sizing: border-box;
                height: 1.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.625rem;
                color: white;
                
                &--accidental {
                    background-color: var(--grey-darker);
                }

                &--active {
                    background-color: rgba(255, 255, 255, 0.5);
                }
            }
        }
        &__grid {
            display: grid;
            gap: 3px;
            grid-template-columns: repeat(calc(divisions * bars), 1fr);
            grid-template-rows: repeat(notes, .5fr);
            margin-top: -3px;
        }
    }
</style>