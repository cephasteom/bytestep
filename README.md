TODO:
Musts:
* make some music / sound design
* bug: when recording loops round, sustained notes are cut short
* volume fader - pushes all notes eventually to an amp of 1
* more bars please, perhaps with the default set to loop at 2?

Nice to haves once proven useful:
* sequencer settings modal 
    - number of bars
    - quantize division and pitch
    - interference 
    - random - generation and riffing on what's there
    - cellular automata
* cc interface
* sync to DAW
* transpose up and down octave

# ByteStep
A MIDI step sequencer combining the convenience of a DAW with the flexibility of code. In development. 

Built on top of SvelteKit.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
