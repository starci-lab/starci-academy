import React from "react"
import type { Metadata } from "next"
import { ContactPage } from "@/components/pages/ContactPage"
import { buildPageMetadata } from "@/modules/seo/buildMetadata"

/** Route params for `/[locale]/contact`. */
interface ContactParams {
    /** Active locale segment. */
    locale: string
}

/** Per-locale contact-page metadata (canonical + hreflang + share card). */
export const generateMetadata = async ({
    params,
}: {
    params: Promise<ContactParams>
}): Promise<Metadata> => {
    const { locale } = await params
    return buildPageMetadata({
        path: "/contact",
        locale,
        title: locale === "vi" ? "Liên hệ" : "Contact",
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
