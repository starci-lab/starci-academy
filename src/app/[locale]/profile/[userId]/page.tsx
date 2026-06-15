"use client"

import React from "react"
import {
    PublicProfile,
} from "@/components/layouts/profile/PublicProfile"

/**
 * Route `/[locale]/profile/[userId]` — any user's public, GitHub-style profile
 * (viewable by anyone). The component reads the user id from the route itself.
 *
 * Static `/profile/*` children (edit, bookmarks, sessions, …) take precedence
 * over this dynamic segment in Next routing, so the viewer's own profile hub and
 * its sub-pages are unaffected; a real user id (a uuid) only ever matches here.
 */
const Page = () => {
    return <PublicProfile />
}

export default Page
