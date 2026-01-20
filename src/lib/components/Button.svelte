<script lang="ts">
    export let onClick = () => {};
    export let width = 'auto';
</script>

<button class="btn" on:click={onClick} style="width: {width};">
    <slot></slot>
</button>

<style lang="scss">
    .btn {
        padding: 0.5rem 1rem;
        border: 1px solid white;
        background-color: transparent;
        color: white;
        // font-size: .75rem;
        border-radius: 3px;
        opacity: 0.9;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
</style>