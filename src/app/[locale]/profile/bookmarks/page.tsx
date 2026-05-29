import React from "react"
import {
    Bookmarks,
} from "@/components/layouts/profile"

/**
 * Route `/[locale]/profile/bookmarks` — renders the saved-content (bookmarks)
 * feature. Thin route file: only mounts the component, no logic/UI here.
 */
const Page = () => {
    return <Bookmarks />
}

export default Page
