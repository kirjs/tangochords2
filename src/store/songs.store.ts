import type { CollectionEntry } from "astro:content";
import { ref } from "vue";

export interface Song {
  title: string;
}

export const useSongsStore = (data: CollectionEntry<"songs_ru">[]) => {
  const songs = ref(data);

  return {
    songs,
  };
};
