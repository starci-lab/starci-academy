import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR mutation singleton for toggling saved/favorite state of a content.
 * @returns the SWR mutation handle from {@link SwrContext}.
 */
export const useMutateToggleFavoriteSwr = () => {
    const { mutateToggleFavoriteSwr } = use(SwrContext)!
    return mutateToggleFavoriteSwr
}
