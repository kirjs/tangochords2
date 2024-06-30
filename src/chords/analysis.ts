import {
  transposeChords,
  transposeChord,
  extractBaseChords,
  extractChords,
  getChordIndex,
  type LineToken,
} from "./chords";

import { assert, castExists } from "./asserts";

export const chordHardness = {
  A: 1,
  "A#": 3,
  B: 3,
  H: 2,
  C: 1,
  "C#": 4,
  D: 1,
  "D#": 4,
  E: 1,
  F: 2,
  "F#": 2,
  G: 1,
  "G#": 4,
  Am: 1,
  "A#m": 2,
  Bm: 1,
  Hm: 2,
  Cm: 3,
  "C#m": 4,
  Dm: 1,
  "D#m": 4,
  Em: 1,
  Fm: 2,
  "F#m": 2,
  Gm: 3,
  "G#m": 4,
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

export interface SongKey {
  shift: number;
  chords: string[];
  score: number;
  sumScore: number;
  keyName?: string;
}
type ExactlyTwelve<T> = [T, T, T, T, T, T, T, T, T, T, T, T];

export function calculateScoresForAllKeys(
  chords: string[],
): ExactlyTwelve<SongKey> {
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
    }) as ExactlyTwelve<SongKey>;
}

export interface KeyAnalysis {
  worstKey: SongKey;
  bestKey: SongKey;
  allKeys: ExactlyTwelve<SongKey>;
}

export interface SongAnalysis extends KeyAnalysis {
  body: string;
  title: string;
  slug: string;
  key: string | undefined;
  complexityScore: string | number;
  sumScore: number;
}

export function analyzeSong(lines: LineToken[], songKey?: string): KeyAnalysis {
  const baseChords = extractBaseChords(extractChords(lines));

  const scores = calculateScoresForAllKeys(baseChords).map((key) => {
    if (!songKey) {
      return { ...key };
    }
    return { ...key, keyName: transposeChord(songKey, key.shift) };
  }) as SongKey[];

  const result = scores
    .sort((a, b) => {
      if (!a.keyName || !b.keyName) {
        return 1;
      }
      return getChordIndex(a.keyName) - getChordIndex(b.keyName);
    })
    .sort((a, b) => a.score - b.score) as ExactlyTwelve<SongKey>;

  return {
    bestKey: result[0],
    worstKey: castExists(result.at(-1)),
    allKeys: result,
  };
}
