<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import { onMount } from 'svelte';
    export let value: number | string;
    export let units: string = '';
    
    let showInput = false;
    let container: HTMLElement;
    let width: number = 0;
    let height: number = 0;

    function handleKeydown(event: KeyboardEvent) {
        event.key === 'Enter' && (showInput = false);
    }

    onMount(() => {
        width = container.clientWidth;
        height = container.clientHeight;
        console.log('Input dimensions:', width, height);
    });
</script>

<div 
    class="input"
    bind:this={container}
>
    {#if showInput}
        <input 
            bind:value 
            type="text" 
            on:keydown={handleKeydown}
            style="width: {width}px; height: {height}px;"
        />
    {:else}
        <Button 
            onClick={() => {
                showInput = true
                // focus the input after it appears
                setTimeout(() => {
                    const inputElement = container.querySelector('input');
                    inputElement?.focus();
                }, 0);
            }}
            label={`${value} ${units}`}
            fontSize="1.5rem"
            width="126px"
        >
        </Button>
    {/if}
</div>

<style lang="scss">
    input {
        font-size: 1.5rem;
        border: none;
        border-radius: 3px;
        box-sizing: border-box;
        text-align: center;
        width: 100%;
        background-color: var(--black-lighter);
        color: white;

        &:focus {
            outline: none;
            box-shadow: 0 0 0 2px var(--theme-1);
        }
    }
</style>