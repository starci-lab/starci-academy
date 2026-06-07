import type { AbortableRequest } from "@/modules/api"
import { 
    mutateVerifySubmitCvPresignUrl, 
    type VerifySubmitCvPresignUrlRequest 
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutateVerifySubmitCvPresignUrlResult = Awaited<ReturnType<typeof mutateVerifySubmitCvPresignUrl>>

/**
 * SWR mutation core for verifying the CV pre-signed upload URL.
 * @returns the SWR mutation handle.
 */
export const useMutateVerifySubmitCvPresignUrlSwr = () => {
    return useSWRMutation<
        MutateVerifySubmitCvPresignUrlResult,
        Error,
        string,
        AbortableRequest<VerifySubmitCvPresignUrlRequest>
    >(
        "MUTATE_VERIFY_SUBMIT_CV_PRESIGN_URL_SWR",
        async (_, { arg }) => {
            if (!arg.request) {
                throw new Error("request is required")
            }
            return await mutateVerifySubmitCvPresignUrl(
                {
                    request: arg.request,
                    signal: arg.signal,
                }
            )
        },
    )
}
