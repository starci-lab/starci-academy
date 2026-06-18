import React from "react"
import { Contact } from "@/components/features/contact/Contact"

/**
 * Route `/[locale]/contact` — renders the contact page (channels + form + FAQ).
 *
 * Thin route file: only mounts the feature, no logic/UI here.
 */
const Page = () => {
    return <Contact />
}

export default Page
