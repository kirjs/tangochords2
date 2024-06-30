import { computed } from "vue";
import { analyzeSong } from "../../../chords/analysis";

import {
  calcKeyDifference,
  isMajorKey,
  isMinorKey,
  transpose,
  transposeChord,
  type LineToken,
} from "../../../chords/chords";
import { castExists } from "../../../chords/asserts";
import type { useSongStore } from "../../../store/song.store";
import { useLocalStorage } from "@vueuse/core";
import { tagLines } from "../../../chords/tag_lines";

// TODO: Why can't i just inject it?
export const useTransposeStore = (
  songStore: ReturnType<typeof useSongStore>,
) => {
  const { parsedSong, song } = songStore;
  const shift = useLocalStorage(`shift-${song.value.slug}`, 0);

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

  const magicKey = computed(() => {
    const { bestKey } = analyzeSong(transposedSong.value as LineToken[], "Am");
    return {
      chordName: key.value
        ? transposeChord(key.value, bestKey.shift)
        : undefined,
      ...bestKey,
    };
  });

  const simpleKeys = computed(() => {
    if (!key.value) {
      return [];
    }

    if (isMajorKey(key.value)) {
      return ["C", "G"].filter((c) => c !== magicKey.value.chordName);
    }

    if (isMinorKey(key.value)) {
      return ["Am", "Em"].filter((c) => c !== magicKey.value.chordName);
    }

    return [];
  });

  const transposeTones = (n: number) => {
    shift.value = (shift.value + n + 12) % 12;
  };

  const transposeToKey = (newKey: string) => {
    transposeTones(calcKeyDifference(castExists(key.value), newKey));
  };

  return {
    magicKey,
    simpleKeys,
    transposeTones,
    transposeToKey,
    transposedSong,
    shift,
    key,
  };
};

export type TransposeStore = ReturnType<typeof useTransposeStore>;
