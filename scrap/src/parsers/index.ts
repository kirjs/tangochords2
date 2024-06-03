import {SongInfo} from "../common";
import {amdmParser} from "./amdm";
import {accordsProParser} from "./accords-pro";

export const parsers: { [key: string]: (html: string) => SongInfo } = {
    'amdm.ru': amdmParser,
    'akkords.pro': accordsProParser
} as const;