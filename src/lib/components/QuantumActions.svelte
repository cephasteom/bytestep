<script lang="ts">
    import { showQuantumActions } from '$lib/stores/circuit';
    import Dialog from '$lib/components/Dialog.svelte';
</script>

<Dialog 
    bind:open={$showQuantumActions}
    title="Actions"
>

</Dialog>

<style lang="scss">
    p, span {
        margin-top: 0;
        text-transform: none;
    }

    span {
        background-color: white;
        display: inline-block;
        line-height: 1;
        color: black;
        padding: 0 .5rem;
        text-align: center;
        border-radius: var(--border-radius);
    }
</style>