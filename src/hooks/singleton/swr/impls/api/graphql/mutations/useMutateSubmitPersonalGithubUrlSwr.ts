import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR mutation singleton for submitting the personal project GitHub URL.
 * @returns the SWR mutation handle from {@link SwrContext}.
 */
export const useMutateSubmitPersonalGithubUrlSwr = () => {
    const { mutateSubmitPersonalGithubUrlSwr } = use(SwrContext)!
    return mutateSubmitPersonalGithubUrlSwr
}
