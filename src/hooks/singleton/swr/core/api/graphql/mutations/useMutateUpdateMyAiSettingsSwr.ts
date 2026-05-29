import {
    mutateUpdateMyAiSettings,
    type UpdateMyAiSettingsRequest,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutateUpdateMyAiSettingsResult = Awaited<ReturnType<typeof mutateUpdateMyAiSettings>>

/**
 * SWR mutation wrapper for {@link mutateUpdateMyAiSettings} (Bearer from Keycloak).
 */
export const useMutateUpdateMyAiSettingsSwrCore = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateUpdateMyAiSettingsResult,
        Error,
        string,
        UpdateMyAiSettingsRequest
    >(
        "MUTATE_UPDATE_MY_AI_SETTINGS_SWR",
        async (_key, { arg }) => {
            return mutateUpdateMyAiSettings({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
