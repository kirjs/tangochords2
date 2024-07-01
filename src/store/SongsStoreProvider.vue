<template>
    <slot />
</template>

<script setup>
import { useSongsStore } from "./songs.store.ts";
import { provide } from "vue";

const { songs } = defineProps(['songs']);

const songsStore = useSongsStore(songs);
provide("songs-store", songsStore);

</script>
