import { map } from "nanostores";
import { useStore } from "@nanostores/vue";

export interface Song {
  title: string;
}

export const useSongStore = (data: any) => {
  const m = map({ ...data });
  const song = useStore(m);

  return {
    song,
  };
};
