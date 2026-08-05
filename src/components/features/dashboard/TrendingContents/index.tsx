"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    _TrendingContents,
} from "./component"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useQueryTrendingContentsSwr } from "@/hooks/swr/api/graphql/queries/useQueryTrendingContentsSwr"

/** Props for {@link TrendingContents}. */
export type TrendingContentsProps = WithClassNames<undefined>

/**
 * "Trending this week" discovery card for the explore feed — the CONNECTED half: it
 * self-fetches its own leaf query (layout container — no data props), computes the
 * first-load skeleton flag and the settled-empty flag, resolves the card label, and
 * hands them to the presentational {@link import("./component")._TrendingContents}.
 * Turns the explore tab from a social stream into "find something to learn". See
 * `tiers/split.md`.
 *
 * @param props - optional className for the root element.
 */
export const TrendingContents = ({
    className,
}: TrendingContentsProps) => {
    const t = useTranslations()
    const { data, error } = useQueryTrendingContentsSwr()

    return (
        <_TrendingContents
            className={className}
            // first load, nothing in hand → shimmer; settled (data OR error) stops it (loading-and-skeleton.md)
            isSkeleton={!data && !error}
            // settled with nothing to show — an empty list or a settled fetch error both fold into
            // the same "hide the card" branch (unchanged from the legacy no-emptyContent/errorContent path)
            isEmpty={!data || data.length === 0}
            items={(data ?? []).map((item) => ({ globalId: item.globalId, title: item.title }))}
            label={t("dashboard.trending.title")}
        />
    )
}
