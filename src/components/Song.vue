<template>
  <VSong />
</template>

<script setup>
import { useSongStore } from "../store/song.store.ts";
import { provide } from "vue";
import VSong from "./VSong.vue";
const { song } = defineProps(["song"]);

const store = useSongStore(song);
provide("song-store", store);
</script>
