import { computed } from "vue";
import { analyzeSong } from "../../../chords/analysis";

import {
  calcKeyDifference,
  isMajorKey,
  isMinorKey,
  transposeChord,
  type LineToken,
} from "../../../chords/chords";
import { castExists } from "../../../chords/asserts";
import type { useSongStore } from "../../../store/song.store";

// TODO: Why can't i just inject it?
export const useTransposeStore = (
  songStore: ReturnType<typeof useSongStore>,
) => {
  const { shift, transposedSong, key } = songStore;

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

  return { magicKey, simpleKeys, transposeTones, transposeToKey };
};

export type TransposeStore = ReturnType<typeof useTransposeStore>;
