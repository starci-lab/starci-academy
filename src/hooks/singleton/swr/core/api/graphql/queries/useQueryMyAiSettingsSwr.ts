import { queryMyAiSettings } from "@/modules/api"
import useSWR from "swr"

/**
 * SWR query wrapper for {@link queryMyAiSettings}. `data` is the unwrapped
 * settings payload (or `null` when absent).
 */
export const useQueryMyAiSettingsSwrCore = () => {
    const swr = useSWR(
        ["QUERY_MY_AI_SETTINGS_SWR"],
        async () => {
            const data = await queryMyAiSettings({})

            if (!data || !data.data) {
                throw new Error("Failed to fetch AI settings")
            }

            return data.data.myAiSettings?.data ?? null
        },
    )

    return swr
}
