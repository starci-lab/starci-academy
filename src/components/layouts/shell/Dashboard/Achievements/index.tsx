"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    Medal as MedalIcon,
} from "@gravity-ui/icons"
import {
    useQueryMyAchievementsSwr,
} from "@/hooks"
import {
    BadgeImage,
} from "@/components/reuseable/BadgeImage"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link Achievements}. */
export type AchievementsProps = WithClassNames<undefined>

/**
 * GitHub-style achievements row — every badge with the viewer's earned status +
 * progress. Earned badges show in full colour; locked ones are dimmed with their
 * progress toward the next bar. Self-fetches its own leaf query (layout container,
 * no data props); the backend awards-on-read so opening this grants any newly
 * qualified badge. Badge art comes from MinIO (`iconKey`), falling back to a medal
 * placeholder until uploaded.
 * @param props - optional className for the root element.
 */
export const Achievements = ({
    className,
}: AchievementsProps) => {
    const t = useTranslations()
    const { data } = useQueryMyAchievementsSwr()

    // nothing to show until definitions are seeded
    if (!data || data.length === 0) {
        return null
    }

    return (
        <div className={cn("flex flex-col gap-3",
            className)}
        >
            <div className="text-base font-semibold text-foreground">
                {t("dashboard.achievements.title")}
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-3">
                {data.map((item) => (
                    <div
                        key={item.slug}
                        title={`${item.name} — ${item.description}`}
                        className="flex flex-col items-center gap-1.5 text-center"
                    >
                        {/* badge art (MinIO) → medal placeholder; dimmed when locked */}
                        <BadgeImage
                            objectKey={item.iconKey}
                            size={44}
                            alt={item.name}
                            className={cn(!item.earned && "opacity-40 grayscale")}
                            fallback={(
                                <MedalIcon
                                    width={44}
                                    height={44}
                                    className={cn(
                                        item.earned ? "text-warning" : "text-default-400",
                                    )}
                                />
                            )}
                        />
                        <div className="text-[11px] leading-tight text-foreground line-clamp-2">
                            {item.name}
                        </div>
                        {/* earned → tier badge / done; locked → progress toward the bar */}
                        <div className="text-[10px] text-muted">
                            {item.earned
                                ? (item.tierReached
                                    ? `×${item.tierReached}`
                                    : t("dashboard.achievements.earned"))
                                : `${item.currentValue}/${item.threshold}`}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
