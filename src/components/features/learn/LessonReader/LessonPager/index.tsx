"use client"

import React from "react"
import {
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    CaretLeftIcon,
    CaretRightIcon,
} from "@phosphor-icons/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    useLessonNavigation,
} from "../hooks/useLessonNavigation"
import { PressableCard } from "@/components/blocks/cards/PressableCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"

/** Props for {@link LessonPager}. */
export type LessonPagerProps = WithClassNames<undefined>

/**
 * Previous / next lesson pager shown at the foot of the reader: two navigation
 * cards that move through the course in its linear order (the prev card aligns
 * left, the next card right). Self-contained — reads the linear position from
 * {@link useLessonNavigation} and renders nothing once the outline has resolved
 * and neither neighbour exists (a skeleton mirrors the pair while it's still
 * resolving — 2026-07-12: the outline used to be indistinguishable from "no
 * neighbours" here, so the pager popped in below the already-rendered lesson
 * body instead of being covered by any loading state).
 *
 * @param props - {@link LessonPager}
 */
export const LessonPager = ({ className }: LessonPagerProps) => {
    const t = useTranslations()
    const { previous, next, isLoading } = useLessonNavigation()

    if (isLoading) {
        return (
            <div className={className}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-3xl bg-surface px-4 py-3">
                        <Skeleton className="size-5 shrink-0 rounded" />
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <Skeleton.Typography type="body-xs" width="1/3" />
                            <Skeleton.Typography type="body-sm" width="3/4" />
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 rounded-3xl bg-surface px-4 py-3">
                        <div className="flex min-w-0 flex-1 flex-col items-end gap-1">
                            <Skeleton.Typography type="body-xs" width="1/3" />
                            <Skeleton.Typography type="body-sm" width="3/4" />
                        </div>
                        <Skeleton className="size-5 shrink-0 rounded" />
                    </div>
                </div>
            </div>
        )
    }

    if (!previous && !next) {
        return null
    }

    return (
        <div className={className}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* previous — left aligned; empty cell keeps next pinned right */}
                {previous ? (
                    <PressableCard href={previous.href}>
                        <div className="flex items-center gap-2">
                            <CaretLeftIcon aria-hidden focusable="false" className="size-5 shrink-0 text-muted" />
                            <div className="flex min-w-0 flex-col gap-0">
                                <Typography type="body-xs" color="muted">
                                    {t("content.prevLesson")}
                                </Typography>
                                <Typography type="body-sm" weight="medium" className="line-clamp-2">
                                    {previous.title}
                                </Typography>
                            </div>
                        </div>
                    </PressableCard>
                ) : (
                    <div />
                )}

                {/* next — right aligned */}
                {next ? (
                    <PressableCard href={next.href} className="col-start-2">
                        <div className="flex items-center justify-end gap-2">
                            <div className="flex min-w-0 flex-col gap-0">
                                <Typography type="body-xs" color="muted" align="end">
                                    {t("content.nextLesson")}
                                </Typography>
                                <Typography type="body-sm" weight="medium" align="end" className="line-clamp-2">
                                    {next.title}
                                </Typography>
                            </div>
                            <CaretRightIcon aria-hidden focusable="false" className="size-5 shrink-0 text-muted" />
                        </div>
                    </PressableCard>
                ) : null}
            </div>
        </div>
    )
}
