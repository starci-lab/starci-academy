import { AiModelCategory as RealAiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import { SubmissionFeedbackSeverity as RealSubmissionFeedbackSeverity } from "@/modules/types/enums/submission-feedback-severity"
import type { AiModelCategory as BlueprintAiModelCategory } from "@/components/blocks/learn/SubmissionScoreCard"
import type { SubmissionFeedbackSeverity as BlueprintSubmissionFeedbackSeverity } from "@/components/blocks/learn/SubmissionFindingsList"

/**
 * Real `AiModelCategory` (a backend-mirroring TS `enum`) → the blueprint's plain
 * string-union `AiModelCategory` (`"free" | "economy" | "balanced" | "premium" |
 * "frontier"`). The two have identical string values, but a TS string `enum` is
 * NOT structurally assignable to a matching string-literal union — this switch
 * is the explicit bridge (same convention as
 * `@/components/drawersv2/SubmissionAttemptsDrawer/map.ts#toBlueprintModelCategory`).
 *
 * @param category - The real, GraphQL-sourced model category.
 * @returns The equivalent blueprint category value.
 */
export const toBlueprintModelCategory = (category: RealAiModelCategory): BlueprintAiModelCategory => {
    switch (category) {
    case RealAiModelCategory.Medium:
        return "medium"
    case RealAiModelCategory.High:
        return "high"
    // embedding tiers never grade a submission, and Low is the chat rung — all
    // fold to the lowest grading chip defensively (the switch stays exhaustive)
    case RealAiModelCategory.Low:
    case RealAiModelCategory.EmbeddingBulk:
    case RealAiModelCategory.EmbeddingDoc:
        return "low"
    }
}

/**
 * Real `SubmissionFeedbackSeverity` (a backend-mirroring TS `enum`) → the
 * blueprint's plain string-union severity (`"high" | "medium" | "low"`). Same
 * bridging reason as {@link toBlueprintModelCategory}.
 *
 * @param severity - The real, GraphQL-sourced finding severity.
 * @returns The equivalent blueprint severity value.
 */
export const toBlueprintSeverity = (
    severity: RealSubmissionFeedbackSeverity,
): BlueprintSubmissionFeedbackSeverity => {
    switch (severity) {
    case RealSubmissionFeedbackSeverity.High:
        return "high"
    case RealSubmissionFeedbackSeverity.Medium:
        return "medium"
    case RealSubmissionFeedbackSeverity.Low:
        return "low"
    }
}
