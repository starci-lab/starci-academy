"use client"

import React from "react"
import { cn } from "@heroui/react"
import { useAppSelector } from "@/redux"
import { useQueryPublicContentSwr } from "@/hooks"
import type { WithClassNames } from "@/modules/types/base/class-name"
import {
    ContentDetailSkeleton,
} from "./ContentDetailSkeleton"
import {
    ContentDetailError,
} from "./ContentDetailError"
import {
    ContentDetailHeader,
} from "./ContentDetailHeader"
import {
    ContentDetailBody,
} from "./ContentDetailBody"

/** Props for {@link ContentDetail}. */
export type ContentDetailProps = WithClassNames<undefined>

/**
 * Public content article container for `/[locale]/contents/[contentId]`.
 *
 * Owns only the load / error / loaded branch (SWR + redux snapshot), then
 * delegates each state to its child. The loaded sections (`ContentDetailHeader`,
 * `ContentDetailBody`) are self-contained and read the `publicContent` slice
 * themselves, so this container composes them with no props. The `[contentId]`
 * route param is synced into redux globally. `"use client"` for the SWR + redux
 * hooks.
 * @param props - {@link ContentDetailProps}
 */
export const ContentDetail = ({ className }: ContentDetailProps) => {
    const queryPublicContentSwr = useQueryPublicContentSwr()
    const content = useAppSelector((state) => state.publicContent.entity)

    const isLoading = queryPublicContentSwr.isLoading || !content
    const error = queryPublicContentSwr.error

    if (isLoading) {
        return <ContentDetailSkeleton />
    }

    if (error || !content) {
        return <ContentDetailError message={error?.message} />
    }

    return (
        <div className={cn("mx-auto max-w-4xl p-6", className)}>
            <ContentDetailHeader />

            <ContentDetailBody />
        </div>
    )
}
