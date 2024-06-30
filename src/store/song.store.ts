import type { CollectionEntry } from "astro:content";
import { parseChords, transpose, transposeChord } from "../chords/chords";
import { tagLines } from "../chords/tag_lines";
import { computed, ref } from "vue";

export interface Song {
  title: string;
}

export const useSongStore = (data: CollectionEntry<"songs_ru">) => {
  const song = ref({ ...data });
  const shift = ref(0);

  const parsedSong = computed(() => {
    return parseChords({ text: song.value.body });
  });

  const key = computed(() => {
    if (song.value.data?.key) {
      return transposeChord(song.value.data.key, shift.value);
    } else {
      return undefined;
    }
  });

  const transposedSong = computed(() => {
    return transpose(tagLines(parsedSong.value), shift.value);
  });

  return {
    song,
    parsedSong,
    key,
    shift,
    transposedSong,
  };
};
