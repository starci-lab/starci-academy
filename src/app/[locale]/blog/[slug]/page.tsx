"use client"

import React from "react"
import { BlogPost } from "@/components/layouts/blog"

/**
 * Route `/[locale]/blog/[slug]` — public blog article. `BlogPost` reads the slug
 * from the route itself.
 */
const Page = () => {
    return <BlogPost />
}

export default Page
