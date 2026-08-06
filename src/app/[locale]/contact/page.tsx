import React from "react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ContactPage } from "@/components/pages/ContactPage"
import { buildPageMetadata } from "@/modules/seo/buildMetadata"

/** Route params for `/[locale]/contact`. */
interface ContactParams {
    /** Active locale segment. */
    locale: string
}

/** Props for {@link generateMetadata}. */
interface GenerateMetadataProps {
    /** Promise of the resolved route params. */
    params: Promise<ContactParams>
}

/** Per-locale contact-page metadata (canonical + hreflang + share card). */
export const generateMetadata = async ({
    params,
}: GenerateMetadataProps): Promise<Metadata> => {
    const { locale } = await params
    const t = await getTranslations({ locale })
    return buildPageMetadata({
        path: "/contact",
        locale,
        title: t("contact.title"),
    })
}

/**
 * Route `/[locale]/contact` — renders the contact page (channels + form + FAQ).
 *
 * Thin route file: only mounts the feature, no logic/UI here.
 */
const Page = () => {
    return <ContactPage />
}

export default Page
