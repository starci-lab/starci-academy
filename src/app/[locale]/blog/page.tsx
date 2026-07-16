"use client"

import React from "react"
import { BlogList } from "@/components/features/blog/BlogList"

/**
 * Route `/[locale]/blog` — public blog listing. Thin route file: mounts the list
 * component; all logic/UI lives in the component.
 */
const Page = () => {
    return <BlogList />
}

export default Page
