import type { CollectionEntry } from "astro:content";
import { computed, ref, type InjectionKey } from "vue";
import { parseChords } from "../chords/chords";

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

export const songStoreInjectionKey = Symbol("song-store") as InjectionKey<
  ReturnType<typeof useSongStore>
>;
