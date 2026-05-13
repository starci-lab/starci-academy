import { 
    AbortableRequest,
    mutateGenerateSubmitCvPresignUrl, 
    type GenerateSubmitCvPresignUrlRequest 
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutateGenerateSubmitCvPresignUrlResult = Awaited<ReturnType<typeof mutateGenerateSubmitCvPresignUrl>>

export const useMutateGenerateSubmitCvPresignUrlSwrCore = () => {
    return useSWRMutation<
        MutateGenerateSubmitCvPresignUrlResult,
        Error,
        string,
        AbortableRequest<GenerateSubmitCvPresignUrlRequest>
    >(
        "MUTATE_GENERATE_SUBMIT_CV_PRESIGN_URL_SWR",
        async (_, { arg }) => {
            if (!arg.request) {
                throw new Error("request is required")
            }
            return await mutateGenerateSubmitCvPresignUrl(
                {
                    request: arg.request,
                    signal: arg.signal,
                }
            )
        },
    )
}
