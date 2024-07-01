import type { CollectionEntry } from "astro:content";
import { readonly, ref } from "vue";

export interface Song {
  title: string;
}

export const useSongsStore = (data: CollectionEntry<"songs_ru">[]) => {
  const songs = ref(data);

  return {
    songs: readonly(songs),
  };
};
