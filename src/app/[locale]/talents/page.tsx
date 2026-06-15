"use client"

import React from "react"
import {
    TalentDirectory,
} from "@/components/layouts/headhunting/TalentDirectory"

/**
 * Route `/[locale]/talents` — the talent directory: users who opted into
 * "open to work", for recruiters / headhunters to browse.
 */
const Page = () => {
    return <TalentDirectory />
}

export default Page
