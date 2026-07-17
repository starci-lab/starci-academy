"use client"

import React from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { cn, ListBox, Typography } from "@heroui/react"
import { FlameIcon } from "@phosphor-icons/react"
import { pathConfig } from "@/resources/path"
import { useQueryRecommendedCoursesSwr } from "@/hooks/swr/api/graphql/queries/useQueryRecommendedCoursesSwr"
import { useSearchOverlayState } from "@/hooks/zustand/overlay/hooks"
import { WithClassNames } from "@/modules/types/base/class-name"
import { PriceTag } from "@/components/blocks/commerce/PriceTag"

/** Props for {@link GlobalSearchEmpty}. */
export interface GlobalSearchEmptyProps extends WithClassNames<undefined> {
    /** Whether the user has typed a (trimmed) query yet — switches idle hint vs no-match copy. */
    hasQuery: boolean
}

/**
 * Empty state for the global search palette.
 *
 * - Query typed, no hits → a "no matches" message.
 * - Idle (blank query) → popular courses (the viewer's recommendations, already priced
 *   with their loyalty discount) as quick links, so the palette is never a dead blank.
 *
 * @param props.hasQuery — `true` when a non-empty query is active.
 */
export const GlobalSearchEmpty = ({ hasQuery, className }: GlobalSearchEmptyProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { setOpen } = useSearchOverlayState()
    const { data } = useQueryRecommendedCoursesSwr()
    const popular = (data?.items ?? []).slice(0, 4)

    // No popular courses to fall back on → just the appropriate hint line (never a blank).
    if (popular.length === 0) {
        return (
            <div className={cn("flex flex-col items-center justify-center px-4 py-9 text-center", className)}>
                <Typography type="body-sm" color="muted">{t(hasQuery ? "search.noResults" : "search.idleHint")}</Typography>
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-2 px-2", className)}>
            {/* query typed but no hits → keep the "not found" line, then fall through to Popular
                so the palette is never a dead-end */}
            {hasQuery ? (
                <div className="px-2 pb-1 text-xs text-muted">{t("search.noResults")}</div>
            ) : null}
            <div className="px-2 text-xs font-medium text-muted">{t("search.popular")}</div>
            <ListBox aria-label={t("search.popular")} className="gap-0">
                {popular.map((course) => (
                    <ListBox.Item
                        key={course.displayId}
                        id={course.displayId}
                        textValue={course.title}
                        className="group rounded-lg py-1 data-[pressed=true]:bg-default"
                        onAction={() => {
                            router.push(pathConfig().locale(locale).course(course.displayId).build())
                            setOpen(false)
                        }}
                    >
                        <div className="flex items-center gap-2 py-1">
                            <FlameIcon aria-hidden focusable="false" className="size-4 shrink-0 text-muted" />
                            <Typography
                                type="body-sm"
                                truncate
                                className="flex-1 underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline"
                            >
                                {course.title}
                            </Typography>
                            <PriceTag discounted={course.discountedPriceVnd} size="sm" className="shrink-0" />
                        </div>
                    </ListBox.Item>
                ))}
            </ListBox>
        </div>
    )
}
