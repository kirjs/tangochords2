import { toRomanNumeralNotation } from "../components/header/TransposeBar/to_roman_numeral";
import { type LineToken } from "./chords";

export function addChordIndexes(
  song: LineToken[],
  key: string | undefined,
): LineToken[] {
  if (!key) {
    return song;
  }

  return song.map((line) => {
    if (line.type === "chordsAndLyricsLine") {      
      return {
        ...line,
        value: line.value.map((v) => {
          if (!v.chord) {
            return { ...v };
          }

          return {
            ...v,            
            romanNumeral: toRomanNumeralNotation(v.chord, key),
          };
        }),
      };
    }

    if (line.type === "chordsLine") {
      debugger;
      console.log(line.value);
      return {
        ...line,
        value: line.value.map((chord) => {
          console.log(chord.chord, key,toRomanNumeralNotation(chord.chord, key), '---');
          return {
            ...chord,            
            romanNumeral: toRomanNumeralNotation(chord.chord, key),
          };
        }),
      };
    } else {
      return line;
    }
  });
}
