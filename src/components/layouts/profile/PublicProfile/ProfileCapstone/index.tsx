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
    SiGithub,
} from "@icons-pack/react-simple-icons"
import {
    useQueryUserCapstoneTasksSwr,
    useQueryUserProfileSwr,
    useQueryUserSolvedChallengesSwr,
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
 * Projects tab — the profile owner's verified project work: passed personal-project
 * capstone tasks across courses, plus passed challenge submissions with the git /
 * docs link they submitted (the dev's repo "flex") and the language they chose.
 * Self-contained container: reads the username → entity id, drives its own SWR
 * (both projection-backed server-side).
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
        data: tasks,
        isLoading,
    } = useQueryUserCapstoneTasksSwr(userId)
    const { data: challenges } = useQueryUserSolvedChallengesSwr(userId)

    // first load in flight (username not yet resolved, or query running) → spinner
    if (!tasks && (isLoading || !userId)) {
        return (
            <div className="flex justify-center p-12">
                <Spinner size="lg" />
            </div>
        )
    }

    const capstoneTasks = tasks ?? []
    const solvedChallenges = challenges ?? []
    // nothing verified yet in either bucket → single empty state
    if (capstoneTasks.length === 0 && solvedChallenges.length === 0) {
        return (
            <div className="rounded-large bg-default/40 p-6 text-center text-sm text-muted">
                {t("publicProfile.capstoneEmpty")}
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {/* passed capstone (milestone) tasks */}
            {capstoneTasks.length > 0 ? (
                <div className="flex flex-col gap-3">
                    <div className="text-sm font-semibold text-foreground">
                        {t("publicProfile.capstone.tasksHeading")}
                    </div>
                    {capstoneTasks.map((task, index) => (
                        <div
                            key={`${task.courseGlobalId}-${task.taskTitle}-${index}`}
                            className="flex flex-col gap-1.5 rounded-large border border-default/40 p-4"
                        >
                            <div className="text-sm font-semibold text-foreground">
                                {task.taskTitle}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
                                <EntityToken
                                    globalId={task.courseGlobalId}
                                    label={task.courseTitle}
                                />
                                <span>·</span>
                                <span>{task.milestoneTitle}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted">
                                <span>{t("publicProfile.capstone.score", { score: task.score })}</span>
                                {task.passedAt ? (
                                    <span>{new Date(task.passedAt).toLocaleDateString(locale)}</span>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}

            {/* passed challenge submissions with their git / docs link */}
            {solvedChallenges.length > 0 ? (
                <div className="flex flex-col gap-3">
                    <div className="text-sm font-semibold text-foreground">
                        {t("publicProfile.capstone.challengesHeading")}
                    </div>
                    {solvedChallenges.map((challenge, index) => (
                        <a
                            key={`${challenge.submissionUrl}-${index}`}
                            href={challenge.submissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-3 rounded-large border border-default/40 p-4 outline-none hover:border-default focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <SiGithub className="size-5 shrink-0 text-muted" />
                                <div className="flex min-w-0 flex-col gap-0">
                                    <span className="truncate text-sm font-medium text-foreground">{challenge.title}</span>
                                    <span className="truncate text-xs text-muted">{challenge.submissionUrl}</span>
                                </div>
                            </div>
                            {challenge.selectedLang ? (
                                <span className="shrink-0 rounded-medium bg-default/40 px-1.5 py-0.5 text-[11px] text-foreground">
                                    {challenge.selectedLang}
                                </span>
                            ) : null}
                        </a>
                    ))}
                </div>
            ) : null}
        </div>
    )
}
