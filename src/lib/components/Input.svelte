<script lang="ts">
    import { onMount } from "svelte";

    export let onInput: (value: string) => void = () => {};
    export let value: number | string;
    export let prefix: string = '';
    export let suffix: string = '';
    export let hasError: boolean = false;
    export let width: string = 'auto';
    export let flashOnInput: boolean = false;
    
    let inputElement: HTMLInputElement;

    const flash = () => {
        if (!inputElement) return;
        const originalBg = inputElement.style.backgroundColor;
        inputElement.style.backgroundColor = 'var(--theme-1)';
        setTimeout(() => {
            inputElement.style.backgroundColor = originalBg;
        }, 150);
    };

    onMount(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!inputElement) return;
            if (e.key === 'Enter' ) {
                onInput(inputElement.value);
                flashOnInput 
                    ? flash() // show flash effect
                    : inputElement.blur(); // remove focus unless flashOnInput is true
            }
            if (e.key === 'Escape') {
                inputElement.blur();
            }
        };

        inputElement.addEventListener('keydown', handleKeyDown);
        return () => inputElement.removeEventListener('keydown', handleKeyDown);
    });

</script>

<div class="input-wrapper">
    {#if prefix}
        <button on:click={() => inputElement.focus()} class="prefix">{prefix}</button>
    {/if}
    <div 
        class="input"
        class:input--error={hasError}
        style="width: {width};"
    >
        <input 
            bind:this={inputElement}
            bind:value 
            class="input__input"
            class:input__input--underline={prefix}
            style="text-align: {prefix ? 'left' : suffix ? 'right' : 'center'};"
        />
    </div>
    {#if suffix}
        <button on:click={() => inputElement.focus()} class="suffix">{suffix}</button>
    {/if}
</div>

<style lang="scss">
    .input-wrapper {
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }
    .input {
        box-sizing: border-box;
        border-radius: 4px;
        position: relative;
        &--error {
            outline: 2px dotted var(--theme-5);
        }

        &__input {
            font-size: 1.5rem;
            border: none;
            text-align: center;
            background-color: var(--black-lighter);
            color: white;
            width: 100%;
            overflow: visible;
            padding: 0;
            position: relative;

            &--underline {
                box-shadow: inset 0 -1px 0 0 var(--grey-lighter);
            }

            &:focus {
                border-radius: 3px;
            }
        }
    }
    .suffix, .prefix {
        color: white;
        font-size: 1.5rem;
        text-transform: none;
        background: transparent;
        border: none;
        cursor: text;
        padding: 0;

        &:focus {
            outline: none;
        }
    }
</style>