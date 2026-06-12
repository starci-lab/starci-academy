import React from "react"
import {
    Chip,
} from "@heroui/react"
import type {
    AiModelChoice,
} from "@/modules/types"
import {
    PROVIDER_COLOR_MAP,
    PROVIDER_LABEL_MAP,
} from "../../map"

/** Props for {@link FallbackChoice}. */
export interface FallbackChoiceProps {
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
}: FallbackChoiceProps) => {
    return (
        <div className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5">
            <span className="text-xs text-muted font-mono">
                {index + 1}.
            </span>
            <span className="text-sm font-mono">
                {choice.model}
            </span>
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
