import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for my AI quota query.
 * @returns the my-AI-quota SWR handle from {@link SwrContext}.
 */
export const useQueryMyAiQuotaSwr = () => {
    const { queryMyAiQuotaSwr } = use(SwrContext)!
    return queryMyAiQuotaSwr
}
