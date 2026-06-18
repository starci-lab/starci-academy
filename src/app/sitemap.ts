import type { MetadataRoute } from "next"
import { SEO_CONFIG } from "@/config/seo"

/** Locales the public pages are served under (mirrors the `[locale]` segment). */
const LOCALES: ReadonlyArray<string> = ["vi", "en"]

/** Public top-level routes worth indexing, with their relative priority. */
const ROUTES: ReadonlyArray<{ path: string, priority: number }> = [
    { path: "", priority: 1 },
    { path: "/courses", priority: 0.9 },
    { path: "/blog", priority: 0.7 },
    { path: "/contact", priority: 0.5 },
]

/**
 * `/sitemap.xml` — the static public routes across both locales. Per-content
 * article urls (`/contents/<displayId>`) are NOT enumerated here yet: that needs a
 * "list public contents" query; add a dedicated content sitemap once it exists.
 */
const sitemap = (): MetadataRoute.Sitemap =>
    LOCALES.flatMap((locale) =>
        ROUTES.map((route) => ({
            url: `${SEO_CONFIG.siteUrl}/${locale}${route.path}`,
            changeFrequency: "weekly" as const,
            priority: route.priority,
        })))

export default sitemap
