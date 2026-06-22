"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    FlameIcon,
} from "@phosphor-icons/react"
import {
    AsyncContent,
    LabeledCard,
} from "@/components/blocks"
import {
    useQueryTrendingContentsSwr,
} from "@/hooks"
import {
    EntityToken,
} from "../EntityToken"
import {
    TrendingContentsSkeleton,
} from "./TrendingContentsSkeleton"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link TrendingContents}. */
export type TrendingContentsProps = WithClassNames<undefined>

/**
 * "Trending this week" discovery card for the explore feed — the lessons read
 * most across the platform in the last 7 days, as clickable route tokens. Turns
 * the explore tab from a social stream into "find something to learn".
 * Self-fetches its own leaf query (layout container — no data props); shows a
 * skeleton while loading, then hides itself when there's nothing trending.
 * @param props - optional className for the root element.
 */
export const TrendingContents = ({
    className,
}: TrendingContentsProps) => {
    const t = useTranslations()
    const { data, isLoading } = useQueryTrendingContentsSwr()

    return (
        // skeleton while loading; hide when nothing trends (empty / error → no
        // emptyContent/errorContent → renders null).
        <AsyncContent
            isLoading={isLoading}
            skeleton={<TrendingContentsSkeleton className={className} />}
            isEmpty={!data || data.length === 0}
        >
            <LabeledCard
                className={className}
                label={t("dashboard.trending.title")}
                icon={<FlameIcon aria-hidden focusable="false" className="size-5 text-accent" />}
            >
                <div className="flex flex-col gap-3">
                    {(data ?? []).map((item) => (
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
                                {t("dashboard.trending.reads", { count: item.readCount })}
                            </span>
                        </div>
                    ))}
                </div>
            </LabeledCard>
        </AsyncContent>
    )
}
