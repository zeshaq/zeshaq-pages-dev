import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const sessions = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/sessions" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    nodes: z.array(z.any()),
    edges: z.array(z.any()),
  }),
});

export const collections = { blog, sessions };
