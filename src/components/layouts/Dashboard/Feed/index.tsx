"use client"

import React from "react"
import {
    Avatar,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    EntityToken,
} from "../EntityToken"
import type {
    QueryMyDashboardFeedItemData,
} from "@/modules/api"
import {
    resolveUserAvatarUrl,
} from "@/utils"

/** Props for {@link Feed}. */
export interface FeedProps {
    /** Activity items from followed users, most recent first. */
    items: Array<QueryMyDashboardFeedItemData>
}

/**
 * GitHub-style home feed: a stream of activity from followed users. Each line is
 * an i18n template with two clickable tokens — the actor and the target — both
 * resolved to a route via the index on click. `"use client"` for i18n + tokens.
 * @param props - the feed items to render
 */
export const Feed = ({
    items,
}: FeedProps) => {
    const t = useTranslations()
    const locale = useLocale()

    if (items.length === 0) {
        return (
            <div className="rounded-large bg-default/40 p-5 text-sm text-muted">
                {t("dashboard.feedEmpty")}
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            {items.map((item, index) => (
                <div
                    key={`${item.actorGlobalId}-${item.at}-${index}`}
                    className="flex items-start gap-3 border-b border-default/40 px-1 py-3 last:border-b-0"
                >
                    <Avatar className="size-8 shrink-0">
                        <Avatar.Image
                            src={resolveUserAvatarUrl(item.actorAvatar, item.actorUsername)}
                            alt={item.actorUsername}
                        />
                        <Avatar.Fallback>
                            {item.actorUsername[0]?.toUpperCase() ?? "?"}
                        </Avatar.Fallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <span className="text-sm text-foreground">
                            {t.rich(`dashboard.feed.${item.type}`, {
                                actor: () => (
                                    <EntityToken
                                        globalId={item.actorGlobalId}
                                        label={item.actorUsername}
                                    />
                                ),
                                target: () => (
                                    <EntityToken
                                        globalId={item.targetGlobalId}
                                        label={item.targetLabel ?? ""}
                                    />
                                ),
                            })}
                        </span>
                        <span className="text-xs text-muted">
                            {new Date(item.at).toLocaleDateString(locale)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    )
}
