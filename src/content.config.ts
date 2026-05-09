import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const agents = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/agents' }),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    description: z.string(),
    category: z.enum([
      'Cumplimiento',
      'Estrategia',
      'Datos',
      'Procesos',
      'Adopción IA',
      'Gestión de Proyectos',
    ]),
    status: z.enum(['Idea', 'Prototipo', 'Beta', 'Producción']).default('Idea'),
    team: z.array(z.string()).default([]),
    faculty: z.string().optional(),
    tags: z.array(z.string()).default([]),
    accent: z
      .enum(['indigo', 'amber', 'emerald', 'violet', 'orange', 'sky'])
      .default('indigo'),
    cover: z.string().optional(),
    demoUrl: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
    videoLocal: z.string().optional(),
    featured: z.boolean().default(false),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { agents };
