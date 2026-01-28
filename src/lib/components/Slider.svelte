<script lang="ts">
    export let min: number = 0;
    export let max: number = 100;
    export let step: number = 0.001;
    export let value: number = 50;
    export let id: string = "";
    export let colour: string = "colour1";
    export let name: string = "";
</script>

<div class="slider">
    <label for={id}>{name}</label>
    <span class="value">{value.toFixed(2)}</span>

    <span class="min">{min}</span>
    <input type="range" id={id} min={min} max={max} step={step} bind:value={value} class={colour} />
    <span class="max">{max}</span>
</div>

<style lang="scss">
    .slider {
        display: flex;
        gap : 1rem;
    }
    label, span {
        color: white;
    }

    .value {
        width: 3rem;
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