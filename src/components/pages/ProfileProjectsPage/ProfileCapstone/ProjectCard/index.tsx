"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    RocketIcon,
    SealCheckIcon,
} from "@phosphor-icons/react"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { SegmentBar } from "@/components/composites/stats/SegmentBar"
import { StatusChip } from "@/components/blocks/chips/StatusChip"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Typography } from "@/components/atoms/text/Typography"
import { Cluster } from "@/components/frames/Cluster"
import { StackH, StackV } from "@/components/frames/Stack"
import type { QueryUserCapstoneCourseProgress } from "@/modules/api/graphql/queries/types/user-capstone-progress"

/** Props for {@link ProjectCard}. */
export interface ProjectCardProps {
    /** The single course capstone progress to showcase. Absent only while {@link ProjectCardProps.isSkeleton}. */
    project?: QueryUserCapstoneCourseProgress
    /**
     * First load, nothing in hand → this row shimmers in place. The resting state lives
     * HERE, beside the loaded one, so the two shapes cannot drift the way a placeholder
     * hand-kept in the list would (`loading-and-skeleton.md`).
     */
    isSkeleton?: boolean
}

/**
 * One personal-project capstone, rendered as a compact ROW (not a nested card —
 * the section's `LabeledCard` is the frame). Layout: a framed rocket
 * {@link IconTile}, the course title with a green "✓ Verified by StarCi" chip +
 * overall percent, a single honest {@link SegmentBar} whose green fill =
 * graded/verified tasks out of all tasks, and a milestone/task summary line.
 * Green (`success`) means "verified" throughout, per the profile spec.
 *
 * Purely presentational glance content — the parent
 * {@link import("../index").ProfileCapstone} wraps this in a `SurfaceListCardItem`
 * that is itself the nav LINK to `/profile/<u>/projects/<courseGlobalId>`,
 * `hover="underline"` — the title underlines on hover as the row's own go-there
 * affordance (row-as-link; ref `hover-style-matches-clickable-nature`).
 *
 * @param props - {@link ProjectCardProps}
 */
export const ProjectCard = ({
    project,
    isSkeleton = false,
}: ProjectCardProps) => {
    const t = useTranslations()

    const resting = isSkeleton || !project
    const totalTasks = Math.max(project?.totalTasks ?? 1, 1)
    const percent = Math.round(((project?.completedTasks ?? 0) / totalTasks) * 100)
    const hasVerified = (project?.completedTasks ?? 0) > 0

    return (
        <StackH identity={{ tier: "page", component: "ProjectCard" }}
            gap={4}
            principle="content-row"
            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
            align="start"
            items={[
                () => (resting
                    ? <Skeleton className="size-12 shrink-0 rounded-xl" />
                    : <IconTile size="sm" icon={<RocketIcon aria-hidden focusable="false" />} />),
                () => (
                    <StackV
                        gap={3}
                        principle="sibling-stack"
                        explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                        classNames={["min-w-0", "flex-1"]}
                        items={[
                            () => (
                                <StackH
                                    gap={3}
                                    principle="flex-action"
                                    explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                                    align="start"
                                    justify="between"
                                    items={[
                                        () => (
                                            <Cluster
                                                gap={3}
                                                principle="chip-row"
                                                explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                                                classNames={["min-w-0"]}
                                                items={[
                                                    () => (
                                                        <Typography
                                                            size="sm"
                                                            weight="medium"
                                                            truncate
                                                            underlineOnGroupHover
                                                            isSkeleton={resting}
                                                            classNames={resting ? ["w-1/2"] : undefined}
                                                            text={project?.courseTitle}
                                                        />
                                                    ),
                                                    ...(resting
                                                        ? [() => <Skeleton.Chip />]
                                                        : hasVerified
                                                            ? [() => (
                                                                <StatusChip
                                                                    tone="success"
                                                                    icon={<SealCheckIcon aria-hidden focusable="false" className="size-4" />}
                                                                >
                                                                    {t("pinnedProjects.verified")}
                                                                </StatusChip>
                                                            )]
                                                            : []),
                                                ]}
                                            />
                                        ),
                                        () => (
                                            <Typography
                                                size="xs"
                                                color="muted"
                                                isSkeleton={resting}
                                                classNames={resting ? ["w-fit"] : undefined}
                                                text={`${percent}%`}
                                            />
                                        ),
                                    ]}
                                />
                            ),
                            () => (resting
                                ? <Skeleton.ProgressBar />
                                : (
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
                                )),
                            () => (
                                <Typography
                                    size="xs"
                                    color="muted"
                                    isSkeleton={resting}
                                    classNames={resting ? ["w-2/3"] : undefined}
                                    text={project
                                        ? t("publicProfile.capstone.roadmapSummary", {
                                            completedMilestones: project.completedMilestones,
                                            totalMilestones: project.totalMilestones,
                                            completedTasks: project.completedTasks,
                                            totalTasks: project.totalTasks,
                                        })
                                        : undefined}
                                />
                            ),
                        ]}
                    />
                ),
            ]}
        />
    )
}
