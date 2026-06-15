"use client"

import React from "react"
import {
    cn,
    Spinner,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useQueryUserCapstoneTasksSwr,
    useQueryUserProfileSwr,
} from "@/hooks"
import {
    EntityToken,
} from "@/components/layouts/shell/Dashboard/EntityToken"
import {
    useProfileUsername,
} from "../useProfileUsername"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link ProfileCapstone}. */
export type ProfileCapstoneProps = WithClassNames<undefined>

/**
 * Capstone / projects tab — the profile owner's passed personal-project milestone
 * tasks across courses (a verified portfolio). Self-contained container: reads the
 * username from the route, resolves it to the entity id, drives its own SWR.
 *
 * @param props - optional className for the root element.
 */
export const ProfileCapstone = ({
    className,
}: ProfileCapstoneProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const {
        data,
        isLoading,
    } = useQueryUserCapstoneTasksSwr(userId)

    // first load in flight (username not yet resolved, or query running) → spinner
    if (!data && (isLoading || !userId)) {
        return (
            <div className="flex justify-center p-12">
                <Spinner size="lg" />
            </div>
        )
    }

    // no passed capstone tasks → empty state
    if (!data || data.length === 0) {
        return (
            <div className="rounded-large bg-default/40 p-6 text-center text-sm text-muted">
                {t("publicProfile.capstoneEmpty")}
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            {data.map((task, index) => (
                <div
                    key={`${task.courseGlobalId}-${task.taskTitle}-${index}`}
                    className="flex flex-col gap-1.5 rounded-large border border-default/40 p-4"
                >
                    <div className="text-sm font-semibold text-foreground">
                        {task.taskTitle}
                    </div>
                    {/* clickable course token + the milestone it belongs to */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
                        <EntityToken
                            globalId={task.courseGlobalId}
                            label={task.courseTitle}
                        />
                        <span>·</span>
                        <span>{task.milestoneTitle}</span>
                    </div>
                    {/* score + passed date */}
                    <div className="flex items-center gap-3 text-xs text-muted">
                        <span>{t("publicProfile.capstone.score", { score: task.score })}</span>
                        {task.passedAt ? (
                            <span>{new Date(task.passedAt).toLocaleDateString(locale)}</span>
                        ) : null}
                    </div>
                </div>
            ))}
        </div>
    )
}
