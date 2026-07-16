"use client"

import React, {
    useMemo,
} from "react"
import {
    Typography,
    cn,
} from "@heroui/react"
import {
    useParams,
    useRouter,
} from "next/navigation"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    CheckCircleIcon,
    CircleIcon,
    RocketIcon,
    SealCheckIcon,
} from "@phosphor-icons/react"
import {
    useProfileUsername,
} from "../../hooks/useProfileUsername"
import { pathConfig } from "@/resources/path"
import { useQueryUserCapstoneProgressSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserCapstoneProgressSwr"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { SegmentBar } from "@/components/blocks/stats/SegmentBar"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { StatusChip } from "@/components/blocks/chips/StatusChip"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Score → attention colour the eye catches fast: high green, mid yellow, low red.
 * @param score - the graded score (0–100).
 * @returns a `text-{token}` class for the score label.
 */
const scoreToneClass = (score: number): string => {
    if (score >= 90) {
        return "text-success-soft-foreground"
    }
    if (score >= 70) {
        return "text-warning-soft-foreground"
    }
    return "text-danger-soft-foreground"
}

/** Props for {@link ProfileProjectRoadmap}. */
export type ProfileProjectRoadmapProps = WithClassNames<undefined>

/**
 * `/profile/<u>/projects/<courseGlobalId>` — the DETAIL tier of the projects
 * flow: the FULL milestone/task roadmap of ONE capstone course, no inline
 * expand cap (unlike the list's compact {@link import("../ProfileCapstone/ProjectCard").ProjectCard}
 * row). Reads the course id from the route, then filters the profile owner's
 * full `userCapstoneProgress` list down to it client-side — the same data the
 * list already fetched, per the BE recommendation (no dedicated detail query).
 *
 * @param props - optional className for the root element.
 */
export const ProfileProjectRoadmap = ({
    className,
}: ProfileProjectRoadmapProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const username = useProfileUsername()
    const params = useParams<{ courseId: string }>()
    const courseGlobalId = params?.courseId ? String(params.courseId) : null

    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    const {
        data: projectsData,
        isLoading,
        error: projectsError,
        mutate: reloadProjects,
    } = useQueryUserCapstoneProgressSwr(userId)

    const projects = projectsData ?? []
    // scope down to THIS course only — the detail page's whole reason to exist
    const project = useMemo(
        () => projects.find((item) => item.courseGlobalId === courseGlobalId) ?? null,
        [projects, courseGlobalId],
    )

    // milestones ordered along the roadmap (defensive copy before sort)
    const milestones = useMemo(
        () => [...(project?.milestones ?? [])].sort((a, b) => a.position - b.position),
        [project],
    )

    const totalTasks = Math.max(project?.totalTasks ?? 0, 1)
    const percent = Math.round(((project?.completedTasks ?? 0) / totalTasks) * 100)
    const hasVerified = (project?.completedTasks ?? 0) > 0

    const resolvedLoading = (isLoading || !userId) && !projectsData
    // resolved (not loading, no error) but no match → "not found" empty state
    const notFound = !resolvedLoading && !projectsError && !project

    return (
        <div className={cn("mx-auto flex max-w-4xl flex-col gap-6", className)}>
            <PageHeader
                breadcrumb={(
                    <BackLink
                        target={t("publicProfile.capstone.roadmapBackToProjects")}
                        onPress={() => router.push(pathConfig().locale(locale).profile(username ?? undefined).projects().build())}
                    />
                )}
                title={project?.courseTitle ?? t("publicProfile.capstone.roadmapTitle")}
                meta={project ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            {hasVerified ? (
                                <StatusChip
                                    tone="success"
                                    icon={<SealCheckIcon aria-hidden focusable="false" className="size-4" />}
                                >
                                    {t("pinnedProjects.verified")}
                                </StatusChip>
                            ) : null}
                            <Typography type="body-xs" color="muted">
                                {t("publicProfile.capstone.roadmapSummary", {
                                    completedMilestones: project.completedMilestones,
                                    totalMilestones: project.totalMilestones,
                                    completedTasks: project.completedTasks,
                                    totalTasks: project.totalTasks,
                                })}
                            </Typography>
                        </div>
                        <SegmentBar
                            hideLegend
                            max={totalTasks}
                            ariaLabel={`${project.courseTitle} · ${percent}%`}
                            segments={[
                                {
                                    key: "verified",
                                    label: t("publicProfile.capstone.projectsHeading"),
                                    value: project.completedTasks,
                                    color: "var(--success)",
                                },
                            ]}
                        />
                    </div>
                ) : undefined}
            />

            <AsyncContent
                isLoading={resolvedLoading}
                skeleton={(
                    <SurfaceListCard>
                        {[0, 1].map((row) => (
                            <SurfaceListCardItem key={row}>
                                <div className="flex flex-col gap-3">
                                    <Skeleton.Typography type="body-sm" width="1/3" />
                                    <Skeleton.ProgressBar />
                                    <Skeleton.Typography type="body-xs" width="2/3" />
                                </div>
                            </SurfaceListCardItem>
                        ))}
                    </SurfaceListCard>
                )}
                isEmpty={notFound || (Boolean(project) && milestones.length === 0)}
                emptyContent={notFound
                    ? {
                        title: t("publicProfile.capstone.roadmapNotFound"),
                        description: t("publicProfile.capstone.roadmapNotFoundHint"),
                    }
                    : {
                        title: t("publicProfile.capstone.roadmapEmpty"),
                    }}
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
                <SurfaceListCard>
                    {milestones.map((milestone, milestoneIndex) => (
                        <SurfaceListCardItem key={milestone.milestoneGlobalId ?? `${milestone.title}-${milestoneIndex}`}>
                            <div className="flex items-start gap-3">
                                <IconTile
                                    size="sm"
                                    icon={<RocketIcon aria-hidden focusable="false" />}
                                />
                                <div className="flex min-w-0 flex-1 flex-col gap-3">
                                    <ProgressMeter
                                        label={milestone.title}
                                        value={milestone.passedTasks}
                                        max={Math.max(milestone.totalTasks, 1)}
                                        showValue
                                    />
                                    <Typography type="body-xs" color="muted">
                                        {t("publicProfile.capstone.roadmapMilestoneProgress", {
                                            completed: milestone.passedTasks,
                                            total: milestone.totalTasks,
                                        })}
                                    </Typography>
                                    <div className="flex flex-col gap-0">
                                        {milestone.tasks.map((task, taskIndex) => (
                                            <div
                                                key={task.taskGlobalId ?? `${task.title}-${taskIndex}`}
                                                className={cn(
                                                    "flex items-center gap-3 py-2",
                                                    taskIndex < milestone.tasks.length - 1 && "border-b border-default",
                                                )}
                                            >
                                                {task.passed ? (
                                                    <CheckCircleIcon aria-hidden focusable="false" className="size-5 shrink-0 text-success-soft-foreground" />
                                                ) : (
                                                    <CircleIcon aria-hidden focusable="false" className="size-5 shrink-0 text-muted-foreground" />
                                                )}
                                                <Typography
                                                    type="body-sm"
                                                    className={cn("min-w-0 flex-1 truncate", task.passed && "text-success-soft-foreground")}
                                                >
                                                    {task.title}
                                                </Typography>
                                                {task.passed ? (
                                                    <div className="flex shrink-0 items-center gap-2">
                                                        <Typography
                                                            type="body-xs"
                                                            weight="medium"
                                                            className={scoreToneClass(task.score)}
                                                        >
                                                            {t("publicProfile.capstone.score", { score: task.score })}
                                                        </Typography>
                                                        {task.passedAt ? (
                                                            <Typography type="body-xs" color="muted">
                                                                {` · ${new Date(task.passedAt).toLocaleDateString(locale)}`}
                                                            </Typography>
                                                        ) : null}
                                                    </div>
                                                ) : null}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SurfaceListCardItem>
                    ))}
                </SurfaceListCard>
            </AsyncContent>
        </div>
    )
}
