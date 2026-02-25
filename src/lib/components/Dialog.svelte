<script lang="ts">
    import Button from "./Button.svelte";
    import SVG from "./SVG.svelte";

    export let open = false;
    export let title: string = "Dialog";
    let dialog: HTMLDialogElement;

    $: open ? dialog?.showModal() : dialog?.close();
</script>

<dialog 
    bind:this={dialog} 
    on:close={() => open = false}
    on:click={e => e.target === dialog && dialog.close()}
>
    <header>
        <h2>{title}</h2>
        <Button 
            onClick={() => dialog.close()}
            padding="0"
        >
            <SVG 
                type="close" 
                width="1rem"
            />
        </Button>
    </header>
    <div class="content">
        <slot />
    </div>
</dialog>

<style lang="scss">
    dialog {
        border: 1.5px solid var(--grey-light);
        border-radius: var(--border-radius);
        background-color: var(--grey-dark);
        color: white;
        padding: 0;
        max-width: min(90vw, 40rem);
        

        & > header {
            background-color: var(--black-lighter);
            padding: 1rem var(--spacer);
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: var(--spacer);
        }

        & .content {
            padding: 1rem var(--spacer);
            opacity: var(--app-opacity, 1);
        }
        &::backdrop {
            background: rgba(0, 0, 0, 0.25);
        }
    }
</style>
