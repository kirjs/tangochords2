import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), vue()],
  content: {
    contentCollections: {
      songs: {
        schema: '.chord', // Specify your custom extension
      },
    },
  },
});
