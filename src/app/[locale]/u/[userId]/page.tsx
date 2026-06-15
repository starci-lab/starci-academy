"use client"

import React from "react"
import {
    PublicProfile,
} from "@/components/layouts/profile/PublicProfile"

/**
 * Route `/[locale]/u/[userId]` — another user's public profile. The component
 * reads the user id from the route itself.
 */
const Page = () => {
    return <PublicProfile />
}

export default Page
