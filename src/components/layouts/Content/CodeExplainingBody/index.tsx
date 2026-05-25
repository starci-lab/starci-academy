"use client"

import React, { useMemo } from "react"
import { cn } from "@heroui/react"
import { useAppSelector } from "@/redux"
import type { WithClassNames } from "@/modules/types"
import { getContentCodeExplainings } from "@/modules/types"
import { useQueryContentSwr } from "@/hooks/singleton"
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
            .sort((prev, next) => prev.orderIndex - next.orderIndex),
        [content],
    )

    if (queryContentSwr.isLoading) {
        return <div className={cn("animate-pulse h-24 rounded-xl bg-default-100", className)} />
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
