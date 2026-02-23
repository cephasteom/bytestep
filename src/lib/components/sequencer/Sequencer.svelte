<script lang="ts">
    import { activeSequencer, updateNoteAmp, updateNoteDuration } from "$lib/stores/sequencers";
    import { sequencerTs } from '$lib/stores/transport';
    import { data, addNote, removeNote, moveNote, notes, happensWithin, divisionToPosition } from "$lib/stores/sequencers";
    import { bars, divisions } from "$lib/stores/";
    import Cell from "./Cell.svelte";
    import { onMount } from "svelte";
    import Header from "./SequencerHeader.svelte";
    import Progress from "./SequencerProgress.svelte";
    import Meta from "./SequencerMeta.svelte";

    export let id: number;
    let currentNote = -1;
    let mouseIsDown = false;
    let startDivision = -1;
    let startNote = -1;
    let currentCell = {division: -1, note: -1};
    let scrollableDiv: HTMLDivElement;

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
        currentCell = { division: divisionIndex, note: noteIndex };
    }

    const handleMouseLeave = () => {
        startDivision = -1;
        startNote = -1;
        currentNote = -1;
        mouseIsDown = false;
    };

    const handleMouseFocus = (divisionIndex: number, noteIndex: number) => {
        currentCell = { division: divisionIndex, note: noteIndex };
    };

    $: collapsed = $activeSequencer !== id;
    $: colour = `var(--theme-${(id % 5) + 1})`;
    $: minWidth = $bars * $divisions * 40 + "px";
    
    onMount(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (currentCell.division === -1 || currentCell.note === -1) return;

            // if backspace or delete is pressed, remove the note at the current cell
            if (event.key === "Backspace" || event.key === "Delete") {
                removeNote(id, divisionToPosition(currentCell.division), currentCell.note);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        let hasScrolled = false;
        const cancelActiveSequencerSubscription = activeSequencer.subscribe(activeId => {
            if (!scrollableDiv || hasScrolled) return;
            if (activeId !== id) return scrollableDiv.scrollTo({ top: 0 }); // scroll to top when deactivated

            // scroll to highest note when activated
            const highestNote = $data[id].notes.reduce((max, n) => n.note > max ? n.note : max, 0 );
            scrollableDiv.scrollTo({
                top: ((16 + 2) * (notes - highestNote)),
            });

            hasScrolled = true;
        });

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            cancelActiveSequencerSubscription();
        };
    });
</script>

<section 
    class="sequencer" 
    class:sequencer--collapsed={collapsed}
    style="border-color: {colour};"
>
    <Header {id} {colour} />

    {#if collapsed}
        <Progress {id} {colour} />
    {/if}

    <div 
        class="sequencer__scrollable"
        tabindex="-1"
        bind:this={scrollableDiv}
    >
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
            style="min-width: {minWidth};"
        >
            {#each Array($divisions * $bars) as _, divisionIndex}
                {#each Array(notes) as _, noteIndex}
                    <Cell 
                        division={divisionIndex}
                        note={noteIndex}
                        row={(notes - noteIndex) + 1}
                        on={$data[id].notes.some(n => happensWithin(divisionIndex, n.position) && n.note === noteIndex)}  
                        focused={currentCell.division === divisionIndex && currentCell.note === noteIndex} 
                        active={$sequencerTs[id] !== -1 && $sequencerTs[id] % ($divisions * $bars) === divisionIndex}
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
    {#if currentCell.division !== -1 && currentCell.note !== -1}
        <Meta 
            {id}
            amp={$data[id].notes.find(n => n.position === divisionToPosition(currentCell.division) && n.note === currentCell.note)?.amp || 0.75}
            dur={$data[id].notes.find(n => n.position === divisionToPosition(currentCell.division) && n.note === currentCell.note)?.duration || 0.75}
            onChangeAmp={amp => updateNoteAmp(id, divisionToPosition(currentCell.division), currentCell.note, amp)}
            onChangeDur={duration => updateNoteDuration(id, divisionToPosition(currentCell.division), currentCell.note, duration)}
        />
    {/if}
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
        max-height: 26rem;
        transition: max-height 0.2s ease;
        overflow: scroll;
        position: relative;

        &--collapsed {
            max-height: 60px; // header height;
            overflow: hidden;
        }

        &__scrollable {
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
                background-color: var(--grey-lighter);
                border-right: 3px solid var(--black-lighter);
                box-sizing: border-box;
                height: 1rem;
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
            grid-template-columns: repeat(calc(get(divisions) * get(bars)), 1fr);
            grid-template-rows: repeat(notes, .5fr);
            margin-top: -3px;
            position: relative;
        }
    }
</style>