import React from "react"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * Score bar/text color BY VALUE, not a fixed tone — a low score must read as
 * low. Ported unchanged from the source `scoreColorOf`.
 */
const scoreColorOf = (score: number, max: number): "success" | "warning" | "danger" => {
    const ratio = max > 0 ? score / max : 0
    return ratio < 0.5 ? "danger" : ratio < 0.75 ? "warning" : "success"
}

/** One labeled score row: a truncating label, a value-colored bar, and the raw "earned/max" beside it. */
interface ScoreRowProps {
    label: string
    score: number
    max: number
}
export const ScoreRow = ({
    label,
    score,
    max,
}: ScoreRowProps) => (
    <StackH
        gap={4}
        align="center"
        principle="content-row"
        items={[
            () => <Typography size="sm" truncate text={label} />,
            () => <ProgressMeter value={score} max={max} color={scoreColorOf(score, max)} classNames={["flex-1"]} />,
            () => <Typography size="xs" color="muted" tabularNums text={`${score}/${max}`} />,
        ]}
    />
)
