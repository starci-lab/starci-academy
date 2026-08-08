"use client"

import React, {
    useCallback,
    useState,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    queryResolveRoute,
} from "@/modules/api/graphql/queries/query-resolve-route"
import {
    type SurfaceCardListItem,
} from "@/components/composites/cards/SurfaceCard"
import { useQueryTrendingContentsSwr } from "@/hooks/swr/api/graphql/queries/useQueryTrendingContentsSwr"
import {
    _TrendingContents,
} from "./component"

/** Number of placeholder rows while the trending list first loads (mirrors resolver DEFAULT_LIMIT). */
const SKELETON_ROW_COUNT = 6

/** Props for {@link TrendingContents}. */
export type TrendingContentsProps = Record<string, never>

/**
 * "Trending this week" discovery card — connected half: leaf query, label, and
 * resolve-and-navigate. Builds {@link SurfaceCardListItem} rows once here so the
 * presentational half can mount a single {@link import("@/components/composites/cards/SurfaceCard").SurfaceCardList}
 * with no intermediate host. See `tiers/split.md`.
 *
 * @param props - empty; layout container owns its leaf fetch.
 */
export const TrendingContents = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { data, error } = useQueryTrendingContentsSwr()
    const [pendingId, setPendingId] = useState<string | null>(null)

    const isSkeleton = !data && !error
    const isEmpty = !data || data.length === 0

    const resolvePress = useCallback(
        async (globalId: string) => {
            if (pendingId === globalId) {
                return
            }
            setPendingId(globalId)
            try {
                const response = await queryResolveRoute({
                    request: {
                        globalId,
                    },
                })
                const path = response.data?.resolveRoute?.data?.path
                if (path) {
                    router.push(`/${locale}${path}`)
                }
            } finally {
                setPendingId((current) => (current === globalId ? null : current))
            }
        },
        [
            pendingId,
            locale,
            router,
        ],
    )

    const items: Array<SurfaceCardListItem> = isSkeleton
        ? Array.from(
            {
                length: SKELETON_ROW_COUNT,
            },
            (_unused, index) => ({
                key: `skeleton-${index}`,
                title: "Loading",
                leading: () => <span aria-hidden className="w-5 shrink-0" />,
            }),
        )
        : (data ?? []).map((item, index) => {
            const rank = index + 1
            const rankClassName = rank <= 3
                ? "w-5 shrink-0 text-center text-sm font-medium tabular-nums text-accent-soft-foreground"
                : "w-5 shrink-0 text-center text-sm font-medium tabular-nums text-muted"
            return {
                key: item.globalId,
                title: item.title,
                hover: "underline" as const,
                onPress: () => {
                    void resolvePress(item.globalId)
                },
                isDisabled: pendingId === item.globalId,
                leading: () => (
                    <span aria-hidden className={rankClassName}>
                        {rank}
                    </span>
                ),
            }
        })

    return (
        <_TrendingContents
            isSkeleton={isSkeleton}
            isEmpty={isEmpty}
            items={items}
            label={t("DashboardPage.trending.title")}
        />
    )
}
