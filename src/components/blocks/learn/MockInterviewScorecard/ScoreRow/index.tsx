import React from "react"
import { ProgressMeter } from "@/components/composites/stats/ProgressMeter"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH } from "@/components/frames/Stack"
import { FillAvailable } from "@/components/frames/FillAvailable"

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

/** One labeled score meter row inside a mock-interview scorecard. */
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
        identity={{ tier: "block", component: "ScoreRow" }}
        isSkeleton={isSkeleton}
        items={[
            () => <Typography size="sm" truncate isSkeleton={isSkeleton} text={label} />,
            () => (
                <FillAvailable
                    at="base"
                    isSkeleton={isSkeleton}
                    body={() => (
                        <ProgressMeter
                            value={score}
                            max={max}
                            color={isSkeleton ? "accent" : scoreColorOf(score, max)}
                            isSkeleton={isSkeleton}
                        />
                    )}
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
