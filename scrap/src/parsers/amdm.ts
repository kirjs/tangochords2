import {SongInfo} from "../common";
import cheerio from "cheerio";

export function amdmParser(html: string): SongInfo {
    const $ = cheerio.load(html);

    // Assuming the structured data is within specific tags as shown in the provided HTML
    const performer = $('h1 span[itemprop="byArtist"]').text().trim();
    const title = $('h1 span[itemprop="name"]').text().trim();
    const chords = $('pre.podbor__text').text().trim()
        .replaceAll(/(\[.*?]):/gi, '$1\n')
        .replaceAll(/(\(.*?\))/gi, '$1\n')
        // Drop tabs
        .replaceAll(/[1-6]\|[\d-]*\|\n/gi, '')
        .replaceAll(/^[\d-]*$\n/gim, '')


    return {
        performer,
        title,
        chords,
    };
}