"use client"

import React from "react"
import { PracticeList } from "@/components/layouts/Practice"

/**
 * Route `/[locale]/practice` — coding-practice problem list. Thin route file:
 * mounts the list component; all logic/UI lives in the component.
 */
const Page = () => {
    return <PracticeList />
}

export default Page
