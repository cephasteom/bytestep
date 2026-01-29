<script lang="ts">
    export let row: number;
    export let division: number;
    export let note: number;
    export let highlighted: boolean;
    export let on: boolean = false;
    export let active: boolean = false;
    export let handleMouseOver: () => void = () => {};
    export let handleMouseDown: (division: number, note: number) => void = () => {};
    export let handleMouseUp: (division: number, note: number) => void = () => {};
    export let handleMouseFocus: (division: number, note: number) => void = () => {};
    export let mouseIsDown: boolean = false;
    export let colour: string = 'var(--theme-1)';
    export let height: string = '1rem';
    export let focused: boolean = false;
</script>

<button 
    tabindex="-1"
    class="cell" 
    style="grid-column: {division + 1}; grid-row: {row}; background-color: {on || active ? colour : ''}; height: {height};"
    class:cell--highlighted={highlighted}
    class:cell--on={on}
    class:mouseIsDown={mouseIsDown}
    class:cell--focused={focused}
    aria-label="Toggle note {note} at division {division + 1}"
    on:mouseover={handleMouseOver}
    on:mousedown={() => handleMouseDown(division, note)}
    on:mouseup={() => handleMouseUp(division, note)}
    on:focus={() => handleMouseFocus(division, note)}
>
</button>

<style lang="scss">
.cell {
    border: 0;
    box-sizing: border-box;
    background-color: transparent;
    cursor: pointer;
    padding: 0;
    position: relative;
    background-color: var(--grey-dark);

    &--highlighted {
        background-color: var(--grey);
    }
    &:hover:not(&--on) {
        background-color: rgba(255, 255, 255, 0.1);
    }

    &--on {
        border-radius: 4px;
    }

    &.mouseIsDown:hover {
        background-color: rgba(255, 255, 255, 0.5);
    }

    &:focus {
        outline: none;
    }
    &--focused {
        z-index: 10;
        outline: 2px dashed white !important;
        outline-offset: 4px;
    }
}
</style>
    