"use client"

import React, { useMemo } from "react"
import { CodeBodySkeleton } from "../CodeBodySkeleton"
import { ExplainingCard } from "./ExplainingCard"
import { Empty } from "./Empty"
import { useAppSelector } from "@/redux/hooks"
import { getContentCodeExplainings } from "@/modules/types/entities/content"
import { StackV } from "@/components/frames/Stack"
import { useQueryContentSwr } from "@/hooks/swr/api/graphql/queries/useQueryContentSwr"

/**
 * Tab body: critical code snippets with explanations (`content.codeExplainings`).
 *
 * First load, nothing in hand → the code-shaped placeholder shimmers in the SAME
 * position the real cards occupy (`loading-and-skeleton.md`), not through a separate
 * loading branch handed to a wrapper.
 */
export const CodeExplainingBody = () => {
    const queryContentSwr = useQueryContentSwr()
    const content = useAppSelector((state) => state.content.entity)

    const items = useMemo(
        () => getContentCodeExplainings(content)
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
            identity={{ tier: "block", component: "CodeExplainingBody" }}
            gap={6}
            items={items.map((item) => () => (
                <ExplainingCard key={item.id} item={item} />
            ))}
        />
    )
}
