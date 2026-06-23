import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    subtitle: z.string(),
    order: z.number(),
    featured: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    snapshot: z
      .object({
        role: z.string(),
        timeline: z.string(),
        tools: z.string(),
        team: z.string(),
      })
      .optional(),
    metric: z.string(),
    metricLabel: z.string(),
    color: z.string(),
    pattern: z.enum(['node-graph', 'path-motif', 'dot-matrix', 'stacked-bars', 'branch', 'lattice', 'merge']),
  }),
});

const recipes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/recipes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['baked-goods', 'savory', 'soups', 'pasta']),
    tags: z.array(z.string()).optional(),
    yield: z.string().optional(),
    personalNote: z.string(),
    youtubeId: z.string().optional(),
    image: z.string().optional(),
    date: z.date(),
  }),
});

export const collections = { work, recipes };
