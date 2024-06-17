import {
  transposeChords,
  transposeChord,
  extractBaseChords,
  extractChords,
  getChordIndex,
  type LineToken,
} from './chords';

import { assert } from './asserts';

export const chordHardness = {
  A: 1,
  'A#': 3,
  B: 3,
  H: 2,
  C: 1,
  'C#': 4,
  D: 1,
  'D#': 4,
  E: 1,
  F: 2,
  'F#': 2,
  G: 1,
  'G#': 4,
  Am: 1,
  'A#m': 2,
  Bm: 1,
  Hm: 2,
  Cm: 3,
  'C#m': 4,
  Dm: 1,
  'D#m': 4,
  Em: 1,
  Fm: 2,
  'F#m': 2,
  Gm: 3,
  'G#m': 4,
};

export function calculateKeyScore(chords: string[]) {
  return calculateSumScore(chords) / chords.length;
}

type KnownChord = keyof typeof chordHardness;

function assertKnownChord(chord: string): asserts chord is KnownChord {
  assert(chord in chordHardness, `uknown chord ${chord}`);
}

export function calculateSumScore(chords: string[]) {
  return chords
    .filter((chord): chord is KnownChord => {
      assertKnownChord(chord);
      return true;
    })
    .map((chord: KnownChord) => {
      return chordHardness[chord];
    })
    .reduce((a, b) => a + b, 0);
}

export function calculateScoresForAllKeys(chords: string[]) {
  return Array(12)
    .fill(undefined)
    .map((_, shift) => {
      const transposedChords = transposeChords(chords, shift);
      return {
        shift,
        chords: transposedChords,
        score: calculateKeyScore(transposedChords),
        sumScore: calculateSumScore(transposedChords),
      };
    });
}

export function analyzeSong(lines: LineToken[], songKey: string) {
  const baseChords = extractBaseChords(extractChords(lines));

  const scores = calculateScoresForAllKeys(baseChords).map((key) => {
    if (!songKey) {
      return {key, keyName: undefined};
    }
    return { ...key, keyName: transposeChord(songKey, key.shift) };
  });

  const result = scores
    .sort((a, b) => {
      if (!a.keyName || !b.keyName) {
        return 1;
      }
      return getChordIndex(a.keyName) - getChordIndex(b.keyName);
    })
    .sort((a, b) => a.score - b.score);

  return {
    bestKey: result[0],
    worstKey: result.at(-1),
    allKeys: result,
  };
}
