<template>
    <slot />
</template>


<script setup lang="ts">
import { useSongStore } from "./song.store.ts";
import { provide } from "vue";

const { song } = defineProps(['song']);
const songStore = useSongStore(song);
provide("song-store", songStore);

</script>
