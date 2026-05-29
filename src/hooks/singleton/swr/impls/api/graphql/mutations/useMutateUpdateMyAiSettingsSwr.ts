import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR mutation singleton for updating my AI settings.
 * @returns the update-AI-settings SWR mutation handle from {@link SwrContext}.
 */
export const useMutateUpdateMyAiSettingsSwr = () => {
    const { mutateUpdateMyAiSettingsSwr } = use(SwrContext)!
    return mutateUpdateMyAiSettingsSwr
}
