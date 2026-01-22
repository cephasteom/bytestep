<script lang="ts">
  import Button from "./Button.svelte";
  import SVG from "./SVG.svelte";


</script>

<aside class="sidebar">
    <Button
        label="Step"
    >
        <SVG type="piano" />
    </Button>
    
    <Button
        label="MIDI"
    >
        <SVG type="midi" />
    </Button>
</aside>

<style lang="scss">
    .sidebar {
        padding: 8rem var(--spacer) var(--spacer) var(--spacer);
        background-color: var(--black-lighter);
        min-height: calc(100vh - var(--header-height));
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 3rem;
    }
</style>