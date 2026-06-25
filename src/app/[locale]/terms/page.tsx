import React from "react"
import { LegalPage } from "@/components/features/legal/LegalPage"

/**
 * Route `/[locale]/terms` — terms of service (stub). Thin route file: mounts the
 * shared legal feature, no logic/UI here.
 */
const Page = () => {
    return <LegalPage kind="terms" />
}

export default Page
