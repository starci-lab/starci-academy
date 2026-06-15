"use client"

import React, { useMemo } from "react"
import { cn } from "@heroui/react"
import { useAppSelector } from "@/redux"
import type { WithClassNames } from "@/modules/types"
import { getContentCodeExplainings } from "@/modules/types"
import { useQueryContentSwr } from "@/hooks"
import { CodeBodySkeleton } from "../CodeBodySkeleton"
import { ExplainingCard } from "./ExplainingCard"
import { CodeExplainingEmpty } from "./Empty"

export type CodeExplainingBodyProps = WithClassNames<undefined>

/**
 * Tab body: critical code snippets with explanations (`content.codeExplainings`).
 * @param props.className - Optional wrapper class.
 */
export const CodeExplainingBody = ({ className }: CodeExplainingBodyProps) => {
    const queryContentSwr = useQueryContentSwr()
    const content = useAppSelector((state) => state.content.entity)

    const items = useMemo(
        () => getContentCodeExplainings(content)
            .slice()
            .sort((prev, next) => prev.sortIndex - next.sortIndex),
        [content],
    )

    // loading gate: render content only when the content query has settled with
    // data and no error; otherwise show the code-shaped skeleton.
    const ready = !queryContentSwr.isLoading
        && !!queryContentSwr.data
        && !queryContentSwr.error

    if (!ready) {
        return <CodeBodySkeleton className={className} />
    }

    if (!items.length) {
        return (
            <div className={cn("", className)}>
                <CodeExplainingEmpty />
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            {items.map((item) => (
                <ExplainingCard key={item.id} item={item} />
            ))}
        </div>
    )
}
