"use client"

import React, { useCallback } from "react"
import { Card, Link, cn } from "@heroui/react"
import type { ContentEntity, WithClassNames } from "@/modules/types"
import { useAppSelector } from "@/redux"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { pathConfig } from "@/resources/path"

/** Props for {@link ContentCard}. */
export interface ContentCardProps extends WithClassNames<undefined> {
    /** Content row rendered inside module grid. */
    content: ContentEntity
}

/**
 * Content card shown in module overview grid.
 *
 * List item: keeps its own `content` payload and self-navigates by reading
 * the course/module ids from Redux and building the route internally.
 * @param props Card props.
 */
export const ContentCard = ({ content, className }: ContentCardProps) => {
    const router = useRouter()
    const locale = useLocale()
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const moduleId = useAppSelector((state) => state.module.id)

    const onPress = useCallback(
        () => {
            router.push(
                pathConfig().locale(locale).course(courseDisplayId).learn().module(moduleId).content(content.id).build(),
            )
        },
        [router, locale, courseDisplayId, moduleId, content.id],
    )

    return (
        <Card className={cn(className)}>
            <div>
                <Link className="text-base font-semibold text-foreground" onPress={onPress}>
                    {content.title}
                </Link>
                <div className="h-1.5" />
                <div className="line-clamp-3 text-sm text-muted">{content.description}</div>
            </div>
        </Card>
    )
}
