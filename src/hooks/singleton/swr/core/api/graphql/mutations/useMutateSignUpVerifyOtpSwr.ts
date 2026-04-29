import {
    mutateSignUpVerifyOtp,
    type SignUpVerifyOtpRequest,
} from "@/modules/api"
import { setAccessToken, setAuthenticated } from "@/redux/slices"
import { useAppDispatch } from "@/redux"
import { LocalStorage, LocalStorageId } from "@/modules/storage"
import useSWRMutation from "swr/mutation"
import type { AbortableRequest } from "@/modules/api"

type MutateSignUpVerifyOtpResult = Awaited<ReturnType<typeof mutateSignUpVerifyOtp>>

/**
 * SWR mutation for `signUpVerifyOtp`: verifies OTP, stores access token (refresh via HttpOnly cookie).
 */
export const useMutateSignUpVerifyOtpSwrCore = () => {
    const dispatch = useAppDispatch()
    return useSWRMutation<
        MutateSignUpVerifyOtpResult,
        Error,
        string,
        AbortableRequest<SignUpVerifyOtpRequest>
    >(
        "MUTATE_SIGN_UP_VERIFY_OTP_SWR",
        async (_key, { arg }) => {
            if (!arg.request) {
                throw new Error("request is required")
            }
            const result = await mutateSignUpVerifyOtp({
                request: arg.request,
                signal: arg.signal,
            })
            const env = result.data?.signUpVerifyOtp
            const token = env?.data?.accessToken
            if (env?.success && token) {
                LocalStorage.setItem(
                    LocalStorageId.KeycloakAccessToken,
                    token
                )
                dispatch(setAccessToken(token))
                dispatch(setAuthenticated(true))
            }
            return result
        },
    )
}
