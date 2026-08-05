import { AiModelCategory as RealAiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import type { AiModelCategory as BlueprintAiModelCategory } from "@/components/blocks/learn/SubmissionScoreCard"

/**
 * Real `AiModelCategory` (a backend-mirroring TS `enum`) → the blueprint's plain
 * string-union `AiModelCategory` (`"free" | "economy" | "balanced" | "premium" |
 * "frontier"`). The two have identical string values, but a TS string `enum` is
 * NOT structurally assignable to a matching string-literal union — this switch
 * is the explicit bridge (same convention as `CourseContents/map.ts#toDifficulty`).
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
