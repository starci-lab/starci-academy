import { queryAiModels } from "@/modules/api"
import { useAppDispatch } from "@/redux"
import { setAiModels } from "@/redux/slices"
import useSWR from "swr"

export const useQueryAiModelsSwrCore = () => {
    const dispatch = useAppDispatch()

    const swr = useSWR(
        ["QUERY_AI_MODELS_SWR"],
        async () => {
            const data = await queryAiModels({})

            if (!data || !data.data) {
                throw new Error("Failed to fetch AI models")
            }

            const result = data.data.aiModels?.data
            if (result) {
                dispatch(setAiModels({
                    tier: result.tier,
                    models: result.models,
                }))
            }

            return data.data
        },
    )

    return swr
}
