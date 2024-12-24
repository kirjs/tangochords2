import { castExists } from "../../../chords/asserts";
import { extractBaseChord, getChordIndex, isMinorKey } from "../../../chords/chords";
const major = [
    "I",
    "I#",
    "ii",
    "ii#",
    "iii",
    "IV",
    "IV#",
    "V",
    "V#",
    "vi",
    "vi#",
    "vii",
  ];

  const minor = [
    "i",
    "i#",
    "ii",
    "III",
    "III#",
    "iv",
    "iv#",    
    "v",    
    "VI",
    "VI#",
    "VII",
    "VII#",
  ];


export function toRomanNumeralNotation(
  chord: string | undefined,
  key: string
) {
  return chord
    ?.split("/")
    .map((chord) => toRomanNumeralNotationSingleChord(chord, key))
    .join("/");
}

export function toRomanNumeralNotationSingleChord(
  chord: string | undefined,
  key: string,
) {
  if (!chord || key === undefined) {
    return chord;
  }

  const index =
            (getChordIndex(extractBaseChord(chord)) -
              getChordIndex(extractBaseChord(key)) +
              12) %
            12;
  const isMinor = isMinorKey(key);

  const base = extractBaseChord(chord);
  const isChordsMinor = isMinorKey(chord);
  const scale = isMinor ? minor : major;
  const newChord = castExists(scale[index]);

  return chord.replace(base, isChordsMinor ? newChord : newChord.toUpperCase());
}
