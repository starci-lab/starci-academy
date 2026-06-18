import {
    mutateSetWeeklyGoal,
    type SetWeeklyGoalRequest,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutateSetWeeklyGoalResult = Awaited<ReturnType<typeof mutateSetWeeklyGoal>>

/**
 * SWR mutation wrapper for {@link mutateSetWeeklyGoal} (Bearer from Keycloak).
 */
export const useMutateSetWeeklyGoalSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateSetWeeklyGoalResult,
        Error,
        string,
        SetWeeklyGoalRequest
    >(
        "MUTATE_SET_WEEKLY_GOAL_SWR",
        async (_key, { arg }) => {
            return mutateSetWeeklyGoal({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
