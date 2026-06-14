"use client"

import React from "react"
import {
    useParams,
} from "next/navigation"
import {
    PublicProfile,
} from "@/components/layouts/PublicProfile"

/**
 * Route `/[locale]/u/[userId]` — another user's public profile. Reads the user
 * id from the route and mounts the public profile component.
 */
const Page = () => {
    const params = useParams()
    return <PublicProfile userId={String(params.userId)} />
}

export default Page
