import React from "react"
import { ProgressMeter } from "@/components/composites/stats/ProgressMeter"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH } from "@/components/frames/Stack"

const scoreColorOf = (score: number, max: number): "success" | "warning" | "danger" => {
    const ratio = max > 0 ? score / max : 0
    return ratio < 0.5 ? "danger" : ratio < 0.75 ? "warning" : "success"
}

type ScoreRowProps = {
    label: string
    score: number
    max: number
    isSkeleton?: boolean
}

export const ScoreRow = ({
    label,
    score,
    max,
    isSkeleton = false,
}: ScoreRowProps) => (
    <StackH
        gap={4}
        align="center"
        principle="content-row"
        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
        isSkeleton={isSkeleton}
        items={[
            () => <Typography size="sm" truncate isSkeleton={isSkeleton} text={label} />,
            () => (
                <ProgressMeter
                    value={score}
                    max={max}
                    color={isSkeleton ? "accent" : scoreColorOf(score, max)}
                    isSkeleton={isSkeleton}
                    classNames={["flex-1"]}
                />
            ),
            () => (
                <Typography
                    size="xs"
                    color="muted"
                    tabularNums
                    isSkeleton={isSkeleton}
                    text={`${score}/${max}`}
                />
            ),
        ]}
    />
)
