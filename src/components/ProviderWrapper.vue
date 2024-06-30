<template>
    <VSong />
</template>

<script setup>
import { useSongStore } from "../store/song.store.ts";
import { useSongsStore } from "../store/songs.store.ts";
import { useTransposeStore } from "./header/TransposeBar/transpose.store.ts";
import { provide } from "vue";
import VSong from "./VSong.vue";

const { song, songs } = defineProps(["song", "songs"]);
const songsStore = useSongsStore(songs);
const songStore = useSongStore(song);
provide("songs-store", songsStore);
provide("song-store", songStore);
provide("transpose-store", useTransposeStore(songStore));

</script>
