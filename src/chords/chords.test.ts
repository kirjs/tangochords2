import { assert, describe, expect, test } from 'vitest';
import { parseChords, transpose } from "./chords.ts";

// Edit an assertion and save to see HMR in action

describe('parseChords', () => {
    const result = parseChords({
        text: `
Am        Dm       Em
Meow meow meow meow meow         
        `
    });

    const expected = [
        {
          "type": "chordsAndLyricsLine",
          "value": [
            {
              "length": 10,
              "chord": "Am",
              "lyrics": "Meow meow "
            },
            {
              "length": 9,
              "chord": "Dm",
              "lyrics": "meow meow"
            },
            {
              "length": 5,
              "chord": "Em",
              "lyrics": " meow"
            }
          ]
        }
      ];

    console.log('<----')
    console.log(JSON.stringify(result))
    console.log('---->')
    test('parse chords', () => {
        expect(result).toEqual(
            expected
        );

    });


    test('parse chords with empty spaces before chords', () => {

        const result = parseChords({
            text: `
Am 
Meow
   Dm
Wuf
        `
        });

      
        const expected = [
            {
              "type": "chordsAndLyricsLine",
              "value": [
                {
                  "length": 4,
                  "chord": "Am",
                  "lyrics": "Meow"
                }
              ]
            },
            {
              "type": "chordsAndLyricsLine",
              "value": [
                {
                  "length": 3,
                  "lyrics": "Wuf",
                  "chord":  ''
                },
                {
                  "length": 2,
                  "chord": "Dm",
                  "lyrics": ""
                }
              ]
            }
          ];


        expect(result).toEqual(expected);

    });

})

test('transpose', () => {

    expect(transpose(parseChords({
        text: `
Am        Dm       Em
ABCDEFGHIJKLMNOPQRSTUVWXYZ         
        `
    }), 2)).toEqual(
        [
            {
              "type": "chordsAndLyricsLine",
              "value": [
                {
                  "length": 10,
                  "chord": "Hm",
                  "lyrics": "ABCDEFGHIJ"
                },
                {
                  "length": 9,
                  "chord": "Em",
                  "lyrics": "KLMNOPQRS"
                },
                {
                  "length": 7,
                  "chord": "F#m",
                  "lyrics": "TUVWXYZ"
                }
              ]
            }
          ]
    );

});
