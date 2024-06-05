import {  describe, expect, test } from 'vitest';
import {
  parseChords,
  extractBaseChords,
  transpose,
  calcKeyDifference,
  transposeChord,
  extractChords,
  isMajorKey,
  isMinorKey,
  isTagLine,
} from './chords.ts';

// Edit an assertion and save to see HMR in action

describe('parseChords', () => {
  const result = parseChords({
    text: `
Am        Dm       Em
Meow meow meow meow meow         
        `,
  });

  const expected = [
    {
      type: 'chordsAndLyricsLine',
      value: [
        {
          length: 10,
          chord: 'Am',
          lyrics: 'Meow meow ',
        },
        {
          length: 9,
          chord: 'Dm',
          lyrics: 'meow meow',
        },
        {
          length: 5,
          chord: 'Em',
          lyrics: ' meow',
        },
      ],
    },
  ];

  console.log('<----');
  console.log(JSON.stringify(result));
  console.log('---->');
  test('parse chords', () => {
    expect(result).toEqual(expected);
  });

  test('parse chords with empty spaces before chords', () => {
    const result = parseChords({
      text: `
Am 
Meow
   Dm
Wuf
        `,
    });

    const expected = [
      {
        type: 'chordsAndLyricsLine',
        value: [
          {
            length: 4,
            chord: 'Am',
            lyrics: 'Meow',
          },
        ],
      },
      {
        type: 'chordsAndLyricsLine',
        value: [
          {
            length: 3,
            lyrics: 'Wuf',
            chord: '',
          },
          {
            length: 2,
            chord: 'Dm',
            lyrics: '',
          },
        ],
      },
    ];

    expect(result).toEqual(expected);
  });
});

test('transpose', () => {
  expect(
    transpose(
      parseChords({
        text: `
Am        Dm       Em
ABCDEFGHIJKLMNOPQRSTUVWXYZ         
        `,
      }),
      2,
    ),
  ).toEqual([
    {
      type: 'chordsAndLyricsLine',
      value: [
        {
          length: 10,
          chord: 'Hm',
          lyrics: 'ABCDEFGHIJ',
        },
        {
          length: 9,
          chord: 'Em',
          lyrics: 'KLMNOPQRS',
        },
        {
          length: 7,
          chord: 'F#m',
          lyrics: 'TUVWXYZ',
        },
      ],
    },
  ]);
});

describe('tag line', () => {
  test('isTagLine', () => {
    expect(isTagLine('[pirojok]')).toBe(true);
    expect(isTagLine(' lol   [pirojok]')).toBe(false);
    expect(isTagLine('[pirojok]ddsd')).toBe(false);
    expect(isTagLine('')).toBe(false);
  });
});

describe('auto-transpose', () => {
  test('calcKeyDifference', () => {
    expect(calcKeyDifference('Am', 'Am')).toBe(0);
    expect(calcKeyDifference('Am', 'Hm')).toBe(2);
    expect(calcKeyDifference('Am', 'Dm')).toBe(5);
    expect(calcKeyDifference('Em', 'Am')).toBe(5);
    expect(calcKeyDifference('C', 'D')).toBe(2);
    expect(calcKeyDifference('D', 'C')).toBe(10);
    expect(calcKeyDifference('C', 'C')).toBe(0);
  });

  test('transpose chords', () => {
    expect(transposeChord('Am', 4)).toBe('C#m');
    expect(transposeChord('Am', 5)).toBe('Dm');
    expect(transposeChord('Am', 0)).toBe('Am');
    expect(transposeChord('Am/H', 2)).toBe('Hm/C#');
  });

  test('isMajorKey', () => {
    expect(isMajorKey('C')).toBe(true);
    expect(isMajorKey('C#')).toBe(true);
    expect(isMajorKey('D')).toBe(true);
    expect(isMajorKey('E#')).toBe(true);

    expect(isMajorKey('Am')).toBe(false);
    expect(isMajorKey('C#m')).toBe(false);
    expect(isMajorKey('Dm')).toBe(false);
    expect(isMajorKey('Em')).toBe(false);

    expect(isMajorKey('C/F')).toBe(false);
    expect(isMajorKey('Garbage')).toBe(false);
  });

  test('isMinorKey', () => {
    expect(isMinorKey('Cm')).toBe(true);
    expect(isMinorKey('C#m')).toBe(true);
    expect(isMinorKey('Dm')).toBe(true);
    expect(isMinorKey('E#m')).toBe(true);

    expect(isMinorKey('A')).toBe(false);
    expect(isMinorKey('C#')).toBe(false);
    expect(isMinorKey('D')).toBe(false);
    expect(isMinorKey('E')).toBe(false);

    expect(isMinorKey('Cm/F')).toBe(false);
    expect(isMinorKey('Garbage')).toBe(false);
  });
});

describe('extractChords', () => {
  test('Extracts some basic chords', () => {
    const parsed = parseChords({
      text: `Am        Dm       Em
  Meow meow meow meow meow `,
    });

    expect(extractChords(parsed)).toEqual(['Am', 'Dm', 'Em']);
  });

  test('sorts chords alphabetically', () => {
    const parsed = parseChords({
      text: `Em       Dm       Am
  Meow meow meow meow meow `,
    });

    expect(extractChords(parsed)).toEqual(['Am', 'Dm', 'Em']);
  });

  test('deduplicates chords', () => {
    const parsed = parseChords({
      text: `Em   Em    Dm       Am
  Meow meow meow meow meow 
  Am Dm Dm Am`,
    });

    expect(extractChords(parsed)).toEqual(['Am', 'Dm', 'Em']);
  });
});

describe('extractBaseChords', () => {
  test('Extracts some basic chords', () => {
    expect(extractBaseChords(['Am'])).toEqual(['Am']);

    expect(extractBaseChords(['Cdim'])).toEqual(['C']);
    expect(extractBaseChords(['C#dim'])).toEqual(['C#']);
    expect(extractBaseChords(['C#m7b5'])).toEqual(['C#m']);
    expect(extractBaseChords(['E13b9'])).toEqual(['E']);
    // It's a bug
    expect(extractBaseChords(['Bmaj7#11'])).toEqual(['B']);
  });
});
