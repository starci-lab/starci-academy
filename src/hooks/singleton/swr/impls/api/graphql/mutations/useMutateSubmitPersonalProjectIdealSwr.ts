import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR mutation singleton for submitting the personal project idea.
 * @returns the SWR mutation handle from {@link SwrContext}.
 */
export const useMutateSubmitPersonalProjectIdealSwr = () => {
    const { mutateSubmitPersonalProjectIdealSwr } = use(SwrContext)!
    return mutateSubmitPersonalProjectIdealSwr
}
