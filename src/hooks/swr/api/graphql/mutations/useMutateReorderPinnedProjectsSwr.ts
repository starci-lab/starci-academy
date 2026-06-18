import {
    mutateReorderPinnedProjects,
    type ReorderPinnedProjectsRequest,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutateReorderPinnedProjectsResult = Awaited<ReturnType<typeof mutateReorderPinnedProjects>>

/**
 * SWR mutation wrapper for {@link mutateReorderPinnedProjects} (Bearer from Keycloak).
 */
export const useMutateReorderPinnedProjectsSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateReorderPinnedProjectsResult,
        Error,
        string,
        ReorderPinnedProjectsRequest
    >(
        "MUTATE_REORDER_PINNED_PROJECTS_SWR",
        async (_key, { arg }) => {
            return mutateReorderPinnedProjects({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
