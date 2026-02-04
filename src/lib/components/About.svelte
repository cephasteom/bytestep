<script lang="ts">
    import { showAbout } from '$lib/stores';
    import Dialog from '$lib/components/Dialog.svelte';
</script>

<Dialog 
    bind:open={$showAbout}
    title="About"
>
    <p>ByteStep combines the convenience of a DAW with the flexibility of live coding.</p>
    <p>Record or input a sequence of notes, then transform time using a JavaScript expression. For example, <span>t</span> plays the sequence normally, <span>t * 2</span> plays it at double speed, and <span>32 - t</span> plays it backwards.</p>
    <p>Click Help to turn on tooltips.</p>
    
    <p>Visual designs by Ellie Hobbs @ <a href="https://lunar.build">lunar.build</a>.</p>
    <p>© {new Date().getFullYear()} Peter Thomas | <a href="https://cephasteom.co.uk">cephasteom.co.uk</a>.</p>
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