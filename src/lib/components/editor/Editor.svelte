<script lang="ts">
    import "prism-code-editor/prism/languages/markup"
    import 'prism-code-editor/prism/languages/typescript';

    import { editorFromPlaceholder } from 'prism-code-editor';
    import { matchBrackets } from 'prism-code-editor/match-brackets';
    import { defaultCommands, editHistory } from 'prism-code-editor/commands';
    import 'prism-code-editor/languages/clike';

    import 'prism-code-editor/layout.css';
    import 'prism-code-editor/scrollbar.css';
    import 'prism-code-editor/guides.css';
    import 'prism-code-editor/invisibles.css';
    import 'prism-code-editor/themes/night-owl.css';
    import 'prism-code-editor/search.css';
    import { onMount } from "svelte";

    onMount(() => {
        const editor = editorFromPlaceholder(
            '#editor',
            {
                language: 'typescript',
                lineNumbers: false,
                value: localStorage.getItem("bs.code") || '// hello world',
                tabSize: 2,
            },
            matchBrackets(),
            defaultCommands(),
            editHistory(),
        );

        editor.textarea.addEventListener('keydown', (e) => {
            localStorage.setItem("bs.code", editor.value);

            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("evaluateCode", { detail: { code: editor.value } }));
                return false;
            }
        });
    })
</script>

<div id="editor"></div>

<style lang="scss">
    
</style>