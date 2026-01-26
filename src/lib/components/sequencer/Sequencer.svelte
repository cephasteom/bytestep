<script lang="ts">
    import { 
        activeSequencer, clearSequencer, 
        toggleRecord,
        toggleMute,
        setBytebeat,
    } from "$lib/stores/sequencers";
    import { openMidiSettings } from "$lib/stores/midi";
    import { t, c } from '$lib/stores/transport';
    import { data, addNote, removeNote, moveNote, notes, happensWithin, divisionToPosition } from "$lib/stores/sequencers";
    import { bars, divisions } from "$lib/stores/";
    import Cell from "./Cell.svelte";
    import SVG from "$lib/components/SVG.svelte";
    import Button from "$lib/components/Button.svelte";
    import { onMount } from "svelte";
    import Input from "$lib/components/Input.svelte";

    export let id: number;
    let currentNote = -1;
    let mouseIsDown = false;
    let startDivision = -1;
    let startNote = -1;
    let currentCell = {division: -1, note: -1};

    const toggle = () => activeSequencer.update(activeId => activeId === id ? null : id);

    const handleMouseDown = (divisionIndex: number, noteIndex: number) => {
        mouseIsDown = true;
        startDivision = divisionIndex;
        startNote = noteIndex;
    };

    const handleMouseUp = (divisionIndex: number, noteIndex: number) => {
        startDivision === divisionIndex && startNote === noteIndex
            ? addNote(id, divisionToPosition(divisionIndex), noteIndex)
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

    const handleMouseFocus = (divisionIndex: number, noteIndex: number) => {
        currentCell = { division: divisionIndex, note: noteIndex };
    };

    $: collapsed = $activeSequencer !== id;
    $: colour = `var(--theme-${(id % 5) + 1})`;
    $: record = $data[id]?.record || false;
    $: muted = $data[id]?.muted || false;
    $: bytebeat = $data[id]?.bytebeat || 't';
    
    onMount(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (currentCell.division === -1 || currentCell.note === -1) return;

            // if backspace or delete is pressed, remove the note at the current cell
            if (event.key === "Backspace" || event.key === "Delete") {
                removeNote(id, divisionToPosition(currentCell.division), currentCell.note);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    });
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
                onClick={() => toggleRecord(id)}
                padding={'0'}
                ariaLabel={record ? "Stop recording" : "Start recording"}
            >
                <SVG 
                    type={`circle${record ? "--solid" : ""}`} 
                    fill="var(--theme-5)" 
                    width={'1.25rem'}
                />
            </Button>

            <Button
                onClick={() => clearSequencer(id)}
                padding={'0'}
                ariaLabel="Clear sequencer"
            >
                <SVG 
                    type="erase" 
                    width={'1.25rem'}
                />
            </Button>
            
            <Button
                onClick={() => openMidiSettings(id)}
                padding={'0'}
                ariaLabel="Open MIDI settings"
            >
                <SVG 
                    type="midi" 
                    width={'1.25rem'}
                />
            </Button>

            <Button
                onClick={() => toggleMute(id)}
                padding={'0'}
                ariaLabel={muted ? "Unmute sequencer" : "Mute sequencer"}
            >
                <SVG 
                    type={muted ? "mute" : "speaker"}
                    width={'1.25rem'}
                />
            </Button>
        </div>
        <div>
            <Input
                value={bytebeat}
                onInput={(value) => setBytebeat(id, value)}
                hasError={$data[id]?.hasError}
            />
            <Button
                onClick={toggle}
                padding={'0'}
            >
                <SVG 
                    type={collapsed ? 'down' : 'up'} 
                    fill={colour} 
                    width={'1.25rem'}
                />
            </Button>
        </div>
    </header>

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
            {#each Array($divisions * bars) as _, divisionIndex}
                {#each Array(notes) as _, noteIndex}
                    <Cell 
                        division={divisionIndex}
                        note={noteIndex}
                        row={(notes - noteIndex) + 1}
                        highlighted={!(Math.floor(divisionIndex / 4) % 2)}
                        on={$data[id].notes.some(n => happensWithin(divisionIndex, n.position) && n.note === noteIndex)}   
                        active={$t % ($divisions * bars) === divisionIndex}
                        handleMouseOver={() => currentNote = noteIndex}
                        handleMouseDown={handleMouseDown}
                        handleMouseUp={handleMouseUp}
                        handleMouseFocus={handleMouseFocus}
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
            max-height: 27px; // header height;
            overflow: hidden;
        }

        &__header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
            h2 {
                width: 8.5rem;
                margin: 0;
                color: white;
            }

            & > div {
                display: flex;
                align-items: center;
                gap: 2rem;
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
            grid-template-columns: repeat(calc(get(divisions) * bars), 1fr);
            grid-template-rows: repeat(notes, .5fr);
            margin-top: -3px;
            position: relative;
        }
    }
</style>