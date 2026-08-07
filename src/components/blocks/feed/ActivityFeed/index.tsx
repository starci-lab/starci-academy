"use client"

import React, { useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import { getTimeAgoLabel, getTimeAgoMessage } from "@/modules/dayjs"
import { ActivityType } from "@/modules/api/graphql/queries/types/my-feed"
import type { QueryMyFeedItemData } from "@/modules/api/graphql/queries/types/my-feed"
import {
    _ActivityFeed,
    EntityLink,
    type ActivityFeedDayGroup,
    type ActivityFeedProps,
    type ActivityFeedRow,
} from "./component"

/** Start-of-day epoch ms for a date (local). */
const startOfDayMs = (date: Date): number =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

/** Props the connected {@link ActivityFeed} takes from its caller. */
export type ActivityFeedConnectedProps = Omit<ActivityFeedProps, "dayGroups" | "locale"> & {
    /** Activity items, newest first (already flattened across pages). */
    items: Array<QueryMyFeedItemData>
}

/**
 * The shared Facebook-style activity feed renderer — the CONNECTED half: rolls
 * up consecutive same-actor milestone passes, buckets rows by relative day, and
 * resolves every localized string (day headers, sentences, relative timestamps)
 * via `t()`/`t.rich()`. See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link ActivityFeedConnectedProps}
 */
export const ActivityFeed = ({ items, onResolve, onReact, bordered }: ActivityFeedConnectedProps) => {
    const t = useTranslations()
    const locale = useLocale()

    // roll up consecutive same-actor milestone passes, then bucket rows by day
    const dayGroups = useMemo<Array<ActivityFeedDayGroup>>(
        () => {
            type RollupRow = { head: QueryMyFeedItemData, count: number }
            const rolled: Array<RollupRow> = []
            for (const item of items) {
                const previous = rolled[rolled.length - 1]
                if (
                    item.type === ActivityType.MilestonePassed
                    && previous
                    && previous.head.type === ActivityType.MilestonePassed
                    && previous.head.actorGlobalId === item.actorGlobalId
                ) {
                    previous.count += 1
                    continue
                }
                rolled.push({ head: item, count: 1 })
            }

            const now = new Date()
            const todayMs = startOfDayMs(now)
            const dayMs = 86_400_000
            // bucket by day key into an insertion-ordered Map so a given day appears
            // exactly once even when items aren't strictly day-monotonic
            const groupByKey = new Map<string, { key: string, label: string, rows: Array<ActivityFeedRow> }>()
            for (const rolledRow of rolled) {
                const { head, count } = rolledRow
                const at = new Date(head.at)
                const dayMsValue = startOfDayMs(at)
                let label: string
                if (dayMsValue === todayMs) {
                    label = t("dashboard.feed.today")
                } else if (dayMsValue === todayMs - dayMs) {
                    label = t("dashboard.feed.yesterday")
                } else {
                    label = at.toLocaleDateString(locale, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })
                }

                const grouped = head.type === ActivityType.MilestonePassed && count > 1
                const noTarget = head.targetLabel == null
                // pick the phrasing: grouped roll-up · generic-noun fallback · normal
                const messageKey = grouped
                    ? "milestonePassedGrouped"
                    : noTarget
                        ? `${head.type}NoTarget`
                        : head.type
                const relativeLabel = getTimeAgoLabel(getTimeAgoMessage(head.at), t)
                const message = t.rich(`dashboard.feed.${messageKey}`, {
                    count,
                    actor: () => (
                        <EntityLink
                            label={head.actorUsername}
                            onPress={onResolve(head.actorGlobalId)}
                        />
                    ),
                    target: () => (
                        <EntityLink
                            label={head.targetLabel ?? ""}
                            onPress={onResolve(head.targetGlobalId)}
                        />
                    ),
                })
                const row: ActivityFeedRow = { head, count, message, relativeLabel }

                const key = String(dayMsValue)
                const existing = groupByKey.get(key)
                if (existing) {
                    existing.rows.push(row)
                } else {
                    groupByKey.set(key, { key, label, rows: [row] })
                }
            }
            return Array.from(groupByKey.values())
        },
        [items, locale, t, onResolve],
    )

    return (
        <_ActivityFeed
            dayGroups={dayGroups}
            onResolve={onResolve}
            onReact={onReact}
            bordered={bordered}
            locale={locale}
        />
    )
}

