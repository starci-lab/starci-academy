"use client"

import React from "react"
import {
    Separator,
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    RocketIcon,
} from "@phosphor-icons/react"
import {
    useQueryUserCapstoneProgressSwr,
    useQueryUserProfileSwr,
} from "@/hooks"
import {
    AsyncContent,
    LabeledCard,
    Skeleton,
} from "@/components/blocks"
import {
    useProfileUsername,
} from "../../hooks/useProfileUsername"
import {
    ProjectCard,
} from "./ProjectCard"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link ProfileCapstone}. */
export type ProfileCapstoneProps = WithClassNames<undefined>

/**
 * Projects tab — the profile owner's verified capstone work, framed as
 * "project = one narrative showcase per course". Each personal-project capstone
 * course is one compact {@link ProjectCard} ROW inside a single
 * {@link LabeledCard} (label outside, content in one card — no nested card-in-card),
 * separated by dividers. Self-contained container: reads username → entity id,
 * then drives its own projection-backed SWR.
 *
 * @param props - optional className (placement only).
 */
export const ProfileCapstone = ({
    className,
}: ProfileCapstoneProps) => {
    const t = useTranslations()
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const {
        data: projectsData,
        isLoading,
        error: projectsError,
        mutate: reloadProjects,
    } = useQueryUserCapstoneProgressSwr(userId)

    const projects = projectsData ?? []

    // resolved-empty + no error → hide the whole section (sparse profiles stay clean).
    if (projectsData && projects.length === 0 && !projectsError) {
        return null
    }

    return (
        <LabeledCard
            className={cn(className)}
            label={t("publicProfile.capstone.projectsHeading")}
            icon={<RocketIcon aria-hidden focusable="false" className="size-5" />}
        >
            <AsyncContent
                isLoading={(isLoading || !userId) && !projectsData}
                skeleton={(
                    // mirror the real list: assume 3 capstone rows, Separator between
                    // each (like the content), each row = ProjectCard's tree
                    <div className="flex flex-col gap-6">
                        {[0, 1, 2].map((row) => (
                            <React.Fragment key={row}>
                                {row > 0 ? <Separator /> : null}
                                <div className="flex flex-col gap-3">
                                    {/* glance row: icon tile + (title+chip+%) + bar + summary */}
                                    <div className="flex items-start gap-3">
                                        <Skeleton className="size-12 shrink-0 rounded-xl" />
                                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                                            {/* title + verified chip + percent */}
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex min-w-0 flex-1 items-center gap-2">
                                                    <Skeleton.Typography type="body-sm" width="1/2" />
                                                    <Skeleton.Chip />
                                                </div>
                                                <Skeleton className="h-3 w-8 shrink-0 rounded" />
                                            </div>
                                            {/* verified-progress bar (SegmentBar, legend hidden) */}
                                            <Skeleton.ProgressBar />
                                            {/* roadmap summary line */}
                                            <Skeleton.Typography type="body-xs" width="2/3" />
                                        </div>
                                    </div>
                                    {/* "Xem milestone & task" disclosure Link */}
                                    <Skeleton.Typography type="body-sm" width="1/3" />
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                )}
                isEmpty={projects.length === 0}
                error={projectsError}
                errorContent={{
                    title: t("publicProfile.capstone.loadErrorTitle"),
                    description: t("publicProfile.capstone.loadErrorDescription"),
                    onRetry: () => {
                        void reloadProjects()
                    },
                    retryLabel: t("publicProfile.capstone.loadErrorRetry"),
                }}
            >
                <div className="flex flex-col gap-6">
                    {projects.map((project, index) => (
                        <React.Fragment key={project.courseGlobalId}>
                            {index > 0 ? <Separator /> : null}
                            <ProjectCard project={project} />
                        </React.Fragment>
                    ))}
                </div>
            </AsyncContent>
        </LabeledCard>
    )
}
