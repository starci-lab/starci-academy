"use client"

import React from "react"
import {
    Typography,
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    RocketIcon,
    SealCheckIcon,
} from "@phosphor-icons/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { SegmentBar } from "@/components/blocks/stats/SegmentBar"
import { StatusChip } from "@/components/blocks/chips/StatusChip"
import type { QueryUserCapstoneCourseProgress } from "@/modules/api/graphql/queries/types/user-capstone-progress"

/** Props for {@link ProjectCard}. */
export interface ProjectCardProps extends WithClassNames<undefined> {
    /** The single course capstone progress to showcase (list-item data prop). */
    project: QueryUserCapstoneCourseProgress
}

/**
 * One personal-project capstone, rendered as a compact ROW (not a nested card —
 * the section's {@link import("@/components/blocks").LabeledCard} is the frame).
 * Layout: a framed rocket {@link IconTile}, the course title with a green
 * "✓ Verified by StarCi" chip + overall percent, a single honest
 * {@link SegmentBar} whose green fill = graded/verified tasks out of all tasks,
 * and a milestone/task summary line. Green (`success`) means "verified"
 * throughout, per the profile spec.
 *
 * Purely presentational glance content — the parent
 * {@link import("../index").ProfileCapstone} wraps this in a `SurfaceListCardItem`
 * that is itself the nav LINK to `/profile/<u>/projects/<courseGlobalId>` (the
 * full milestone/task roadmap, {@link import("../../ProfileProjectRoadmap").ProfileProjectRoadmap}),
 * `hover="underline"` — the title underlines on hover as the row's own go-there
 * affordance (row-as-link; ref `hover-style-matches-clickable-nature`).
 *
 * @param props - {@link ProjectCardProps}
 */
export const ProjectCard = ({
    project,
    className,
}: ProjectCardProps) => {
    const t = useTranslations()

    const totalTasks = Math.max(project.totalTasks, 1)
    const percent = Math.round((project.completedTasks / totalTasks) * 100)
    const hasVerified = project.completedTasks > 0

    return (
        <div className={cn("flex items-start gap-3", className)}>
            <IconTile
                size="sm"
                icon={<RocketIcon aria-hidden focusable="false" />}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <Typography
                            type="body-sm"
                            weight="medium"
                            truncate
                            className="underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline"
                        >
                            {project.courseTitle}
                        </Typography>
                        {hasVerified ? (
                            <StatusChip
                                tone="success"
                                icon={<SealCheckIcon aria-hidden focusable="false" className="size-4" />}
                            >
                                {t("pinnedProjects.verified")}
                            </StatusChip>
                        ) : null}
                    </div>
                    <Typography type="body-xs" color="muted">
                        {percent}%
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
                <Typography type="body-xs" color="muted">
                    {t("publicProfile.capstone.roadmapSummary", {
                        completedMilestones: project.completedMilestones,
                        totalMilestones: project.totalMilestones,
                        completedTasks: project.completedTasks,
                        totalTasks: project.totalTasks,
                    })}
                </Typography>
            </div>
        </div>
    )
}
