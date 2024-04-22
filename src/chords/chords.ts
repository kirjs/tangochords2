const chordBase = "[A-H][\\#b]?(?:m|Minor|Major)?(5|9b5|6add9|maj|maj7|maj9|maj11|maj13|maj9#11|maj13#11|6|add9|maj7b5|maj7#5||min|m7|m9|m11|m13|m6|madd9|m6add9|mmaj7|mmaj9|m7b5|m7#5|7|9|11|13|7sus4|7b5|7#5|7b9|7#9|7b5b9|7b5#9|7#5b9|9#5|13#11|13b9|11b9|aug|dim|dim7|sus4|sus2|sus2sus4|-5|7h5)?(?:/[A-H][\\#b]?)?";

/**
 * This is a regex for the main Note of the chord.
 * e.g. A, A#, F
 * but not Z, @
 */
const noteRegex = /([A-H]#?)/g;
/**
 * We need this index to figure out which note comes after which.
 */
const noteIndex: string[] = ["A", "A#", "H", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

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


export class ChordManager {
    /**
     * This is a self executing function that prepares regexps we'll need further
     */
    private readonly regex = {
        /**
         *  This regex match line which has nothing but chords and spaces.
         */
        chordLine: new RegExp("^\\s*(" + chordBase + "\\s*)+$"),

        /**
         *  This regex is used to match and replace chords.
         */
        chord: new RegExp("\\b(" + chordBase + ")\\s", "g"),
        /**
         *  This regex is used to find line which ends with a word.
         */
        wordAtTheEndOfTheLine: /\s([^\s])+$/

    }


    /**
     * Wrap all chords in a span
     * @param line
     */
    private wrapChordsInLine(line: string, transposeTones: number) {
        return (line + " ").replace(this.regex.chord, (_, chord) => {
            const transposedChord = this.transposeChord(chord, +transposeTones);
            return '<span class = "chord">' + transposedChord + '</span>';
        });
    }


    /**
     * Returns true is line consists of chords only.
     *
     * @param line
     */
    private isChordLine(line: string) {
        return line.match(this.regex.chordLine);
    }

    /**
     * If the line cut by %lineLength% symbols ends with a word, we substitute it and return new line length.
     *
     * @param line
     * @param lineLength
     * @return {*}
     */
    private wrapLength(line: string, lineLength: number) {
        const lastPart = (line + " ").substr(0, lineLength).match(this.regex.wordAtTheEndOfTheLine);
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
    private breakLongLines(chordLine: string, textLine: string, lineLength: number, transposeTones: number): string {
        /**
         * If the line breaks a word or a chord, we want to move it to the next line.
         * So we take smaller line length for this line.
         */
        lineLength = Math.min(lineLength, this.wrapLength(chordLine, lineLength), this.wrapLength(textLine, lineLength));

        /**
         * If we have text/chords we return first two lines cut to %lineHeight% symbols,
         * and then add results of this function.
         */
        if (chordLine.length || textLine.length) {
            return '<p class = "chords">' + this.wrapChordsInLine(chordLine.substr(0, lineLength), transposeTones) + '</p>' +
                '<p>' + textLine.substr(0, lineLength) + '</p>' +
                this.breakLongLines(chordLine.substr(lineLength), textLine.substr(lineLength), lineLength, transposeTones)
        }

        return "";
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

    wrapChords({text = '', lineLength = 80, transposeTones = 0, key = 'Am', wantedKey = 'Am'}) {
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

            if (!this.isChordLine(nextLine) && this.isChordLine(line)) {
                result += this.breakLongLines(line, nextLine, lineLength, transposeTones);
                i++;
            } else {
                result += this.breakLongLines(line, "", lineLength, transposeTones);
            }
            result += '</div>';
        }
        return result;
    }

    /**
     * Transposes chord.
     * C -> C#
     * C#m -> D
     *
     * This is a real basic function, which doesn't know anything about tonalities and bemols.
     *
     * @returns Function
     */
    private transposeChord(chord: string, steps: number) {
        steps = +steps;
        return chord.replace(noteRegex, (note: string) => {
            if (!note || typeof reverseIndex[note] === "undefined") {
                return "Can't transpose chord '" + chord + "'";
            }

            const newIndex = ((reverseIndex[note] || 0) + steps + 12) % 12;
            return noteIndex[newIndex] || '';
        });

    }
}


