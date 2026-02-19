<script lang="ts">
    import { showAbout, showHelp } from '$lib/stores';
    import Button from './Button.svelte';
    import SVG from './SVG.svelte';
</script>

<header class="header">
    <!-- <h1>ByteStep</h1> -->
    <SVG type="logo" fill="none" width="13rem" />
    <nav>
        <Button 
            onClick={() => showHelp.update(v => !v)}
            isActive={$showHelp}
            orientation="horizontal"
        >
            <span>Help</span>
        </Button>

        <Button 
            onClick={() => showAbout.set(true)}
            isActive={$showAbout}
            orientation="horizontal"
        >
            <span>About</span>
        </Button>
    </nav>
</header>

<style lang="scss">
    .header {
        height: var(--header-height);
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: var(--spacer);
        background-color: #000;
        h1 {
            margin: 0;
            color: #fff;
        }

        span {
            font-size: 1.25rem;
            color: white;
        }

        nav {
            display: flex;
            gap: var(--spacer);
        }
    }
</style>