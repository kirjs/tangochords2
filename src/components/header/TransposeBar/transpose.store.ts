import { computed } from "vue";
import { analyzeSong } from "../../../chords/analysis";

import {
  calcKeyDifference,
  extractBaseChord,
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
import { addChordIndexes } from "../../../chords/add_chord_indexes";
import { toRomanNumeralNotation } from "./to_roman_numeral";


// TODO: Why can't i just inject it?
export const useTransposeStore = (
  songStore: ReturnType<typeof useSongStore>,
) => {
  const { parsedSong, song } = songStore;
  const shift = useLocalStorage(`shift-${song.value.slug}`, 0);
  const notation = useLocalStorage(`notation-${song.value.slug}`, "A");
 
  const key = computed(() => {
    if (song.value.data?.key) {
      return transposeChord(song.value.data.key, shift.value);
    } else {
      return undefined;
    }
  });

  const transposedSong = computed(() => {
    const withTags = tagLines(parsedSong.value);
    const withIndexes = addChordIndexes(withTags, song.value.data.key);
    return transpose(withIndexes, shift.value);
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

  const displayChord = (regular: string, roman: string) => {
    console.log(notation.value, regular, roman);    
    if (notation.value === "A") {
      return regular;
    }
    return roman || '';
  };

  return {
    displayChord,
    magicKey,
    simpleKeys,
    transposeTones,
    transposeToKey,
    transposedSong,
    shift,
    key,
    notation,
  };
};

export type TransposeStore = ReturnType<typeof useTransposeStore>;
