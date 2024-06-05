const chordBase =
  '[A-H][\\#b]?(?:m|Minor|Major)?(5|9b5|6add9|maj|maj7|maj9|maj11|maj13|maj9#11|maj13#11|6|add9|maj7b5|maj7#5||min|m7|m9|m11|m13|m6|madd9|m6add9|mmaj7|mmaj9|m7b5|m7#5|7|9|11|13|7sus4|7b5|7#5|7b9|7#9|7b5b9|7b5#9|7#5b9|9#5|13#11|13b9|11b9|aug|dim|dim7|sus4|sus2|sus2sus4|-5|7h5)?(?:/[A-H][\\#b]?)?';

/**
 * This is a regex for the main Note of the chord.
 * e.g. A, A#, F
 * but not Z, @
 */
const noteRegex = /([A-H]#?)/g;
/**
 * We need this index to figure out which note comes after which.
 */
const noteIndex: string[] = [
  'A',
  'A#',
  'H',
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
];

/**
 * We need this index to find position of the note.
 */
const reverseIndex: Record<string, number> = {};
for (let i = 0, l = noteIndex.length; i < l; i++) {
  reverseIndex[noteIndex[i] || 'A'] = i;
}

/**
 * Some synonyms also go here.
 */
reverseIndex['B'] = 2;
reverseIndex['B#'] = 3;
reverseIndex['H#'] = 3;
reverseIndex['E#'] = 8;

const chordLineRegex = new RegExp('^\\s*(' + chordBase + '\\s*)+$');

/**
 * Returns true is line consists of chords only.
 *
 * @param line
 */
function isChordLine(line: string) {
  return line.match(chordLineRegex);
}

/**
 *
 * Transposes chord.
 * C -> C#
 * C#m -> D
 *
 * This is a real basic function, which doesn't know anything about tonalities and bemols.
 *
 * @returns Function
 */
export function transposeChord(chord: string, steps: number) {
  steps = +steps;
  return chord.replace(noteRegex, (note: string) => {
    if (!note || typeof reverseIndex[note] === 'undefined') {
      return "Can't transpose chord '" + chord + "'";
    }

    const newIndex = ((reverseIndex[note] || 0) + steps + 12) % 12;
    return noteIndex[newIndex] || '';
  });
}
export function transposeChords(chords: string, steps: number) {
  return chords.map((chord) => transposeChord(chord, steps));
}

export class ChordManager {
  /**
   * This is a self executing function that prepares regexps we'll need further
   */
  private readonly regex = {
    /**
     *  This regex match line which has nothing but chords and spaces.
     */

    /**
     *  This regex is used to match and replace chords.
     */
    chord: new RegExp('\\b(' + chordBase + ')\\s', 'g'),
    /**
     *  This regex is used to find line which ends with a word.
     */
    wordAtTheEndOfTheLine: /\s([^\s])+$/,
  };

  /**
   * Wrap all chords in a span
   * @param line
   */
  private wrapChordsInLine(line: string, transposeTones: number) {
    return (line + ' ').replace(this.regex.chord, (_, chord) => {
      const transposedChord = transposeChord(chord, +transposeTones);
      return '<span class = "chord">' + transposedChord + '</span>';
    });
  }

  /**
   * If the line cut by %lineLength% symbols ends with a word, we substitute it and return new line length.
   *
   * @param line
   * @param lineLength
   * @return {*}
   */
  private wrapLength(line: string, lineLength: number) {
    const lastPart = (line + ' ')
      .substr(0, lineLength)
      .match(this.regex.wordAtTheEndOfTheLine);
    if (lastPart) {
      return (lastPart?.index || 0) + 1;
    }
    return lineLength;
  }

  /**
   * Breaks long lines.
   * The idea is to keep chords above the text
   *
   * @param chordLine
   * @param textLine
   * @param lineLength
   * @return {String}
   *
   */
  private breakLongLines(
    chordLine: string,
    textLine: string,
    lineLength: number,
    transposeTones: number,
  ): string {
    /**
     * If the line breaks a word or a chord, we want to move it to the next line.
     * So we take smaller line length for this line.
     */
    lineLength = Math.min(
      lineLength,
      this.wrapLength(chordLine, lineLength),
      this.wrapLength(textLine, lineLength),
    );

    /**
     * If we have text/chords we return first two lines cut to %lineHeight% symbols,
     * and then add results of this function.
     */
    if (chordLine.length || textLine.length) {
      return (
        '<p class = "chords">' +
        this.wrapChordsInLine(chordLine.substr(0, lineLength), transposeTones) +
        '</p>' +
        '<p>' +
        textLine.substr(0, lineLength) +
        '</p>' +
        this.breakLongLines(
          chordLine.substr(lineLength),
          textLine.substr(lineLength),
          lineLength,
          transposeTones,
        )
      );
    }

    return '';
  }

  /**
   * Goes through the text and wraps chords in <p> elements
   * e.g.
   *
   * Am   Dm
   * alalalla
   *
   * Will turn into
   * <p class = "chords-line">
   *     <span class = 'chord'>Am</span>
   *     <span class = 'chord'>Dm</span>
   * </p>';
   * <p class = "text-line">alalalla</p>
   *
   * Also it breaks  a line if it's too long,
   * keeping chords above the text
   */

  wrapChords({
    text = '',
    lineLength = 80,
    transposeTones = 0,
    key = 'Am',
    wantedKey = 'Am',
  }) {
    var result = '';
    var lines = text.trim().split(/[\n\r]{1,2}/);
    lineLength = lineLength || 50;

    for (var i = 0, l = lines.length - 1; i < l; i++) {
      const line = lines[i];
      const nextLine = lines[i + 1] || '';
      if (!line) {
        result += '<div class = "chordLine"></div>';
        continue;
      }

      result += '<div class = "chordLine">';

      if (!isChordLine(nextLine) && isChordLine(line)) {
        result += this.breakLongLines(
          line,
          nextLine,
          lineLength,
          transposeTones,
        );
        i++;
      } else {
        result += this.breakLongLines(line, '', lineLength, transposeTones);
      }
      result += '</div>';
    }
    return result;
  }
}

export interface ParseChordsConfig {
  text: string;
}

interface ChordLineValueToken {
  chord: string | undefined;
  lyrics: string;
  length: number;
}

interface chordsAndLyricsLineToken {
  type: 'chordsAndLyricsLine';
  value: ChordLineValueToken[];
}

interface EmptyLineToken {
  type: 'emptyLine';
}

interface LyricsLineToken {
  type: 'lyricsLine';
  value: string;
}

interface ChordsLineTokenValueToken {
  chord: string;
}

interface ChordsLineToken {
  type: 'chordsLine';
  value: ChordsLineTokenValueToken[];
}

export type LineToken =
  | chordsAndLyricsLineToken
  | ChordsLineToken
  | EmptyLineToken
  | LyricsLineToken;

function emptyLineToken(): EmptyLineToken {
  return {
    type: 'emptyLine',
  };
}

function lyricsToken(line: string): LyricsLineToken {
  return {
    type: 'lyricsLine',
    value: line,
  };
}

export function isTagLine(line: string) {
  return /^\[[^]*\]$/.test(line);
}

function tagToken(line: string): LyricsLineToken {
  return {
    type: 'tagLine',
    value: line.slice(1, -1),
  };
}

function chordsLineToken(line: string): chordsAndLyricsLineToken {
  return chordsAnLyrycsToken(line, '');
}

function chordsAnLyrycsToken(
  chords: string,
  lyrics: string,
): chordsAndLyricsLineToken {
  const parts = chords.padEnd(lyrics.length, ' ').matchAll(/\s+|(\S+)\s*/g);
  // console.log([...parts])
  const result: ChordLineValueToken[] = [];

  let shift = 0;
  for (const [part = '', chord] of parts) {
    result.push({
      length: part.length,
      chord: chord ?? '',
      lyrics: lyrics.slice(shift, shift + part.length),
    });
    shift += part.length;
  }

  return {
    type: 'chordsAndLyricsLine',
    value: result,
  };
}

export function parseChords({ text }: ParseChordsConfig): LineToken[] {
  if (!text || text.trim() === '') {
    debugger;
    throw new Error('Empty song');
  }
  const lines = text.trim().split('\n');

  function parseLines([line, ...rest]: string[]): LineToken[] {
    if (line === undefined) {
      return [];
    }
    if (line.trim() === '') {
      return [emptyLineToken(), ...parseLines(rest)];
    }

    if (isTagLine(line)) {
      return [tagToken(line), ...parseLines(rest)];
    }

    if (!isChordLine(line)) {
      return [lyricsToken(line), ...parseLines(rest)];
    }

    const [next, ...restWithoutNext] = rest;

    if (!next || isChordLine(next)) {
      return [chordsLineToken(line), ...parseLines(rest)];
    }

    return [chordsAnLyrycsToken(line, next), ...parseLines(restWithoutNext)];
  }

  return parseLines(lines);
}

export function transpose(lines: LineToken[], tones: number) {
  tones = (tones + 12) % 12;
  return lines.map((line) => {
    if (line.type === 'chordsLine' || line.type === 'chordsAndLyricsLine') {
      return {
        ...line,
        value: line.value.map((value) => {
          return {
            ...value,
            chord: value.chord
              ? transposeChord(value.chord, tones)
              : value.chord,
          };
        }),
      };
    }

    return line;
  });
}

export function calcKeyDifference(key1: string, key2: string) {
  const index1 = reverseIndex[key1.slice(0, 1)];
  const index2 = reverseIndex[key2.slice(0, 1)];
  return (index2 - index1 + 12) % 12;
}

export function isMajorKey(key: string) {
  return key in reverseIndex;
}

export function isMinorKey(key: string) {
  return key.slice(-1) === 'm' && isMajorKey(key.slice(0, -1));
}

export function extractChords(lines: LineToken[]) {
  const allChords = lines
    .filter((line) => line.type === 'chordsAndLyricsLine')
    .flatMap((line) => line.value)
    .map((value) => value.chord)
    .filter((chord) => chord !== '');

  return [...new Set(allChords)].sort();
}

const baseChordRegex = /^[A-H]#?m?/i;

export function extractBaseChord(chord: string) {
  return chord.replace('maj', '').match(baseChordRegex)[0];
}
export function extractBaseChords(chords: string[]) {
  return chords.map(extractBaseChord);
}
