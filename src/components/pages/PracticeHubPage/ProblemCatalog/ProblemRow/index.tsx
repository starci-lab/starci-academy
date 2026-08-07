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
import { StatusChip } from "@/components/blocks/chips/StatusChip"
import { SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import type { CodingProblem } from "@/modules/api/graphql/queries/types/coding"
import { StackH, StackV } from "@/components/frames/Stack"
import { Box } from "@/components/frames/Box"

/** Props for {@link ProblemRow}. A list-item, so it accepts its data as props. */
export interface ProblemRowProps {
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
        className: "text-success-soft-foreground",
        labelKey: "PracticeHubPage.row.status.solved",
    },
    attempted: {
        Icon: CircleHalfIcon,
        className: "text-warning-soft-foreground",
        labelKey: "PracticeHubPage.row.status.attempted",
    },
    unsolved: {
        Icon: CircleIcon,
        className: "text-muted",
        labelKey: "PracticeHubPage.row.status.unsolved",
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
    status}: ProblemRowProps) => {
    const t = useTranslations()
    const statusMeta = STATUS_META[status]
    const StatusIcon = statusMeta.Icon
    const difficultyMeta = CODING_DIFFICULTY_META[problem.difficulty]

    return (
        <SurfaceListCardItem
            href={`/PracticeHubPage/${problem.slug}`}
            hover="underline"
        >
            <StackH gap={4} align="center" principle="content-row" classNames={["min-w-0"]}
                explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                items={[
                    () => (
                        <StatusIcon
                            weight={status === "unsolved" ? "regular" : "fill"}
                            aria-label={t(statusMeta.labelKey)}
                            className={cn("size-5 shrink-0", statusMeta.className)}
                        />
                    ),
                    () => (
                        <StackV gap={3} principle="sibling-stack" classNames={["min-w-0", "flex-1"]}
                            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                            items={[
                                () => (
                                    <Typography
                                        type="body-sm"
                                        weight="medium"
                                        truncate
                                        className="w-fit underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline"
                                    >
                                        {problem.title}
                                    </Typography>
                                ),
                                ...(problem.tags.length > 0 ? [
                                    () => (
                                        <Box principle="chip-row" className="flex flex-wrap items-center gap-2"
                                            explain="Lets chips share one wrapping row so related tags stay together without stacking as a column.">
                                            {problem.tags.slice(0, 4).map((tag) => (
                                                <Typography key={tag} type="body-xs" color="muted">
                                                    {tag}
                                                </Typography>
                                            ))}
                                            {problem.tags.length > 4 ? (
                                                <Typography
                                                    type="body-xs"
                                                    color="muted"
                                                    title={problem.tags.slice(4).join(", ")}
                                                >
                                                    {t("PracticeHubPage.row.moreTags", {
                                                        count: problem.tags.length - 4,
                                                    })}
                                                </Typography>
                                            ) : null}
                                        </Box>
                                    ),
                                ] : []),
                            ]} />
                    ),
                    () => (
                        <Box principle="push-end" className="ml-auto flex shrink-0 items-center gap-2"
                            explain="Pushes this peer to the trailing edge so trailing meta stays right-aligned in the row.">
                            <StatusChip tone={difficultyMeta.tone}>
                                {t(difficultyMeta.labelKey)}
                            </StatusChip>
                            <StatusChip tone="neutral">
                                {t(`codingPractice.domain.${problem.domain}`)}
                            </StatusChip>
                            <Typography type="body-xs" color="muted">
                                {t("codingPractice.points", { points: problem.points })}
                            </Typography>
                        </Box>
                    ),
                ]} />
        </SurfaceListCardItem>
    )
}
