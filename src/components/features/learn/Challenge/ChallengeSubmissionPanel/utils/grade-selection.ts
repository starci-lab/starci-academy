import type {
    ChallengeGradeSelection,
} from "../types"
import { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import { type AiGradableModel } from "@/modules/api/graphql/queries/types/ai-models"
import type { UserChallengeSubmissionEntity } from "@/modules/types/entities/user-challenge-submission"

/** The free Auto lane — balancer picks a complimentary model, no model chosen. */
export const AUTO_GRADE_SELECTION: ChallengeGradeSelection = {
    model: null,
    provider: null,
}

/**
 * Resolve the initial grading selection for a submission row.
 *
 * Priority: (1) the user's persisted model pick on the submission row, (2) a
 * premium-category model when the user is entitled to paid models, (3) the free
 * Auto lane (no pinned model) as the safe fallback.
 *
 * @param userSubmission - persisted submission row, if any.
 * @param models - enabled catalog models the picker offers.
 * @param canPremium - whether the user may pin paid-tier models.
 * @returns the model to seed the row's picker with.
 */
export const resolveInitialGradeSelection = (
    userSubmission: UserChallengeSubmissionEntity | null | undefined,
    models: Array<AiGradableModel>,
    canPremium: boolean,
): ChallengeGradeSelection => {
    // 1) restore a previously persisted model pick
    if (userSubmission?.selectedModel) {
        return {
            model: userSubmission.selectedModel,
            provider: userSubmission.selectedModelProvider ?? null,
        }
    }
    // 2) default to a premium model when the user can pin paid-tier models
    if (canPremium && models.length > 0) {
        const premium = models.find(
            (model) => model.category === AiModelCategory.Premium,
        ) ?? models[0]
        return {
            model: premium.model,
            provider: premium.provider,
        }
    }
    // 3) safe fallback — free Auto lane (no pinned model)
    return AUTO_GRADE_SELECTION
}
