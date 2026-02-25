<script lang="ts">
    import { showQuantumActions } from '$lib/stores/circuit';
    import Dialog from '$lib/components/Dialog.svelte';
</script>

<Dialog 
    bind:open={$showQuantumActions}
    title="Config"
>
    
</Dialog>

<style lang="scss">

</style>