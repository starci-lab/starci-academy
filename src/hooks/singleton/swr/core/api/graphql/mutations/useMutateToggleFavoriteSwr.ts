import {
    mutateToggleFavorite,
    type ToggleFavoriteRequest,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutateToggleFavoriteResult = Awaited<ReturnType<typeof mutateToggleFavorite>>

/**
 * SWR mutation wrapper for {@link mutateToggleFavorite}.
 * Pass `{ contentId, isFavorite }` as arg to toggle.
 */
export const useMutateToggleFavoriteSwrCore = () => {
    const swr = useSWRMutation<
        MutateToggleFavoriteResult,
        Error,
        string,
        ToggleFavoriteRequest
    >(
        "MUTATE_TOGGLE_FAVORITE_SWR",
        async (_key, { arg }) => {
            return mutateToggleFavorite({
                request: arg,
            })
        }
    )
    return swr
}
