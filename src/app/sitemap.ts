import type { MetadataRoute } from "next";
import { getPortfolio } from "@/server/services/portfolio";
import { siteUrl } from "@/lib/utils";
import { chapters } from "@/lib/chapters";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const { projects } = await getPortfolio();
  return [
    ...chapters.map(({ href }) => ({
      url: href === "/" ? base : `${base}${href}`,
      priority: href === "/" ? 1 : 0.8,
    })),
    { url: `${base}/resume`, priority: 0.8 },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      priority: 0.8,
    })),
  ];
}
