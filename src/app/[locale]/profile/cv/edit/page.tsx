"use client"

import React from "react"
import {
    CVEdit,
} from "@/components/features/profile/CV/CVEdit"

/**
 * CV configuration route (`/profile/cv/edit`): upload/generate/revise, separate
 * from the `/profile/cv` review page.
 */
const Page = () => {
    return <CVEdit />
}

export default Page
