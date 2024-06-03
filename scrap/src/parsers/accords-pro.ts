import {SongInfo} from "../common";
import cheerio from "cheerio";

export function accordsProParser(html: string): SongInfo {
    const $ = cheerio.load(html);

    const header = $('.entry-title').text().trim();
    const [_, performer, title] = header.match(/^(.*?)\s—\s(.*?):/)!

    const chords = $('.chords').text().trim()
        .replaceAll(/([\w А-Яа-я]{5,12}):\n/gi, '[$1]\n')
        .replaceAll(/.*:.*см. табы и ноты.*\n/gi, '')


    return {
        title, performer, chords,
    }
}