import { transposeChord, transposeChords,extractBaseChords, extractChords, type LineToken } from './chords'

export const chordHardness = {
    'A': 1,
    'A#': 3,
    'B': 3,
    'H': 2,
    'C': 1,
    'C#': 4,
    'D': 1,
    'D#': 4,
    'E': 1,
    'F': 2,
    'F#': 2,
    'G': 1,
    'G#': 4,
    'Am': 1,
    'A#m': 2,
    'Bm': 1,
    'Hm': 2,
    'Cm': 3,
    'C#m': 4,
    'Dm': 1,
    'D#m': 4,
    'Em': 1,
    'Fm': 2,
    'F#m': 2,
    'Gm': 3,
    'G#m': 4,
}

export function calculateKeyScore(chords: string[]){
    return calculateSumScore(chords) / chords.length;
}

export function calculateSumScore(chords: string[]){
    return chords.map(chord => chordHardness[chord]).reduce((a, b) => a + b, 0);
}

export function findEasiestKey(chords: string[]){
    
}


export function calculateScoresForAllKeys(chords: string[]){
    return Array(12).fill().map((_,shift) => {
        const transposedChords = transposeChords(chords, shift);    
        return {
            shift, 
            chords: transposedChords,
            score: calculateKeyScore(transposedChords),
            sumScore: calculateSumScore(transposedChords),
        }
    });
}

export function calculateBestKey(lines: LineToken[]){
    const baseChords = extractBaseChords(extractChords(lines));

    const scores = calculateScoresForAllKeys(baseChords);
    
    scores
    .sort((a, b) => a.shift - b.shift)
    .sort((a, b) => a.score - b.score);
    console.log(scores);
    return scores[0];    
}