"use client"

import React, {
    useMemo,
} from "react"
import {
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    EntityToken,
} from "../EntityToken"
import {
    formatDateTime,
} from "@/modules/dayjs"
import {
    ActivityType,
} from "@/modules/api"
import type {
    QueryMyFeedItemData,
} from "@/modules/api"
import {
    UserAvatar,
} from "@/components/reuseable/UserAvatar"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/**
 * One rendered feed row: either a single activity item, or a roll-up of several
 * consecutive milestone-task passes by the same actor (so a capstone grind shows
 * as "completed N milestone tasks" instead of N near-identical lines).
 */
interface FeedRow {
    /** The newest item in this row (drives actor + timestamp). */
    head: QueryMyFeedItemData
    /** How many milestone passes were rolled up (1 for a normal single row). */
    count: number
}

/** Props for {@link Feed}. */
export interface FeedProps extends WithClassNames<undefined> {
    /** Activity items from followed users, most recent first. */
    items: Array<QueryMyFeedItemData>
}

/**
 * GitHub-style home feed: a stream of activity from followed users. Each line is
 * an i18n template with clickable tokens — the actor and the target — resolved to
 * a route via the index on click. Consecutive `milestonePassed` events by the same
 * actor are rolled up into a single "completed N milestone tasks" line (capstone
 * progress is incremental, so per-task lines would spam the feed); every other
 * activity type stays one line. `"use client"` for i18n + tokens.
 * @param props - the feed items to render
 */
export const Feed = ({
    items,
    className,
}: FeedProps) => {
    const t = useTranslations()
    const locale = useLocale()

    /**
     * Collapse runs of consecutive same-actor milestone passes into one row.
     * The list is newest-first, so a run is contiguous; any non-milestone item (or
     * a different actor) breaks the run.
     */
    const rows = useMemo<Array<FeedRow>>(
        () => {
            const result: Array<FeedRow> = []
            for (const item of items) {
                const previous = result[result.length - 1]
                const isMilestone = item.type === ActivityType.MilestonePassed
                // extend the previous roll-up when it's the same actor's milestone run
                if (
                    isMilestone
                    && previous
                    && previous.head.type === ActivityType.MilestonePassed
                    && previous.head.actorGlobalId === item.actorGlobalId
                ) {
                    previous.count += 1
                    continue
                }
                result.push({
                    head: item,
                    count: 1,
                })
            }
            return result
        },
        [
            items,
        ],
    )

    if (items.length === 0) {
        return (
            <div className="rounded-large bg-default/40 p-5 text-sm text-muted">
                {t("dashboard.feedEmpty")}
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col", className)}>
            {rows.map((row, index) => {
                const { head } = row
                // a multi-pass milestone run → one rolled-up, target-less line
                const grouped = head.type === ActivityType.MilestonePassed && row.count > 1
                return (
                    <div
                        key={`${head.actorGlobalId}-${head.at}-${index}`}
                        className="flex items-start gap-3 border-b border-default/40 px-1 py-3 last:border-b-0"
                    >
                        <UserAvatar
                            className="size-8 shrink-0"
                            username={head.actorUsername}
                            avatar={head.actorAvatar}
                            seed={head.actorUsername}
                        />
                        <div className="flex flex-col gap-0">
                            <span className="text-sm text-foreground">
                                {grouped ? (
                                    t.rich("dashboard.feed.milestonePassedGrouped", {
                                        count: row.count,
                                        actor: () => (
                                            <EntityToken
                                                globalId={head.actorGlobalId}
                                                label={head.actorUsername}
                                                className="inline"
                                            />
                                        ),
                                    })
                                ) : (
                                    t.rich(`dashboard.feed.${head.type}`, {
                                        actor: () => (
                                            <EntityToken
                                                globalId={head.actorGlobalId}
                                                label={head.actorUsername}
                                                className="inline"
                                            />
                                        ),
                                        target: () => (
                                            <EntityToken
                                                globalId={head.targetGlobalId}
                                                label={head.targetLabel ?? ""}
                                                className="inline"
                                            />
                                        ),
                                    })
                                )}
                            </span>
                            <span className="text-xs text-muted">
                                {formatDateTime(head.at, locale)}
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
