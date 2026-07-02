"use client"

import React from "react"
import { RagPlayground } from "@/components/features/rag-playground/RagPlayground"

/**
 * Route `/[locale]/rag-playground` — PUBLIC marketing demo (no login required):
 * import code, ask questions about it, answered live by the teacher's
 * self-hosted local model. Thin route file: mounts the feature; all logic/UI
 * lives there.
 */
const Page = () => {
    return <RagPlayground />
}

export default Page
