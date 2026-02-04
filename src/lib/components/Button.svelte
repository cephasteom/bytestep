<script lang="ts">
    export let onClick = () => {};
    export let width = 'auto';
    export let label = '';
    export let ariaLabel = '';
    export let fontSize = '1rem';
    export let padding = '0.5rem';
    export let isActive = false;
    export let orientation: 'horizontal' | 'vertical' = 'vertical';
</script>

<button 
    class="btn btn--{orientation}" 
    class:active={isActive}
    on:click={onClick} 
    style="width: {width}; padding: {padding}; font-size: {fontSize};"
    aria-label={ariaLabel}
>
    <slot></slot>
    {#if label}
        <span>{label}</span>
    {/if}
</button>

<style lang="scss">
    .btn {
        border: none;
        background-color: transparent;
        color: white;
        border-radius: 3px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        cursor: pointer;
        position: relative;

        &.active::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 5px;
            height: 5px;
            background-color: var(--theme-2);
            // make colour glow
            box-shadow: 0 0 10px var(--theme-2);
            border-radius: 50%;
        }

        &--horizontal {
            &.active::after {
                bottom: auto;
                top: 50%;
                left: -10px;
                transform: translateY(-50%);
            }
        }
    }
    
</style>