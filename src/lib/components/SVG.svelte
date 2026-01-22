<script lang="ts">
    export let type: string;
    export let width: string = 'var(--spacer)';
    export let fill: string = 'white';
</script>

<span style="width: {width}; height: {width}; fill: {fill};">
    {#if type === 'play'}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72l0 368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z"/></svg>
    {:else if type === 'stop'}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32z"/></svg>
    {:else if type === 'up'}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M169.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L192 205.3 54.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z"/></svg>
    {:else if type === 'down'}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M169.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 306.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
    {:else if type === 'circle'}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M464 256a208 208 0 1 0 -416 0 208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z"/></svg>
    {:else if type === 'circle--solid'}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z"/></svg>
    {:else if type === 'bell'}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M224 0c-13.3 0-24 10.7-24 24l0 9.7C118.6 45.3 56 115.4 56 200l0 14.5c0 37.7-10 74.7-29 107.3L5.1 359.2C1.8 365 0 371.5 0 378.2 0 399.1 16.9 416 37.8 416l372.4 0c20.9 0 37.8-16.9 37.8-37.8 0-6.7-1.8-13.3-5.1-19L421 321.7c-19-32.6-29-69.6-29-107.3l0-14.5c0-84.6-62.6-154.7-144-166.3l0-9.7c0-13.3-10.7-24-24-24zM392.4 368l-336.9 0 12.9-22.1C91.7 306 104 260.6 104 214.5l0-14.5c0-66.3 53.7-120 120-120s120 53.7 120 120l0 14.5c0 46.2 12.3 91.5 35.5 131.4L392.4 368zM156.1 464c9.9 28 36.6 48 67.9 48s58-20 67.9-48l-135.8 0z"/></svg>
    {:else if type === 'bell--solid'}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M224 0c-17.7 0-32 14.3-32 32l0 3.2C119 50 64 114.6 64 192l0 21.7c0 48.1-16.4 94.8-46.4 132.4L7.8 358.3C2.7 364.6 0 372.4 0 380.5 0 400.1 15.9 416 35.5 416l376.9 0c19.6 0 35.5-15.9 35.5-35.5 0-8.1-2.7-15.9-7.8-22.2l-9.8-12.2C400.4 308.5 384 261.8 384 213.7l0-21.7c0-77.4-55-142-128-156.8l0-3.2c0-17.7-14.3-32-32-32zM162 464c7.1 27.6 32.2 48 62 48s54.9-20.4 62-48l-124 0z"/></svg>
    {:else if type === 'erase'}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M178.5 416l123 0 65.3-65.3-173.5-173.5-126.7 126.7 112 112zM224 480l-45.5 0c-17 0-33.3-6.7-45.3-18.7L17 345C6.1 334.1 0 319.4 0 304s6.1-30.1 17-41L263 17C273.9 6.1 288.6 0 304 0s30.1 6.1 41 17L527 199c10.9 10.9 17 25.6 17 41s-6.1 30.1-17 41l-135 135 120 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-288 0z"/></svg>
    {:else if type === 'piano'}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.75" y="0.75" width="26.5" height="26.5" rx="2.25" stroke="white" stroke-width="1.5"/>
            <path d="M7 1H12V17C12 17.5523 11.5523 18 11 18H8C7.44772 18 7 17.5523 7 17V1Z" fill="white"/>
            <path d="M16 1H21V17C21 17.5523 20.5523 18 20 18H17C16.4477 18 16 17.5523 16 17V1Z" fill="white"/>
            <line x1="9.75" y1="18" x2="9.75" y2="27" stroke="white" stroke-width="1.5"/>
            <line x1="18.75" y1="18" x2="18.75" y2="27" stroke="white" stroke-width="1.5"/>
        </svg>
    {:else if type === 'midi'}
        <svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.125 1.80121C18.125 0.65569 19.2182 -0.278964 20.368 0.0800799L20.6002 0.171265L21.059 0.393531C25.7715 2.80425 29 7.72828 29 13.4103C29 21.4688 22.509 28 14.5 28C6.49102 28 0 21.4688 0 13.4103C0 7.54591 3.44375 2.4908 8.39981 0.171265L8.63203 0.0800799C9.78184 -0.284663 10.875 0.649991 10.875 1.80121V5.20358L10.892 5.38595C10.977 5.80198 11.3451 6.11543 11.7812 6.11543H17.2188L17.4 6.09834C17.8135 6.01285 18.125 5.64241 18.125 5.20358V1.80121ZM19.9375 5.20358L19.9262 5.48283C19.7959 6.77083 18.7764 7.79667 17.502 7.92205L17.2244 7.93345H11.7869C10.3766 7.93345 9.22109 6.85632 9.07949 5.47713L9.06816 5.19788V1.8696C4.77481 3.92698 1.8125 8.32099 1.8125 13.4103C1.8125 20.4601 7.49356 26.1763 14.5 26.1763C21.5064 26.1763 27.1875 20.4601 27.1875 13.4103C27.1875 8.32099 24.2252 3.92698 19.9375 1.8753V5.20358ZM14.5 23.4407C13.7467 23.4407 13.1406 22.8309 13.1406 22.0729C13.1406 21.3149 13.7467 20.7051 14.5 20.7051C15.2533 20.7051 15.8594 21.3149 15.8594 22.0729C15.8594 22.8309 15.2533 23.4407 14.5 23.4407ZM9.37402 20.5C9.03984 20.8761 8.52441 21.03 8.0373 20.9103C7.55019 20.7849 7.1707 20.4031 7.04609 19.913C6.92715 19.4228 7.08008 18.9042 7.45391 18.568C7.78809 18.1918 8.30352 18.038 8.79062 18.1576C9.27773 18.283 9.65723 18.6649 9.78184 19.155C9.90078 19.6451 9.74785 20.1637 9.37402 20.5ZM21.5461 20.5C21.2119 20.8761 20.6965 21.03 20.2094 20.9103C19.7223 20.7849 19.3428 20.4031 19.2182 19.913C19.0992 19.4228 19.2521 18.9042 19.626 18.568C19.9602 18.1918 20.4756 18.038 20.9627 18.1576C21.4498 18.283 21.8293 18.6649 21.9539 19.155C22.0729 19.6451 21.9199 20.1637 21.5461 20.5ZM5.89062 14.7781C5.1373 14.7781 4.53125 14.1683 4.53125 13.4103C4.53125 12.6523 5.1373 12.0425 5.89062 12.0425C6.64395 12.0425 7.25 12.6523 7.25 13.4103C7.25 14.1683 6.64395 14.7781 5.89062 14.7781ZM23.1094 14.7781C22.3561 14.7781 21.75 14.1683 21.75 13.4103C21.75 12.6523 22.3561 12.0425 23.1094 12.0425C23.8627 12.0425 24.4688 12.6523 24.4688 13.4103C24.4688 14.1683 23.8627 14.7781 23.1094 14.7781Z" fill="white"/>
        </svg>  
    {/if}
</span>

<style>
    span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
    svg {
        width: 100%;
        height: 100%;
    }
</style>