import { 
    mutateSignInVerifyOtp, 
    type SignInVerifyOtpRequest 
} from "@/modules/api"
import { setAccessToken, setAuthenticated } from "@/redux/slices"
import { useAppDispatch } from "@/redux"
import { LocalStorage, LocalStorageId } from "@/modules/storage"
import useSWRMutation from "swr/mutation"
import type { AbortableRequest } from "@/modules/api"

type MutateSignInVerifyOtpResult = Awaited<ReturnType<typeof mutateSignInVerifyOtp>>

/**
 * SWR mutation for `signInVerifyOtp`: verifies OTP, stores access token, refresh token is set via HttpOnly cookie.
 */
export const useMutateSignInVerifyOtpSwrCore = () => {
    const dispatch = useAppDispatch()
    return useSWRMutation<
        MutateSignInVerifyOtpResult,
        Error,
        string,
        AbortableRequest<SignInVerifyOtpRequest>
    >(
        "MUTATE_SIGN_IN_VERIFY_OTP_SWR",
        async (_key, { arg }) => {
            if (!arg.request) {
                throw new Error("request is required")
            }
            const result = await mutateSignInVerifyOtp({
                request: arg.request,
                signal: arg.signal,
            })
            const env = result.data?.signInVerifyOtp
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

