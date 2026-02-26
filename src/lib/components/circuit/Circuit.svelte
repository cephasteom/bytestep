<!-- TODO: fix drag and drop when scrolled -->

<script lang="ts">
    import { onMount } from 'svelte';
    import { circuit, gates, updateParams, circuitParams, type Gate, showQuantumActions } from '$lib/stores/circuit';
    import { areTouching, arraysAreEqual, clamp } from '$lib/utils';
    import { showSequencers } from '$lib/stores/sequencers';
    import { sonify } from '$lib/stores/sonification';
    import GateButton from './Gate.svelte';
    import Tooltip from '$lib/components/Tooltip.svelte';
    import Button from '$lib/components/Button.svelte';
    import SVG from '$lib/components/SVG.svelte';

    let svg: string = "";
    let thisSvg: HTMLDivElement;
    let thisContainer: HTMLElement;
    let selectedGateId: string;
    let selectedGateConnector: number;
    let isClicked: boolean = false;
    let isMoving: boolean = false;

    const getWireIndex = (y: number) => {
        const svg = thisSvg.querySelector('.qc-circuit')
        const scroll = thisContainer.getBoundingClientRect().y - (svg?.getBoundingClientRect().y || 0);
        return clamp(Math.floor((
            y - thisContainer.getBoundingClientRect().y + scroll + 28
        ) / 80), 0, 16);
    }

    const getColumnIndex = (x: number) => {
        const svg = thisSvg.querySelector('svg')?.getBoundingClientRect()
        if(!svg) return -1;
        return clamp(Math.floor((x - svg.x) / 75), 0, 24);
    }

    const updateSVG = () => {
        svg = circuit.exportSVG(true)
        
        const gates = Array.from(thisSvg?.querySelectorAll(`[data-id]`) || []);
        gates.forEach(el => el.classList.remove('gate--selected'));
        const selectedGate = thisSvg?.querySelector(`[data-id="${selectedGateId}"]`);
        selectedGate && selectedGate.classList.toggle('gate--selected');
    };

    // handle dropping the gate onto the svg
    const handleDragEnd = (i: number, pointerX: number, pointerY: number) => {
        if(!thisSvg) return;
        const {x, y, width, height} = thisSvg.getBoundingClientRect();
        const svg = {x: x + window.scrollX, y: y + window.scrollY, width: width, height: height};
        const pointer = {x: pointerX, y: pointerY, width: 20, height: 20};

        if(!areTouching(pointer, svg)) return;

        const gate = $gates[i];
        const wire = getWireIndex(pointerY);
        const column = getColumnIndex(pointerX);
        const wires = Array.from({ length: gate.qubits }, (_, i) => clamp(wire + i, 0, 16));
        const options = gate.params.length
            ? { params: gate.params.reduce((acc, param) => ({ ...acc, [param.name]: param.default }), {}) }
            : {};

        wires.length > 1
            ? circuit.insertGate(gate.symbol, column, wires, options)
            : circuit.addGate(gate.symbol, column, wires, options);
        
        updateSVG() 
        updateParams()

        selectedGateId = ''
    }

    // handle selecting a gate on the svg
    const handleMouseDown = (e: MouseEvent) => {
        isClicked = true;
        const target = e.target as HTMLElement;
        const parent = target?.parentElement;
        
        selectedGateId = target?.dataset?.id || parent?.dataset.id || '';
        if(!selectedGateId) return;

        const wire = getWireIndex(e.clientY);
        const wires = circuit.getGateById(selectedGateId).wires
        const connector = wires.findIndex((w: number) => w === wire);
        selectedGateConnector = connector === -1 ? 0 : connector;
        
        updateSVG();
    }

    // handle moving gates on the svg
    const handleMouseMove = () => {
        if(!isClicked) return;
        isMoving = true;
    }

    // handle updating gates on the svg
    const handleMouseUp = (e: MouseEvent) => {
        if(!isClicked) return;
        
        const gate = circuit.getGateById(selectedGateId);
        if(!gate) return
        const wire = getWireIndex(e.clientY);
        const column = getColumnIndex(e.clientX - 20);
        
        const wires = gate.wires.map((w: number, i: number) => (i === selectedGateConnector) ? wire : w);
        
        isClicked = false;
        isMoving = false;

        if(arraysAreEqual(gate.wires, wires) && gate.column === column) return;
        
        circuit.removeGate(selectedGateId);
        circuit.addGate(gate.name, column, wires, gate.options);
        
        updateSVG();
        updateParams()

        selectedGateId = ''
    }

    // const clearCircuit = () => {
    //     circuit.clear()
    //     circuit.numQubits = 1
    //     updateSVG()
    //     updateParams()
    // };

    onMount(() => {        
        updateSVG()

        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                circuit.removeGate(selectedGateId);
                updateSVG();
                updateParams()
            }
        }

        window.addEventListener('keydown', handleKeydown);
        const unsubscribeCircuitParams = circuitParams.subscribe(() => updateSVG());

        return () => {
            window.removeEventListener('keydown', handleKeydown)
            unsubscribeCircuitParams()
        };
    });

    let focusedGate: null | Gate = null;

    $: width = $showSequencers ? 40 : 100;
