import type { MetadataRoute } from "next";
import { siteContent } from "@/lib/content";

export const dynamic = "force-static";

const BASE_URL = "https://me.deyuf.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${BASE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...siteContent.projects.map((p) => ({
      url: `${BASE_URL}/projects/${p.slug}/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
