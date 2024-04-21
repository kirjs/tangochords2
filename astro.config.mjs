import { defineConfig } from 'astro/config';

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],
  content: {
    dpages: 'src/content/dango', // custom directory for pages
  },
});