import type { CollectionEntry } from "astro:content";
import { parseChords, transpose, transposeChord } from "../chords/chords";
import { tagLines } from "../chords/tag_lines";
import { computed, ref } from "vue";
import { useLocalStorage } from "@vueuse/core";

export interface Song {
  title: string;
}

export const useSongStore = (data: CollectionEntry<"songs_ru">) => {
  const song = ref(data);

  const parsedSong = computed(() => {
    return parseChords({ text: song.value.body });
  });

  return {
    song,
    parsedSong,
  };
};
