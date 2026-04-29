import { use } from "react"
import { SwrContext } from "../../../../SwrContext"

/**
 * Singleton access to the **`signUpInit`** GraphQL mutation (see `mutation-sign-up-init.ts`).
 *
 * ### What it does
 * Creates the Keycloak user and sends a **6-digit OTP** to the email; response includes
 * `challengeId` for {@link useMutateSignUpVerifyOtpSwr}.
 *
 * ### Usage (typically inside `useSignUpFormik`)
 * ```ts
 * const { trigger, isMutating } = useMutateSignUpInitSwr()
 * await trigger({ request: { email, password }, signal })
 * const env = data?.signUpInit
 * ```
 *
 * ### Wiring in UI
 * - **Registration step**: submit form → `trigger` → store `challengeId` in Formik → Redux `SignUpState.Otp`.
 * - **Resend OTP** (sign-up OTP screen): use {@link useMutateSignUpResendOtpSwr} with `challengeId` only.
 *
 * @returns SWR mutation object (`trigger`, `isMutating`, …) backed by `useMutateSignUpSwrCore` in context.
 */
export const useMutateSignUpInitSwr = () => {
    const { mutateSignUpSwr } = use(SwrContext)!
    return mutateSignUpSwr
}

/** @deprecated Use {@link useMutateSignUpInitSwr} */
export const useMutateSignUpSwr = useMutateSignUpInitSwr
