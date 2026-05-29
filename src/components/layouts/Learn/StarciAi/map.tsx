import React from "react"
import {
    SparkleIcon,
    BrainIcon,
    LightningIcon,
} from "@phosphor-icons/react"
import {
    StarciAiTier,
} from "./enums"
import type {
    StarciAiChipColor,
    StarciAiTierInfo,
} from "./types"

/**
 * Icon element rendered next to each task-kind card, keyed by `taskKind`.
 *
 * Unknown task kinds fall back to a generic sparkle icon at the call site.
 */
export const TASK_ICON_MAP: Record<string, React.ReactNode> = {
    grade: (
        <LightningIcon
            weight="duotone"
            className="size-6 text-warning"
        />
    ),
    reviewPersonalProject: (
        <BrainIcon
            weight="duotone"
            className="size-6 text-accent"
        />
    ),
    generateMilestone: (
        <SparkleIcon
            weight="duotone"
            className="size-6 text-success"
        />
    ),
}

/** Chip color token for a model provider badge, keyed by provider string. */
export const PROVIDER_COLOR_MAP: Record<string, StarciAiChipColor> = {
    openai: "success",
    gemini: "accent",
}

/** Human-readable provider label, keyed by provider string. */
export const PROVIDER_LABEL_MAP: Record<string, string> = {
    openai: "OpenAI",
    gemini: "Google Gemini",
}

/** Recommended-tier display info (label + badge color), keyed by tier slug. */
export const TIER_INFO_MAP: Record<StarciAiTier, StarciAiTierInfo> = {
    [StarciAiTier.Low]: {
        label: "Tiết kiệm",
        color: "accent",
    },
    [StarciAiTier.Medium]: {
        label: "Cân bằng",
        color: "warning",
    },
    [StarciAiTier.High]: {
        label: "Cao cấp",
        color: "success",
    },
}
