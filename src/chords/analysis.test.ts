import { describe, expect, test } from 'vitest';
import { calculateKeyScore, calculateScoresForAllKeys } from './analysis.ts';


describe('findEasiestKey', () => {
  test('Extracts some basic chords', () => {
    // expect(findEasiestKey(['G#m', 'F#', 'C#', 'A'])).toEqual(['Am']);
  });
});

describe('calculateKeyScore', () => {
  test('Calculates the score based on chords', () => {
    expect(calculateKeyScore(['G#m', 'F#', 'C#', 'A'])).toEqual(2.75);
  });
});

describe('calculateScoresForAllKeys', () => {
  test('Calculates the score for all tones', () => {
    const expected = [
      { shift: 0, chords: ['G#m', 'F#', 'C#', 'A'], score: 2.75, sumScore: 11 },
      { shift: 1, chords: ['Am', 'G', 'D', 'A#'], score: 1.5, sumScore: 6 },
      { shift: 2, chords: ['A#m', 'G#', 'D#', 'H'], score: 3, sumScore: 12 },
      { shift: 3, chords: ['Hm', 'A', 'E', 'C'], score: 1.25, sumScore: 5 },
      { shift: 4, chords: ['Cm', 'A#', 'F', 'C#'], score: 3, sumScore: 12 },
      { shift: 5, chords: ['C#m', 'H', 'F#', 'D'], score: 2.25, sumScore: 9 },
      { shift: 6, chords: ['Dm', 'C', 'G', 'D#'], score: 1.75, sumScore: 7 },
      { shift: 7, chords: ['D#m', 'C#', 'G#', 'E'], score: 3.25, sumScore: 13 },
      { shift: 8, chords: ['Em', 'D', 'A', 'F'], score: 1.25, sumScore: 5 },
      { shift: 9, chords: ['Fm', 'D#', 'A#', 'F#'], score: 2.75, sumScore: 11 },
      { shift: 10, chords: ['F#m', 'E', 'H', 'G'], score: 1.5, sumScore: 6 },
      { shift: 11, chords: ['Gm', 'F', 'C', 'G#'], score: 2.5, sumScore: 10 },
    ];

    console.log(
      JSON.stringify(calculateScoresForAllKeys(['G#m', 'F#', 'C#', 'A'])),
    );

    expect(calculateScoresForAllKeys(['G#m', 'F#', 'C#', 'A'])).toEqual(
      expected,
    );
  });
});
