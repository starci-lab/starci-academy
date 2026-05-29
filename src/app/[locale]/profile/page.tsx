import React from "react"
import {
    Profile,
} from "@/components/layouts/profile"

/**
 * Route `/[locale]/profile` — renders the profile hub.
 * Thin route file: only mounts the component, no logic/UI here.
 */
const Page = () => {
    return <Profile />
}

export default Page
