<template>
  <div>
    <v-select ref=selectRef v-model="selectedSong" :options="items" placeholder="Find a song (CMD + K)"
      class="select-song" :clearable="false">
      <template #prepend>
        🎶 &nbsp;
      </template>
    </v-select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, inject, watch } from 'vue';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import { castExists } from '../../../chords/asserts';
import type { useSongsStore } from '../../../store/songs.store';
import type { useSongStore } from '../../../store/song.store';

const { songs } = castExists(inject<ReturnType<typeof useSongsStore>>('songs-store'));
const { song } = castExists(inject<ReturnType<typeof useSongStore>>('song-store'));



const listOpen = ref(false);
const selectRef = ref();
const items = songs.value.map(song => ({
  value: song.slug,
  label: song.data.title
}));


console.log(song.value);
const selectedSong = ref<{ value: string; label: string } | null>(song.value && castExists(items.find(i => i.label === song.value.data.title)));

watch(selectedSong, navigateToSong);

function navigateToSong(song: { value: string; label: string } | null) {
  if (song) {
    window.location.href = '/songs/' + song.value;
  }
}

function handleShortcut(event: KeyboardEvent) {

  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {

    selectRef.value.$refs.search.focus()
    event.preventDefault();
    listOpen.value = true;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleShortcut);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleShortcut);
});
</script>

<style scoped>
.select-song {
  min-width: 400px;
  width: 100%;
}
</style>
