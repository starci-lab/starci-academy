import React from "react"
import { ProgressMeter } from "@/components/composites/stats/ProgressMeter"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH } from "@/components/frames/Stack"

/**
 * Score bar/text color BY VALUE, not a fixed tone — a low score must read as
 * low. Ported unchanged from the source `scoreColorOf`.
 */
const scoreColorOf = (score: number, max: number): "success" | "warning" | "danger" => {
    const ratio = max > 0 ? score / max : 0
    return ratio < 0.5 ? "danger" : ratio < 0.75 ? "warning" : "success"
}

/** One labeled score row: a truncating label, a value-colored bar, and the raw "earned/max" beside it. */
export const ScoreRow = ({
    label,
    score,
    max,
}: {
    label: string
    score: number
    max: number
}) => (
    <StackH
        gap={4}
        align="center"
        principle="content-row"
        items={[
            () => <Typography size="sm" truncate classNames={["shrink-0"]} text={label} />,
            () => <ProgressMeter value={score} max={max} color={scoreColorOf(score, max)} classNames={["flex-1"]} />,
            () => <Typography size="xs" color="muted" tabularNums classNames={["shrink-0"]} text={`${score}/${max}`} />,
        ]}
    />
)
