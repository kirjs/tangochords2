import { computed } from "vue";
import { analyzeSong } from "../../../chords/analysis";
import type { SongStore } from "../../../store/song.store";
import {
  calcKeyDifference,
  isMajorKey,
  isMinorKey,
  transposeChord,
  type LineToken,
} from "../../../chords/chords";
import { castExists } from "../../../chords/asserts";

// TODO: Why can't i just inject it?
export const useTransposeStore = (songStore: SongStore) => {
  const { shift, transposedSong, key, goUp } = songStore;

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
    shift.value += n;
    goUp();
  };

  const transposeToKey = (newKey: string) => {
    transposeTones(calcKeyDifference(castExists(key.value), newKey));
  };

  return { magicKey, simpleKeys, transposeTones, transposeToKey };
};

export type TransposeStore = ReturnType<typeof useTransposeStore>;
