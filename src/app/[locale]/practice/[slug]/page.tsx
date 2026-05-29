"use client"

import React from "react"
import { useParams } from "next/navigation"
import { PracticeProblem } from "@/components/layouts/Practice"

/**
 * Route `/[locale]/practice/[slug]` — coding-problem detail + editor. Reads the
 * slug from the route and mounts the problem component.
 */
const Page = () => {
    const params = useParams()
    return <PracticeProblem slug={String(params.slug)} />
}

export default Page
