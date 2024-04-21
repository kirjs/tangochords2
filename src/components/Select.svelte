<script>
    import Select from 'svelte-select';
    import {onDestroy, onMount} from "svelte";

    export let songs = [];
    let items = songs.map(song => {
        return {value: song.slug, label: song.data.title};
    })

    function navigateToSong(song) {
        const value = song.detail?.value;
        if (value) {
            window.location = '/songs/' + song.detail?.value;
        }
    }

    let listOpen = false;


    function handleShortcut(event) {
        if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
            event.preventDefault();
            listOpen = true;
        }
    }

    onMount(() => {
        window.addEventListener('keydown', handleShortcut);
    });

    onDestroy(() => {
        window.removeEventListener('keydown', handleShortcut);
    });
</script>

<Select placeholder="Find a song (CMD + K)"
        on:change={navigateToSong} {items} bind:listOpen class="foo bar">
    <div slot="prepend">🎶 &nbsp;</div>
</Select>

