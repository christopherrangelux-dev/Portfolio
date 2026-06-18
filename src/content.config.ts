import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    subtitle: z.string(),
    thumbnail: z.string(),
    order: z.number(),
  }),
});

export const collections = { work };
