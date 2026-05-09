import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const agents = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/agents' }),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    description: z.string(),
    team: z.array(z.string()).default([]),
    videoUrl: z.string().url().optional(),
    videoLocal: z.string().optional(),
    cover: z.string().optional(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { agents };
