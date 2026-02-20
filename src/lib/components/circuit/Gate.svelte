<script lang="ts">
    import { draggable } from '@neodrag/svelte';
    
    let {id, symbol, disabled = false, dragend, mouseover, mouseout} = $props();
    let isDragging: boolean = $state(false);

    let thisGate: HTMLButtonElement;
    let position = $state({x: 0, y: 0});

    function handleDragEnd(e: CustomEvent) {
        const target = e.target as HTMLElement;
        const bounds = target.getBoundingClientRect() as DOMRect;
        const x = bounds.x + window.scrollX;
        const y = bounds.y + window.scrollY;
        dragend({id, x, y});
        position = {x: -4, y: 0}
        isDragging = false;
    }

    function handleDrag(e: CustomEvent) {
        const x = e.detail.offsetX;
        const y = e.detail.offsetY;
        position = {x, y};
    }
    
    function handleDragStart() {
        isDragging = true;
    }

</script>

<button 
    bind:this={thisGate}
    on:focus={() => mouseover(id)}
    on:mouseover={() => mouseover(id)}
    on:blur={() => mouseout(id)}
    on:mouseout={() => mouseout(id)}
    class="gate"
    disabled={disabled}
>
    {#if !disabled}
        <span
            use:draggable={{bounds: 'body', position: position}}
            on:neodrag:end={handleDragEnd}
            on:neodrag:start={handleDragStart}
            on:neodrag={handleDrag}
            class:grab={isDragging}
        >
            {symbol}
        </span>
    {/if}
    {symbol}
</button>

<style lang="scss">
    .gate {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        background-color: transparent;
        color: white;
        padding: 1rem;
        border: 1px solid white;
        border-radius: 5px;
        font-size: 1.125rem;
        text-transform: uppercase;

        &:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }

        span {
            cursor: grab;
            display: inline-block;
            background-color: transparent;
            text-align: center;
            position: absolute;
            opacity: 0;
            margin: auto;
            border-radius: 5px;
            &.grab {
                cursor: grabbing;
                z-index: 20;
                border: white 1px solid;
                background-color: transparent;
                border-radius: 0;
                width: 40px;
                height: 40px;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 1;
            }
        }
    }

</style>