import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

const routes = ["", "/cv", "/openhedge", "/is-mark-writing-code"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
  }));
}
