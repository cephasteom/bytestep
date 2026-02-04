<script lang="ts">
    import { showHelp } from '$lib/stores/';
    export let position: 'top' | 'bottom' | 'left' | 'right' = 'left';
    export let text: string = '';
</script>

<div class="tooltip">
    <slot></slot>
    <span 
        class="tooltip__text {position}"
        style="display: { $showHelp ? 'block' : 'none' };"
    >{text}</span>
</div>

<style lang="scss">
    .tooltip {
        position: relative;
        display: inline-block;

        &__text {
            visibility: hidden;
            width: max-content;
            max-width: 200px;
            color: var(--black);
            background-color: white;
            text-align: center;
            border-radius: 4px;
            padding: 0.5rem 1rem;
            position: absolute;
            z-index: 1;
            box-shadow: var(--box-shadow);
            font-size: 0.875rem;
            line-height: 1.2;
            word-wrap: break-word;
            text-transform: none;

            &.top {
                bottom: 125%;
                left: 50%;
                transform: translateX(-50%);
            }

            &.bottom {
                top: 125%;
                left: 50%;
                transform: translateX(-50%);
            }

            &.left {
                top: 50%;
                right: calc(100% + 1rem);
                transform: translateY(-50%);
            }

            &.right {
                top: 50%;
                left: 125%;
                transform: translateY(-50%);
            }
        }

        &:hover .tooltip__text {
            visibility: visible;
        }
    }
</style>
