"use client"

import React from "react"
import { PracticeProblem } from "@/components/layouts/learn/Practice"

/**
 * Route `/[locale]/practice/[slug]` — coding-problem detail + editor.
 * `PracticeProblem` reads the slug from the route itself.
 */
const Page = () => {
    return <PracticeProblem />
}

export default Page
