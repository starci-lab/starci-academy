import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the AI models query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryAiModelsSwr = () => {
    const { queryAiModelsSwr } = use(SwrContext)!
    return queryAiModelsSwr
}
