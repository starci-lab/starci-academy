import React from "react"
import { Contact } from "@/components/layouts/marketing/Contact"

/**
 * Route `/[locale]/contact` — renders the contact page (info + form).
 *
 * Thin route file: only mounts the component, no logic/UI here.
 */
const Page = () => {
    return <Contact />
}

export default Page
