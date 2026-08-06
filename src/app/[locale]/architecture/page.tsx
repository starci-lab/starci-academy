import React from "react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ArchitecturePage } from "@/components/pages/ArchitecturePage"
import { buildPageMetadata } from "@/modules/seo/buildMetadata"

/** Route params for `/[locale]/architecture`. */
interface ArchitectureParams {
    /** Active locale segment. */
    locale: string
}

/** Props for {@link generateMetadata}. */
interface GenerateMetadataProps {
    /** Promise of the resolved route params. */
    params: Promise<ArchitectureParams>
}

/** Per-locale architecture-atlas metadata (canonical + hreflang + share card). */
export const generateMetadata = async ({
    params,
}: GenerateMetadataProps): Promise<Metadata> => {
    const { locale } = await params
    const t = await getTranslations({ locale })
    return buildPageMetadata({
        path: "/architecture",
        locale,
        title: t("architecture.title"),
    })
}

/**
 * Route `/[locale]/architecture` — public, interactive System Atlas: the live
 * 3D map + per-component dissection + curl playground. No auth / admin gate.
 * Thin route file: only mounts the feature, no logic/UI here.
 */
const Page = () => {
    return <ArchitecturePage />
}

export default Page
