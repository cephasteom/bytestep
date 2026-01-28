<script lang="ts">
  import { debounce } from "$lib/utils";

    export let min: number = 0;
    export let max: number = 100;
    export let step: number = 0.001;
    export let value: number = 50;
    export let id: string = "";
    export let colour: number = 1;
    export let name: string = "";
    export let onChange: (value: number) => void = () => {};
    export let decimals: number = 2;
</script>

<div class="slider">
    <label for={id}>{name}</label>
    <span 
        class="value"
        style="color: var(--theme-{colour});"
    >{value.toFixed(decimals)}</span>

    <span class="min">{min}</span>
    <input 
        type="range" id={id} min={min} max={max} step={step} bind:value={value} class={"colour" + colour} 
        on:input={debounce(() => onChange(value), 100)}
    />
    <span class="max">{max}</span>
</div>

<style lang="scss">
    .slider {
        display: flex;
        gap : 1rem;
        width: 100%;
    }
    label, span {
        color: white;
    }

    .value {
        width: 5rem;
        
    }
    input {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        background: transparent;
        cursor: pointer;
        border-radius: 2px;

        &.colour1 {
            --colour-track: var(--theme-1);
        }
        &.colour2 {
            --colour-track: var(--theme-2);
        }
        &.colour3 {
            --colour-track: var(--theme-3);
        }
        &.colour4 {
            --colour-track: var(--theme-4);
        }
        &.colour5 {
            --colour-track: var(--theme-5);
        }
    }

    /* ===== Track ===== */
    input::-webkit-slider-runnable-track {
        height: 3px;
        background: var(--colour-track);
    }

    input::-moz-range-track {
        height: 3px;
        background: var(--colour-track);
    }

    /* ===== Thumb ===== */
    input::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 10px;
        width: 10px;
        border-radius: 50%;
        background: white;
        margin-top: -3.5px; /* centres thumb on track */
    }

    input::-moz-range-thumb {
        height: 10px;
        width: 10px;
        border-radius: 50%;
        background: white;
        border: none;
    }
</style>