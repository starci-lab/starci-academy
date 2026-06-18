import {
    mutateReactActivity,
    type ReactActivityRequest,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutateReactActivityResult = Awaited<ReturnType<typeof mutateReactActivity>>

/**
 * SWR mutation wrapper for {@link mutateReactActivity} (Bearer from Keycloak).
 * Set/change a reaction by passing `type`; remove it by passing `type: null`.
 */
export const useMutateReactActivitySwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateReactActivityResult,
        Error,
        string,
        ReactActivityRequest
    >(
        "MUTATE_REACT_ACTIVITY_SWR",
        async (_key, { arg }) => {
            return mutateReactActivity({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
