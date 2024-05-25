import {assert, describe, expect, test} from 'vitest';
import {parseChords, transpose} from "./chords.ts";

// Edit an assertion and save to see HMR in action

describe('parseChords', () => {
    test('parse chords', () => {
        expect(parseChords({
            text: `
Am        Dm       Em
Meow meow meow meow meow         
        `
        })).toEqual(
            [
                {
                    "type": "chordsAndLyricsLine",
                    "value": [
                        {
                            "chord": "Am",
                            "lyrics": "Me",
                        },
                        {
                            "chord": "        ",
                            "lyrics": "ow meow ",
                        },
                        {
                            "chord": "Dm",
                            "lyrics": "me",
                        },
                        {
                            "chord": "       ",
                            "lyrics": "ow meow",
                        },
                        {
                            "chord": "Em",
                            "lyrics": " m",
                        },
                    ],
                },
            ]
        );

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
                        "chord": "Am",
                        "lyrics": "Me",
                    },
                    {
                        "chord": "        ",
                        "lyrics": "ow meow ",
                    },
                    {
                        "chord": "Dm",
                        "lyrics": "me",
                    },
                    {
                        "chord": "       ",
                        "lyrics": "ow meow",
                    },
                    {
                        "chord": "Em",
                        "lyrics": " m",
                    },
                ],
            },
        ]
    );

});
