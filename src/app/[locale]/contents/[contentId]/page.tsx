import React from "react"
import { ContentDetail } from "@/components/layouts/ContentDetail"

/**
 * Route `/[locale]/contents/[contentId]` — renders a public content article.
 *
 * Thin route file: only mounts the component. The `[contentId]` param is synced
 * into redux globally, so no logic/data lives here.
 */
const Page = () => {
    return <ContentDetail />
}

export default Page
