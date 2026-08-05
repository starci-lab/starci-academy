"use client"

import React, { useMemo } from "react"
import { CodeBodySkeleton } from "../CodeBodySkeleton"
import { ImplementationCard } from "./ImplementationCard"
import { Empty } from "./Empty"
import { useAppSelector } from "@/redux/hooks"
import { getContentCodeImplementations } from "@/modules/types/entities/content"
import { StackV } from "@/components/frames/Stack"
import { useQueryContentSwr } from "@/hooks/swr/api/graphql/queries/useQueryContentSwr"

/**
 * Tab body: per-language implementation guides (`content.codeImplementations`).
 *
 * First load, nothing in hand → the code-shaped placeholder shimmers in the SAME
 * position the real cards occupy (`loading-and-skeleton.md`), not through a separate
 * loading branch handed to a wrapper.
 */
export const CodeImplementationBody = () => {
    const queryContentSwr = useQueryContentSwr()
    const content = useAppSelector((state) => state.content.entity)

    const items = useMemo(
        () => getContentCodeImplementations(content)
            .slice()
            .sort((prev, next) => prev.sortIndex - next.sortIndex),
        [content],
    )

    // Content is ready only once the query has settled WITH data and no error; anything
    // else is still the first load.
    const isSkeleton = queryContentSwr.isLoading
        || !queryContentSwr.data
        || !!queryContentSwr.error
    if (isSkeleton) {
        return <CodeBodySkeleton />
    }
    if (!items.length) {
        return <Empty />
    }

    return (
        <StackV
            identity={{ tier: "block", component: "CodeImplementationBody" }}
            gap={6}
            items={items.map((item) => () => (
                <ImplementationCard key={item.id} item={item} />
            ))}
        />
    )
}
