import {
    AbortableRequest,
    mutateVerifyAvatarPresignUrl,
    type VerifyAvatarPresignUrlRequest,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutateVerifyAvatarPresignUrlResult = Awaited<ReturnType<typeof mutateVerifyAvatarPresignUrl>>

/**
 * SWR mutation core for confirming a direct avatar upload + persisting it.
 * @returns the SWR mutation handle.
 */
export const useMutateVerifyAvatarPresignUrlSwr = () => {
    return useSWRMutation<
        MutateVerifyAvatarPresignUrlResult,
        Error,
        string,
        AbortableRequest<VerifyAvatarPresignUrlRequest>
    >(
        "MUTATE_VERIFY_AVATAR_PRESIGN_URL_SWR",
        async (_, { arg }) => {
            if (!arg.request) {
                throw new Error("request is required")
            }
            return await mutateVerifyAvatarPresignUrl(
                {
                    request: arg.request,
                    signal: arg.signal,
                }
            )
        },
    )
}
