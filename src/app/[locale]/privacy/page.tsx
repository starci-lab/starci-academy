import React from "react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { LegalPage } from "@/components/pages/LegalPage"
import { buildPageMetadata } from "@/modules/seo/buildMetadata"

/** Route params for `/[locale]/privacy`. */
interface PrivacyParams {
    /** Active locale segment. */
    locale: string
}

/** Props for privacy-page `generateMetadata`. */
interface PrivacyGenerateMetadataProps {
    /** Promise of the resolved privacy route params. */
    params: Promise<PrivacyParams>
}

/** Per-locale privacy-policy metadata, reusing the `legal.privacy.*` copy. */
export const generateMetadata = async ({
    params,
}: PrivacyGenerateMetadataProps): Promise<Metadata> => {
    const { locale } = await params
    const t = await getTranslations({ locale })
    return buildPageMetadata({
        path: "/privacy",
        locale,
        title: t("legal.privacy.title"),
        description: t("legal.privacy.description"),
    })
}

/**
 * Route `/[locale]/privacy` — privacy policy. Thin route file: mounts the shared
 * legal feature, no logic/UI here.
 */
const Page = () => {
    return <LegalPage kind="privacy" />
}

export default Page
