import React from "react"
import { type SkeletonProps } from "@sb-components/frames/_slot"
import { SparkleIcon } from "@phosphor-icons/react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { type TaskSubmissionResult } from "../types"

/** Props for the local {@link TaskResultSummary} leaf. */
interface TaskResultSummaryProps {
    result?: TaskSubmissionResult
    isSkeleton: boolean
}

/**
 * TRIMMED sibling of `SubmissionScoreCard` — see file header for exactly what
 * was dropped and why. `result` omitted → a single muted "no evaluation yet"
 * line instead (§2: a real, named state, not a loading stub).
 */
export const TaskResultSummary = ({ result, isSkeleton }: TaskResultSummaryProps) => {
    if (result == null) {
        return (
            <Typography
                size="sm"
                color="muted"
                isSkeleton={isSkeleton}
                text="No grading runs yet."

            />
        )
    }
    const scoreRow = (
        <>
            <Typography
                size="h3"
                weight="bold"
                tabularNums
                isSkeleton={isSkeleton}
                text={String(result.score)}

            />
            <Typography
                size="sm"
                color="muted"
                tabularNums
                isSkeleton={isSkeleton}
                text={`/ ${result.maxScore}`}

            />
            {result.aiBadge != null ? (
                <Chip
                    tone="accent"
                    icon={SparkleIcon}
                    text={result.aiBadge}
                    isSkeleton={isSkeleton}

                />
            ) : null}
        </>
    )

    return (
        <StackV
            gap={2}
            principles={["title-subtitle"]}
            isSkeleton={isSkeleton}

            items={[
                ({ isSkeleton }: SkeletonProps) => <StackH gap={4} principles={["content-row"]} align="baseline" at="sm" isSkeleton={isSkeleton} items={[() => scoreRow]} />,
                ...(result.shortFeedback != null ? [() => (
                    <Typography
                        size="sm"
                        isSkeleton={isSkeleton}
                        text={result.shortFeedback}

                    />
                )] : []),
            ]}
        />
    )
}
