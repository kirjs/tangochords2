import axios from 'axios';
import * as fs from 'fs';
import * as cheerio from 'cheerio';
import {createHash} from 'crypto';
import slugify from 'slugify';
import path from "node:path";


const hashUrl = (url: string): string => {
    return createHash('md5').update(url).digest('hex');
};

async function getContentByUrl(url: string, cacheFileName: string) {
    console.log('getContentByUrl', cacheFileName);
    if (fs.existsSync(cacheFileName)) {
        return fs.readFileSync(cacheFileName, 'utf-8')
    }

    throw 'fetchin';
    const result = (await axios.get(url)).data;
    fs.writeFileSync(cacheFileName, result);
    return result;

}

interface SongInfo {
    performer: string;
    title: string;
    chords: string;
    source?: string;
}

function amdmParser(html: string): SongInfo {
    const $ = cheerio.load(html);

    // Assuming the structured data is within specific tags as shown in the provided HTML
    const performer = $('h1 span[itemprop="byArtist"]').text().trim();
    const title = $('h1 span[itemprop="name"]').text().trim();
    const chords = $('pre.podbor__text').text().trim()
        .replaceAll(/(\[.*?]):/gi, '$1\n')
        .replaceAll(/(\(.*?\))/gi, '$1\n')
        // Drop tabs
        .replaceAll(/[1-6]\|[\d-]*\|\n/gi, '')
        


    return {
        performer,
        title,
        chords,
    };
}


const parsers: { [key: string]: (html: string) => SongInfo } = {
    'amdm.ru': amdmParser,
} as const;

function parseHtml(html: string, url: string) {
    const hostName = new URL(url).hostname.toLowerCase();


    if (!(hostName in parsers)) {
        throw new Error(`can not find parser for ${hostName}`);
    }

    const parser = parsers[hostName];
    const result = parser(html);
    return {
        ...result,
        source:
        url,
    }
}

async function fetchChords(url: string) {
    const fileName = 'cache/' + hashUrl(url) + '.txt';

    const content = await getContentByUrl(url, fileName);

    return parseHtml(content, url)
}


function generateContent(data: SongInfo) {

    const props: Array<keyof SongInfo> = ['title', 'performer', 'source'];
    let content = '---\n';

    for (const prop of props) {
        if (prop in data) {
            content += prop + ': ' + data[prop] + '\n';
        }
    }
    content += '---\n\n';
    content += data.chords;
    return content;
}

async function scrapChords(url: string, folder: string) {
    try {
        const data = await fetchChords(url);


        const fileName = slugify(data.performer + ' - ' + data.title) + '.md';


        let content = generateContent(data);

        fs.writeFileSync(path.join(folder, fileName), content)


    } catch (e) {
        console.log(e)
    }
}

const relativePath = path.join(__dirname, '../../src/content/songs_ru');


scrapChords(
    'https://amdm.ru/akkordi/korol_i_shut/23540/kukla_kolduna/',
    relativePath
)
