"use client"

import React from "react"
import {
    cn,
    Spinner,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useQueryUserCodingSkillsSwr,
    useQueryUserProfileSwr,
} from "@/hooks"
import type {
    QueryUserCodingSkillCount,
} from "@/modules/api"
import {
    useProfileUsername,
} from "../useProfileUsername"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link ProfileSkills}. */
export type ProfileSkillsProps = WithClassNames<undefined>

/** Title-case a bucket key (language / difficulty value) for display. */
const labelOf = (key: string): string => key.charAt(0).toUpperCase() + key.slice(1)

/**
 * Skills tab — the profile owner's solved-coding breakdown, rendered as two
 * groups of bars (by language, by difficulty). Self-contained container: reads
 * the username from the route, resolves it to the entity id, drives its own SWR.
 * Each bar is scaled to the max within its own group.
 *
 * @param props - optional className for the root element.
 */
export const ProfileSkills = ({
    className,
}: ProfileSkillsProps) => {
    const t = useTranslations()
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const {
        data,
        isLoading,
    } = useQueryUserCodingSkillsSwr(userId)

    // first load in flight → spinner
    if (!data && (isLoading || !userId)) {
        return (
            <div className="flex justify-center p-12">
                <Spinner size="lg" />
            </div>
        )
    }

    const byLanguage = data?.byLanguage ?? []
    const byDifficulty = data?.byDifficulty ?? []
    // no solved problems in either grouping → empty state
    if (byLanguage.length === 0 && byDifficulty.length === 0) {
        return (
            <div className="rounded-large bg-default/40 p-6 text-center text-sm text-muted">
                {t("publicProfile.skills.empty")}
            </div>
        )
    }

    /** Render one labelled group of solved-count bars (scaled to its own max). */
    const renderGroup = (title: string, items: Array<QueryUserCodingSkillCount>) => {
        // nothing in this group → skip it entirely
        if (items.length === 0) {
            return null
        }
        // scale every bar to the biggest count in the same group (min 1 to avoid /0)
        const max = Math.max(1, ...items.map((item) => item.solved))
        return (
            <div className="flex flex-col gap-3">
                <div className="text-sm font-semibold text-foreground">{title}</div>
                {items.map((item) => (
                    <div
                        key={item.key}
                        className="flex flex-col gap-1.5"
                    >
                        <div className="flex items-center justify-between gap-1.5 text-xs text-muted">
                            <span>{labelOf(item.key)}</span>
                            <span className="shrink-0">{item.solved}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-default/40">
                            <div
                                className="h-2 rounded-full bg-accent"
                                style={{ width: `${(item.solved / max) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {renderGroup(t("publicProfile.skills.byDifficulty"), byDifficulty)}
            {renderGroup(t("publicProfile.skills.byLanguage"), byLanguage)}
        </div>
    )
}