</script>

<svelte:window on:mouseup={() => {
    isClicked = false
    isMoving = false
}} />

<section 
    class="circuit-designer"
    bind:this={thisContainer}
    style="width: {width}%;"
>
    <header class="circuit-designer__header">
        <h2>Circuit</h2>
        <div class="circuit-designer__header-actions">
            <Tooltip text="Open quantum configuration menu">
                <Button
                    onClick={() => showQuantumActions.set(true)}
                    padding={'0'}
                    ariaLabel="Open quantum configuration menu"
                >
                    <SVG
                        type="cog"
                        width={'1.25rem'}
                    />
                </Button>
            </Tooltip>
            <Tooltip text="Populate sequencers from circuit">
                <Button
                    onClick={sonify}
                    padding={'0'}
                    ariaLabel="Populate sequencers from circuit"
                >
                    <SVG
                        type="magic"
                        width={'1.25rem'}
                    />
                </Button>
            </Tooltip>
        </div>
    </header>

    <div class="circuit-designer__ui">
        <aside class="circuit-designer__palette">
            <div 
                class="circuit-designer__gates"
            >
                {#each $gates as gate, i}
                    <GateButton 
                        id={i}
                        symbol={gate.symbol}
                        mouseover={() => focusedGate = gate}
                        mouseout={() => focusedGate = null}
                        dragend={(data: { id: number, x: number, y: number }) => {
                            const { id, x, y } = data;
                            handleDragEnd(id, x, y)
                        }}
                    />
                {/each}
            </div>
        </aside>

        <div class="circuit-designer__circuit">
            {#if svg}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div 
                    bind:this={thisSvg}
                    class="circuit-designer__svg"
                    class:circuit-designer__svg--moving={isMoving}
                    on:mousedown={handleMouseDown}
                    on:mouseover={handleMouseMove}
                    on:mouseup={handleMouseUp}
                    on:mouseleave={handleMouseUp}
                >
                    {@html svg}
                </div>
            {/if}
        </div>
    </div>

</section>

<style lang="scss">
    .circuit-designer {
        display: flex;
        flex-direction: column;
        gap: var(--spacer);
        background-color: var(--black-lighter);
        border-radius: var(--border-radius);
        overflow: hidden;
        padding: 1rem var(--spacer) var(--spacer);
        border: 1.5px solid var(--theme-5);

        &__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            & > h2 {
                color: white;
            }

            &-actions {
                display: flex;
                gap: var(--spacer);
            }
        }

        &__ui {
            display: flex;
            gap: var(--spacer);
            width: 100%;
            height: 100%;
            overflow: scroll;
        }

        &__palette {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        &__circuit {
            height: 100%;
            overflow: scroll;
        }

        &__gates {
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            width: 100%;
            gap: 0.5rem;
            width: 4rem;
        }

        &__circuit {
            width: 100%;
        }
        
        &__svg {
            height: 100%;
            &--moving {
                cursor: grabbing;
                z-index: 1000;
            }
        }

        :global(svg.qc-circuit) {
            transform: translateY(-28px);
        } 

        :global(.qc-wire-label) {
            display: none;
        }

        :global(.qc-circuit line) {
            stroke: white!important;
        }

        :global(.qc-circuit text) {
            color: white!important;
            fill: white!important;
            stroke: white!important;
            user-select: none;
        }
        :global(.qc-circuit ellipse),
        :global(.qc-circuit text), 
        :global(.qc-circuit circle) {
            fill: transparent!important;
            stroke: white!important;
        }
        :global(.qc-circuit rect), 
        :global(.qc-circuit path) {
            fill: var(--black-lighter)!important;
            stroke: white!important;
            cursor: grab;
        }

        :global(.gate--selected rect),
        :global(.gate--selected ellipse),
        :global(.gate--selected circle),
        :global(.gate--selected line){
            stroke: white!important;
            stroke-width: 2px!important;
        }
    }
</style>