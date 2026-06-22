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
    pattern: z.enum(['node-graph', 'path-motif', 'dot-matrix', 'stacked-bars', 'branch']),
  }),
});

export const collections = { work };
