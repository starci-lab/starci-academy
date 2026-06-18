"use client"

import React, { useCallback } from "react"
import {
    Typography,
} from "@heroui/react"
import {
    useRouter,
} from "next/navigation"
import {
    useLocale,
} from "next-intl"
import type {
    ContentEntity,
    WithClassNames,
} from "@/modules/types"
import {
    useAppSelector,
} from "@/redux"
import {
    PressableCard,
} from "@/components/blocks"
import {
    pathConfig,
} from "@/resources/path"

/** Props for {@link ContentCard}. */
export interface ContentCardProps extends WithClassNames<undefined> {
    /** Content row rendered inside the module overview grid. */
    content: ContentEntity
}

/**
 * Content card shown in the module overview grid.
 *
 * List item: keeps its own `content` payload and self-navigates by reading the
 * course/module ids from Redux and building the route internally.
 *
 * @param props - {@link ContentCardProps}
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
        <PressableCard className={className} onPress={onPress}>
            <div className="flex flex-col gap-2">
                <Typography type="body" weight="semibold">
                    {content.title}
                </Typography>
                <Typography type="body-sm" color="muted" className="line-clamp-3">
                    {content.description}
                </Typography>
            </div>
        </PressableCard>
    )
}
