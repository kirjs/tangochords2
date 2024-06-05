// Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';
// Define a `type` and `schema` for each collection
const songsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    genre: z.string().optional(),
    lyricist: z.string().optional(),
    key: z.string().optional(),
    composer: z.string().optional(),
    performer: z.string().optional(),
    text: z.string().optional(),
  }),
});
// Export a single `collections` object to register your collection(s)
export const collections = {
  songs_ru: songsCollection,
  songs_tango: songsCollection,
};
