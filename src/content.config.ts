import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    category: z.string().optional(),
  }),
});

const docs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    sidebar_label: z.string().optional(),
    last_reviewed: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

const learn = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/learn" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    sidebar_label: z.string().optional(),
    track: z.string().optional(),
    estimated_minutes: z.number().optional(),
    prereqs: z.array(z.string()).optional(),
    last_updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

const bracPoc = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/brac-poc" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    sidebar_label: z.string().optional(),
    last_reviewed: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, docs, learn, "brac-poc": bracPoc };
