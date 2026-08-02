import { AiModelCategory as RealAiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import type { AiModelCategory as BlueprintAiModelCategory } from "@/components/starci/blocks/learn/SubmissionScoreCard"

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
