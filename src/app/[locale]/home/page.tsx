"use client"
import React from "react"
import { LandingPage } from "@/components/layouts/LandingPage"

/**
 * Marketing landing page at an explicit URL.
 *
 * The root `/` is GitHub-style gated (logged-in users are redirected to the
 * dashboard). This `/home` route renders the same landing page but is NOT gated,
 * so a signed-in user can still revisit the marketing page on purpose.
 */
const Page = () => {
    return (
        <LandingPage />
    )
}

export default Page
