<script lang="ts">
    import { onMount } from 'svelte';

    export let onInput: (value: string) => void;
    export let value: number | string;
    export let units: string = '';
    export let hasError: boolean = false;
    
    let inputElement: HTMLInputElement;
    let mirrorSpan: HTMLSpanElement;
    
    let container: HTMLElement;
    
    function setSize() {
        if(!mirrorSpan || !inputElement) return;
        mirrorSpan.textContent = `${value}`;
        const width = mirrorSpan.offsetWidth;
        inputElement.style.width = `${width}px`;
    }

    function handleOnInput(e: Event) {
        onInput((e.target as HTMLInputElement).value);
        setSize();
    }

    onMount(() => setTimeout(setSize, 10));
</script>

<div 
    class="input"
    bind:this={container}
    class:input--error={hasError}
>
    <input 
        bind:this={inputElement} 
        on:input={handleOnInput}
        bind:value 
        class="input__input"
    />
    <span 
        class="input__mirror" 
        bind:this={mirrorSpan}
    ></span>
</div>
{#if units}
    <span class="units">{units}</span>
{/if}

<style lang="scss">
    .input {
        display: inline-grid;
        box-sizing: border-box;
        border-radius: 4px;
        position: relative;

        &--error {
            &::before {
                content: '!';
                position: absolute;
                font-size: 1.5rem;
                left: -10px;
                right: -4px;
                color: var(--theme-5);
            }
        }

        &__input, &__mirror {
            grid-area: 1 / 1;
            font: inherit;
            padding: 0 0.25rem;
        }

        &__input {
            font-size: 1.5rem;
            border: none;
            border-radius: 3px;
            text-align: center;
            background-color: var(--black-lighter);
            color: white;
            width: 1ch;
            overflow: visible;
            padding: 0;
        }

        &__mirror {
            visibility: hidden;
            white-space: pre;
            padding: 0 0.25rem;
        }

    }
    

    .units {
        color: white;
        font-size: 1.5rem;
    }
</style>