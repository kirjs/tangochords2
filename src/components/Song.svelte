<script>
    import {ChordManager} from "../chords/chords.ts";

    let chord = 'C Major';


    export let song;
    let transposeTones = 0;

    let songHtml = '';

    const chordManager = new ChordManager();

    $: songHtml = chordManager.wrapChords({text: song.body, transposeTones, lineLength: 80});

    function transposeUp() {
        transposeTones += 1;
    }

    function transposeDown() {
        transposeTones += 1;
    }
</script>
<button on:click={transposeUp}>👆</button>
<button on:click={transposeDown}>👇</button>
{@html songHtml}

<style>
    button {
        background: #fff;
        border: 1px #dddddd solid;
        padding: 20px;
        border-radius: 50%;
    }
    :global(.chord) {
        color: #0b518a;
        font-weight: bold;
        margin-right: 12px;
    }
</style>