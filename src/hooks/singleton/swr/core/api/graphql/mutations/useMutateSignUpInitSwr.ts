import type { AbortableRequest } from "@/modules/api"
import {
    mutateSignUpInit,
    type SignUpInitRequest,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutateSignUpInitResult = Awaited<ReturnType<typeof mutateSignUpInit>>

/**
 * SWR mutation for `signUpInit`: creates account and sends OTP to email.
 */
export const useMutateSignUpSwrCore = () => {
    return useSWRMutation<
        MutateSignUpInitResult,
        Error,
        string,
        AbortableRequest<SignUpInitRequest>
    >(
        "MUTATE_SIGN_UP_INIT_SWR",
        async (_, { arg }) => {
            if (!arg.request) {
                throw new Error("request is required")
            }
            return await mutateSignUpInit({
                request: arg.request,
                signal: arg.signal,
            })
        },
    )
}
