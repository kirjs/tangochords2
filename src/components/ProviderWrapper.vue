<template>
    <VSong />
</template>

<script setup>
import { useSongStore } from "../store/song.store.ts";
import { useTransposeStore } from "./header/TransposeBar/transpose.store.ts";
import { provide } from "vue";
import VSong from "./VSong.vue";

const { song } = defineProps(["song"]);
const songStore = useSongStore(song);
provide("song-store", useSongStore(song));
provide("transpose-store", useTransposeStore(songStore));

</script>
