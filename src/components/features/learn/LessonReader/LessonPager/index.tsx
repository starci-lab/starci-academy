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
import { GroupPressableCard } from "@/components/blocks/cards/GroupPressableCard"
import type { GroupPressableCardItem } from "@/components/blocks/cards/GroupPressableCard"
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
                {/*
                  Mirrors the resolved pager below, which reflows on its CONTAINER
                  (`GroupPressableCard columns={{base:1, sm:2}}`). The skeleton must
                  split on the SAME axis at the SAME step — a viewport `sm:` here
                  would show one column while the real pair renders two (or vice
                  versa in a narrow slot), i.e. a jump at exactly the moment the
                  skeleton is supposed to prevent one.
                */}
                <div className="@container">
                    <div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
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
            </div>
        )
    }

    if (!previous && !next) {
        return null
    }

    const items: Array<GroupPressableCardItem> = []
    if (previous) {
        items.push({
            key: "previous",
            href: previous.href,
            content: (
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
            ),
        })
    }
    if (next) {
        items.push({
            key: "next",
            href: next.href,
            // Pin right exactly where the grid actually HAS two columns, so this
            // must be scoped on the SAME axis the group splits on — a CONTAINER
            // query (`@sm`), not the viewport (`sm`). Unqualified `col-start-2`
            // would also apply at the 1-column step, forcing an implicit second
            // column that content-sizes down to ~30px and drags this card up beside
            // the previous one; viewport-scoped `sm:` would miss in both directions
            // (narrow slot in a wide window still splits, and vice versa).
            className: "@sm:col-start-2",
            content: (
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
            ),
        })
    }

    return (
        <div className={className}>
            <GroupPressableCard
                ariaLabel={t("content.pagerAria")}
                columns={{ base: 1, sm: 2 }}
                items={items}
            />
        </div>
    )
}
