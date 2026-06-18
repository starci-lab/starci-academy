import React from "react"
import {
    Chip,
    Typography,
    cn,
} from "@heroui/react"
import type {
    AiModelChoice,
    WithClassNames,
} from "@/modules/types"
import {
    PROVIDER_COLOR_MAP,
    PROVIDER_LABEL_MAP,
} from "../../map"

/** Props for {@link FallbackChoice}. */
export interface FallbackChoiceProps extends WithClassNames<undefined> {
    /** The fallback model reference (model id + provider). */
    choice: AiModelChoice
    /** Zero-based position in the fallback chain (rendered 1-based). */
    index: number
}

/**
 * One row in a model card's fallback chain: ordinal + model id + provider chip.
 *
 * Presentational (render-only); used only by {@link ModelCard}, hence nested.
 */
export const FallbackChoice = ({
    choice,
    index,
    className,
}: FallbackChoiceProps) => {
    return (
        <div className={cn("flex items-center gap-2 rounded-xl border px-3 py-2", className)}>
            <Typography type="body-xs" color="muted" className="font-mono">
                {index + 1}.
            </Typography>
            <Typography type="body-sm" className="font-mono">
                {choice.model}
            </Typography>
            <Chip
                size="sm"
                color={PROVIDER_COLOR_MAP[choice.provider] ?? "default"}
                variant="soft"
            >
                {PROVIDER_LABEL_MAP[choice.provider] ?? choice.provider}
            </Chip>
        </div>
    )
}
