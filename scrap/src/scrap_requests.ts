import * as fs from 'fs';
import * as path from 'path';
import { scrapUrl } from './scrap';

const requestPath = path.join(__dirname, '..', '/request.txt');
const requests = fs.readFileSync(requestPath, 'utf-8')
    .split('\n')
    .filter((a: string) => !!a.trim())
    .filter(url => {
        try {
            scrapUrl(url)
            return false;
        } catch(e){
            return true;
        }
    });

fs.writeFileSync(requestPath, requests.join('\n'));


