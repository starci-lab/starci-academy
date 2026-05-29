import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for my AI settings query.
 * @returns the my-AI-settings SWR handle from {@link SwrContext}.
 */
export const useQueryMyAiSettingsSwr = () => {
    const { queryMyAiSettingsSwr } = use(SwrContext)!
    return queryMyAiSettingsSwr
}
