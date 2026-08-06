import React from "react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { SystemStatusPage } from "@/components/pages/SystemStatusPage"
import { buildPageMetadata } from "@/modules/seo/buildMetadata"

/** Route params for `/[locale]/status`. */
interface StatusParams {
    /** Active locale segment. */
    locale: string
}

/** Props for {@link generateMetadata}. */
interface GenerateMetadataProps {
    /** Promise of the resolved route params. */
    params: Promise<StatusParams>
}

/** Per-locale status-page metadata (canonical + hreflang + share card). */
export const generateMetadata = async ({
    params,
}: GenerateMetadataProps): Promise<Metadata> => {
    const { locale } = await params
    const t = await getTranslations({ locale })
    return buildPageMetadata({
        path: "/status",
        locale,
        title: t("status.title"),
    })
}

/**
 * Route `/[locale]/status` — PUBLIC "build in public" system status page. No
 * auth / admin gate. Thin route file: only mounts the feature, no logic/UI here.
 */
const Page = () => {
    return <SystemStatusPage />
}

export default Page
