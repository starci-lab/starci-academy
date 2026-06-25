import React from "react"
import { LegalPage } from "@/components/features/legal/LegalPage"

/**
 * Route `/[locale]/privacy` — privacy policy (stub). Thin route file: mounts the
 * shared legal feature, no logic/UI here.
 */
const Page = () => {
    return <LegalPage kind="privacy" />
}

export default Page
