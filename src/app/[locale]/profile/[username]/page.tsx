"use client"

import React from "react"
import {
    PublicProfile,
} from "@/components/layouts/profile/PublicProfile"

/**
 * Route `/[locale]/profile/[username]` — any user's public, GitHub-style profile
 * (viewable by anyone), addressed by username like `github.com/<username>`. The
 * component reads the username from the route itself.
 *
 * Static `/profile/*` children (edit, bookmarks, sessions, …) take precedence
 * over this dynamic segment in Next routing, so the viewer's own profile hub and
 * its sub-pages are unaffected.
 */
const Page = () => {
    return <PublicProfile />
}

export default Page
