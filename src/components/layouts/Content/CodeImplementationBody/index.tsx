"use client"

import React, { useMemo } from "react"
import { cn } from "@heroui/react"
import { useAppSelector } from "@/redux"
import type { WithClassNames } from "@/modules/types"
import { getContentCodeImplementations } from "@/modules/types"
import { useQueryContentSwr } from "@/hooks"
import { CodeBodySkeleton } from "../CodeBodySkeleton"
import { ImplementationCard } from "./ImplementationCard"
import { CodeImplementationEmpty } from "./Empty"

export type CodeImplementationBodyProps = WithClassNames<undefined>

/**
 * Tab body: per-language implementation guides (`content.codeImplementations`).
 * @param props.className - Optional wrapper class.
 */
export const CodeImplementationBody = ({ className }: CodeImplementationBodyProps) => {
    const queryContentSwr = useQueryContentSwr()
    const content = useAppSelector((state) => state.content.entity)

    const items = useMemo(
        () => getContentCodeImplementations(content)
            .slice()
            .sort((prev, next) => prev.orderIndex - next.orderIndex),
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
                <CodeImplementationEmpty />
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            {items.map((item) => (
                <ImplementationCard key={item.id} item={item} />
            ))}
        </div>
    )
}
