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
    useQueryUserCodingProgressSwr,
    useQueryUserProfileSwr,
} from "@/hooks"
import {
    useProfileUsername,
} from "../useProfileUsername"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link ProfileCoding}. */
export type ProfileCodingProps = WithClassNames<undefined>

/**
 * Coding tab of the public profile — the profile owner's coding-practice status:
 * problems solved, problems attempted, and total coding points. Self-contained
 * container: reads the username from the route, resolves it to the entity id, and
 * drives its own SWR. A locked profile is withheld server-side (the query 403s),
 * but the tab is only reachable on an unlocked / own profile.
 *
 * @param props - optional className for the root element.
 */
export const ProfileCoding = ({
    className,
}: ProfileCodingProps) => {
    const t = useTranslations()
    // route carries the username; resolve to the entity id the query keys off
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const {
        data,
        isLoading,
    } = useQueryUserCodingProgressSwr(userId)

    // first load in flight (username not yet resolved, or query running) → spinner
    if (!data && (isLoading || !userId)) {
        return (
            <div className="flex justify-center p-12">
                <Spinner size="lg" />
            </div>
        )
    }

    // null data (no coding activity yet) → treat every metric as zero
    const stats = [
        {
            key: "solved",
            value: data?.solvedProblemIds.length ?? 0,
        },
        {
            key: "attempted",
            value: data?.attemptedProblemIds.length ?? 0,
        },
        {
            key: "points",
            value: data?.totalPoints ?? 0,
        },
    ]

    return (
        <div className={cn("grid grid-cols-3 gap-3", className)}>
            {stats.map((stat) => (
                <div
                    key={stat.key}
                    className="flex flex-col gap-0 rounded-large border border-default/40 p-4"
                >
                    <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                    <span className="text-xs text-muted">{t(`publicProfile.coding.${stat.key}`)}</span>
                </div>
            ))}
        </div>
    )
}
