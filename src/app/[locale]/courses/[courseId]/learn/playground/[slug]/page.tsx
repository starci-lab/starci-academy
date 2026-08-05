"use client"

import React from "react"
import { PlaygroundPreparePage } from "@/components/pages/PlaygroundPreparePage"

/**
 * Learn / playground / [slug] — the exercise's SETUP surface. Everything it
 * needs comes from the session context the route's `layout.tsx` provides, so
 * this file names its Page and nothing else.
 */
const Page = () => <PlaygroundPreparePage />

export default Page
