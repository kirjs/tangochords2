import { getCollection } from 'astro:content';

export const songsCollection = await getCollection('songs_ru');
