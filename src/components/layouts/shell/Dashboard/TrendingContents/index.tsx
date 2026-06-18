"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    Flame as FlameIcon,
} from "@gravity-ui/icons"
import {
    useQueryTrendingContentsSwr,
} from "@/hooks"
import {
    EntityToken,
} from "../EntityToken"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link TrendingContents}. */
export type TrendingContentsProps = WithClassNames<undefined>

/**
 * "Trending this week" discovery card for the explore feed — the lessons read
 * most across the platform in the last 7 days, as clickable route tokens. Turns
 * the explore tab from a social stream into "find something to learn".
 * Self-fetches its own leaf query (layout container — no data props); hides itself
 * when there's nothing trending yet.
 * @param props - optional className for the root element.
 */
export const TrendingContents = ({
    className,
}: TrendingContentsProps) => {
    const t = useTranslations()
    const { data } = useQueryTrendingContentsSwr()

    // nothing read this week → hide the card entirely
    if (!data || data.length === 0) {
        return null
    }

    return (
        <div className={cn("flex flex-col gap-3 rounded-large bg-default/40 p-3",
            className)}
        >
            <div className="flex items-center gap-1.5">
                <FlameIcon className="h-4 w-4 shrink-0 text-accent" />
                <span className="text-base font-semibold text-foreground">
                    {t("dashboard.trending.title")}
                </span>
            </div>
            <div className="flex flex-col gap-1.5">
                {data.map((item) => (
                    <div
                        key={item.globalId}
                        className="flex min-w-0 items-center justify-between gap-3"
                    >
                        <EntityToken
                            block
                            globalId={item.globalId}
                            label={item.title}
                            className="min-w-0 flex-1"
                        />
                        <span className="shrink-0 text-xs text-muted">
                            {t("dashboard.trending.reads",
                                {
                                    count: item.readCount,
                                })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
