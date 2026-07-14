"use client"

import React from "react"
import {
    Typography,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import {
    CheckCircleIcon,
    CircleHalfIcon,
    CircleIcon,
} from "@phosphor-icons/react"
import { CODING_DIFFICULTY_META } from "../../constants"
import type { ProblemStatus } from "../../types"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { StatusChip } from "@/components/blocks/chips/StatusChip"
import { SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import type { CodingProblem } from "@/modules/api/graphql/queries/types/coding"

/** Props for {@link ProblemRow}. A list-item, so it accepts its data as props. */
export interface ProblemRowProps extends WithClassNames<undefined> {
    /** The problem to render. */
    problem: CodingProblem
    /** The viewer's solve status for this problem (drives the status icon). */
    status: ProblemStatus
}

/** Status icon + colour + aria-label key per {@link ProblemStatus}. */
const STATUS_META: Record<
    ProblemStatus,
    { Icon: typeof CircleIcon; className: string; labelKey: string }
> = {
    solved: {
        Icon: CheckCircleIcon,
        className: "text-success",
        labelKey: "practice.row.status.solved",
    },
    attempted: {
        Icon: CircleHalfIcon,
        className: "text-warning",
        labelKey: "practice.row.status.attempted",
    },
    unsolved: {
        Icon: CircleIcon,
        className: "text-muted",
        labelKey: "practice.row.status.unsolved",
    },
}

/**
 * One catalog row: a prominent status icon (✓ solved / ◐ attempted / ○ unsolved),
 * the problem title (underlines on hover) navigating into the solve page, a
 * difficulty {@link StatusChip}, a domain chip, and the point value — with topic
 * tags shown secondary below. Renders as a {@link SurfaceListCardItem} (the WHOLE
 * row is the single nav link — `hover="underline"` per the go-there row style) so
 * it joins its siblings inside the parent {@link SurfaceListCard}, not a
 * hand-rolled bordered div. Styling lives in the blocks, this only places them.
 *
 * @param props - {@link ProblemRowProps}.
 */
export const ProblemRow = ({
    problem,
    status,
    className,
}: ProblemRowProps) => {
    const t = useTranslations()
    const statusMeta = STATUS_META[status]
    const StatusIcon = statusMeta.Icon
    const difficultyMeta = CODING_DIFFICULTY_META[problem.difficulty]

    return (
        <SurfaceListCardItem
            href={`/practice/${problem.slug}`}
            hover="underline"
            className={className}
        >
            <div className="flex min-w-0 items-center gap-3">
                {/* status icon — colour + aria-label so status isn't conveyed by colour alone */}
                <StatusIcon
                    weight={status === "unsolved" ? "regular" : "fill"}
                    aria-label={t(statusMeta.labelKey)}
                    className={cn("size-5 shrink-0", statusMeta.className)}
                />

                {/* title + tags column */}
                <div className="flex min-w-0 flex-col gap-2">
                    <Typography
                        type="body-sm"
                        weight="medium"
                        truncate
                        className="w-fit group-hover:underline"
                    >
                        {problem.title}
                    </Typography>
                    {problem.tags.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-2">
                            {problem.tags.slice(0, 4).map((tag) => (
                                <Typography key={tag} type="body-xs" color="muted">
                                    {tag}
                                </Typography>
                            ))}
                        </div>
                    ) : null}
                </div>

                {/* right cluster: difficulty + domain chips + points */}
                <div className="ml-auto flex shrink-0 items-center gap-2">
                    <StatusChip tone={difficultyMeta.tone}>
                        {t(difficultyMeta.labelKey)}
                    </StatusChip>
                    <StatusChip tone="neutral">
                        {t(`codingPractice.domain.${problem.domain}`)}
                    </StatusChip>
                    <Typography type="body-xs" color="muted">
                        {t("codingPractice.points", { points: problem.points })}
                    </Typography>
                </div>
            </div>
        </SurfaceListCardItem>
    )
}
