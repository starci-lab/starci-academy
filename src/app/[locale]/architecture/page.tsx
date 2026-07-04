import React from "react"
import type { Metadata } from "next"
import { Architecture } from "@/components/features/architecture"
import { buildPageMetadata } from "@/modules/seo/buildMetadata"

/** Route params for `/[locale]/architecture`. */
interface ArchitectureParams {
    /** Active locale segment. */
    locale: string
}

/** Per-locale architecture-atlas metadata (canonical + hreflang + share card). */
export const generateMetadata = async ({
    params,
}: {
    params: Promise<ArchitectureParams>
}): Promise<Metadata> => {
    const { locale } = await params
    return buildPageMetadata({
        path: "/architecture",
        locale,
        title: locale === "vi" ? "Hệ thống StarCi, đang sống" : "StarCi's system, live",
    })
}

/**
 * Route `/[locale]/architecture` — public, interactive System Atlas: the live
 * 3D map + per-component dissection + curl playground. No auth / admin gate.
 * Thin route file: only mounts the feature, no logic/UI here.
 */
const Page = () => {
    return <Architecture />
}

export default Page
