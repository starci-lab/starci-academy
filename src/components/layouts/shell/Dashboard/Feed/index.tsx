"use client"

import React from "react"
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
import type {
    QueryMyFeedItemData,
} from "@/modules/api"
import {
    UserAvatar,
} from "@/components/reuseable/UserAvatar"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link Feed}. */
export interface FeedProps extends WithClassNames<undefined> {
    /** Activity items from followed users, most recent first. */
    items: Array<QueryMyFeedItemData>
}

/**
 * GitHub-style home feed: a stream of activity from followed users. Each line is
 * an i18n template with two clickable tokens — the actor and the target — both
 * resolved to a route via the index on click. `"use client"` for i18n + tokens.
 * @param props - the feed items to render
 */
export const Feed = ({
    items,
    className,
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
        <div className={cn("flex flex-col", className)}>
            {items.map((item, index) => (
                <div
                    key={`${item.actorGlobalId}-${item.at}-${index}`}
                    className="flex items-start gap-3 border-b border-default/40 px-1 py-3 last:border-b-0"
                >
                    <UserAvatar
                        className="size-8 shrink-0"
                        username={item.actorUsername}
                        avatar={item.actorAvatar}
                        seed={item.actorUsername}
                    />
                    <div className="flex flex-col gap-0">
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
