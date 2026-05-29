import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the user personal task attempts query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryUserPersonalTaskAttemptsSwr = () => {
    const { queryUserPersonalTaskAttemptsSwr } = use(SwrContext)!
    return queryUserPersonalTaskAttemptsSwr
}
