import axios from 'axios';
import * as fs from 'fs';
import {createHash} from 'crypto';
import slugify from 'slugify';
import path from "node:path";
import {SongInfo} from "./common";
import {parsers} from "./parsers";


const hashUrl = (url: string): string => {
  return createHash('md5').update(url).digest('hex');
};

async function getContentByUrl(url: string, cacheFileName: string) {
  console.log('getContentByUrl', cacheFileName);
  if (fs.existsSync(cacheFileName)) {
    console.log('getting from cache', cacheFileName);
    return fs.readFileSync(cacheFileName, 'utf-8');
  }

    // throw 'fetchin';
    const result = (await axios.get(url)).data;
    fs.writeFileSync(cacheFileName, result);
    return result;

}


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

  return parseHtml(content, url);
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

function cleanupSongInfo(songInfo: SongInfo) {

    return {...songInfo,
        chords: songInfo.chords.replaceAll(/\n\n/g, '\n').trim()
    };
}

async function scrapChords(url: string, folder: string) {
    try {
        const data = cleanupSongInfo(await fetchChords(url));


    const fileName = slugify(data.performer + ' - ' + data.title) + '.md';

    const content = generateContent(data);

    fs.writeFileSync(path.join(folder, fileName), content);
}

const relativePath = path.join(__dirname, '../../src/content/songs_ru');


//https://amdm.ru/akkordi/korol_i_shut/23540/kukla_kolduna/
// https://amdm.ru/akkordi/korol_i_shut/2860/lesnik/
scrapChords(
    'https://amdm.ru/akkordi/korol_i_shut/2860/lesnik/',
    relativePath
)
