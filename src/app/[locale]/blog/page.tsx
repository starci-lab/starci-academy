"use client"

import React from "react"
import { BlogListPage } from "@/components/pages/BlogListPage"

/**
 * Route `/[locale]/blog` — public blog listing. Thin route file: mounts the list
 * component; all logic/UI lives in the component.
 */
const Page = () => {
    return <BlogListPage />
}

export default Page
