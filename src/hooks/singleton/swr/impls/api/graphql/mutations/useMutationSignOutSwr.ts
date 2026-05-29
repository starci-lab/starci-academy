import { use } from "react"
import { SwrContext } from "../../../../SwrContext"

/**
 * Access the SWR mutation singleton for signing out.
 * @returns the SWR mutation handle from {@link SwrContext}.
 */
export const useMutationSignOutSwr = () => {
    const { mutateSignOutSwr } = use(SwrContext)!
    return mutateSignOutSwr
}   