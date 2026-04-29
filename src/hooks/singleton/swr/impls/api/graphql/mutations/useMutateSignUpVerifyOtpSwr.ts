import { use } from "react"
import { SwrContext } from "../../../../SwrContext"

/**
 * Singleton access to the **`signUpVerifyOtp`** GraphQL mutation (see `mutation-sign-up-verify-otp.ts`).
 *
 * ### What it does
 * Verifies the OTP and completes sign-up. On success the **core hook** persists the access token
 * (local storage + Redux) and the server sets the refresh token cookie (`withCredentials`).
 *
 * ### Usage (typically inside `useSignUpFormik` on the OTP step)
 * ```ts
 * const { trigger } = useMutateSignUpVerifyOtpSwr()
 * await trigger({
 *   request: { challengeId: values.challengeId, otp: values.otp },
 *   signal,
 * })
 * ```
 *
 * ### Wiring in UI
 * Render the OTP step when Redux `state.signUpState === SignUpState.Otp` — see
 * `AuthenticationModal/SignUpSection/OtpState`. Submit should call `trigger` with `challengeId`
 * from {@link useMutateSignUpInitSwr} and the 6-digit `otp` from Formik.
 *
 * @returns SWR mutation object backed by `useMutateSignUpVerifyOtpSwrCore` in context.
 */
export const useMutateSignUpVerifyOtpSwr = () => {
    const { mutateSignUpVerifyOtpSwr } = use(SwrContext)!
    return mutateSignUpVerifyOtpSwr
}
