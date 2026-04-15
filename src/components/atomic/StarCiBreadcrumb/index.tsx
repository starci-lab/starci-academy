import { Breadcrumbs, BreadcrumbsItem } from "@heroui/react"
import type { BreadcrumbsRootProps } from "@heroui/react"
import React from "react"

export const StarCiBreadcrumb = (props: BreadcrumbsRootProps) => {
    return <Breadcrumbs {...props} />
}   
export const StarCiBreadcrumbItem = BreadcrumbsItem
