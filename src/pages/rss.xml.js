import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  return rss({
    title: "Zahid's Blog",
    description:
      "Notes on OpenShift, observability, identity, integration, security, AI, and the infrastructure underneath modern platforms.",
    site: context.site,
    items: posts
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: `/blog/${post.id}/`,
        categories: post.data.category ? [post.data.category] : undefined,
      })),
    customData: `<language>en-us</language>`,
  });
}
