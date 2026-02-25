<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Bytestep</title>
	<meta name="description" content="ByteStep combines the convenience of a DAW with the flexibility of live coding. Manually input loops on a step sequencer, or generate them using quantum algorithms. Transform time using simple a JS expression." />
</svelte:head>

{@render children()}
