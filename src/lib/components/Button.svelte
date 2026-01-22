<script lang="ts">
    export let onClick = () => {};
    export let width = 'auto';
    export let label = '';
    export let fontSize = '1rem';
    export let padding = '0.5rem';
</script>

<button class="btn" on:click={onClick} style="width: {width}; padding: {padding}; font-size: {fontSize};">
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
        opacity: 0.9;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        cursor: pointer;
    }
</style>