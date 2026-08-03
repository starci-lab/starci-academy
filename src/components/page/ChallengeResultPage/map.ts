import { AiModelCategory as RealAiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import { SubmissionFeedbackSeverity as RealSubmissionFeedbackSeverity } from "@/modules/types/enums/submission-feedback-severity"
import type { AiModelCategory as BlueprintAiModelCategory } from "@/components/starci/blocks/learn/SubmissionScoreCard"
import type { SubmissionFeedbackSeverity as BlueprintSubmissionFeedbackSeverity } from "@/components/starci/blocks/learn/SubmissionFindingsList"

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
    case RealAiModelCategory.Free:
        return "free"
    case RealAiModelCategory.Economy:
        return "economy"
    case RealAiModelCategory.Balanced:
        return "balanced"
    case RealAiModelCategory.Premium:
        return "premium"
    case RealAiModelCategory.Frontier:
        return "frontier"
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
