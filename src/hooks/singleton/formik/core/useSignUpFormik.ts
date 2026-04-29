import { useFormik } from "formik"
import * as Yup from "yup"
import {
    useMutateSignUpInitSwr,
    useMutateSignUpVerifyOtpSwr,
    useQueryCheckEmailExistsSwr,
} from "@/hooks/singleton"
import { runGraphQLWithToast } from "@/modules/toast"
import { useTranslations } from "next-intl"
import { useEffect, useMemo } from "react"
import _ from "lodash"
import validator from "validator"
import { AuthenticationModalTab, resetSignUpState, setAuthenticationModalTab, setSignUpState, SignUpState } from "@/redux/slices"
import { useAppSelector, useAppDispatch } from "@/redux"

/**
 * Formik values for the sign up form
 */
export interface SignUpFormikValues {
    /** Synced with Redux sign-up step for Yup (`registration` vs `otp`). */
    state: SignUpState
    /** User email address (also used as username). */
    email: string
    /** Whether the email exists in the database. */
    emailExists: boolean
    /** Plain-text password. */
    password: string
    /** Password confirmation. */
    confirmPassword: string
    /** Must accept terms before submitting. */
    agreeToTerms: boolean
    /** Challenge id returned from `signUpInit`. */
    challengeId?: string
    /** 6-digit OTP code. */
    otp: string
}

/**
 * Initial values for the sign up form
 */
const initialValues: SignUpFormikValues = {
    state: SignUpState.Registration,
    email: "",
    emailExists: false,
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    challengeId: undefined,
    otp: "",
}

/**
 * Hook to use the sign up formik.
 * Uses GraphQL `signUpInit` → `signUpVerifyOtp` (same pattern as sign-in OTP flow).
 */
export const useSignUpFormikCore = () => {
    const t = useTranslations()
    const { trigger: mutateSignUpInit } = useMutateSignUpInitSwr()
    const { trigger: mutateSignUpVerifyOtp } = useMutateSignUpVerifyOtpSwr()
    const { trigger: queryCheckEmailExists } = useQueryCheckEmailExistsSwr()
    const signUpState = useAppSelector((state) => state.state.signUpState)
    const dispatch = useAppDispatch()
    const validationSchema = useMemo(
        () =>
            Yup.object({
                state: Yup.mixed<SignUpState>().oneOf([SignUpState.Registration, SignUpState.Otp]),
                email: Yup.string()
                    .test(
                        "is-email",
                        t("auth.signUp.email.invalid"),
                        (value) => {
                            if (!value) {
                                return true
                            }
                            return validator.isEmail(value)
                        }
                    )
                    .test(
                        "is-email-exists",
                        t("auth.signUp.email.alreadyExists"),
                        function () {
                            const emailExists = this.parent.emailExists
                            return !emailExists
                        }
                    )
                    .required(t("auth.signUp.email.required")),
                password: Yup.string().when("state", {
                    is: SignUpState.Registration,
                    then: (schema) =>
                        schema
                            .required(t("auth.signUp.password.required"))
                            .min(8, t("auth.signUp.password.minLength")),
                    otherwise: (schema) => schema.optional(),
                }),
                confirmPassword: Yup.string().when("state", {
                    is: SignUpState.Registration,
                    then: (schema) =>
                        schema
                            .required(t("auth.signUp.confirmPassword.required"))
                            .oneOf(
                                [Yup.ref("password")],
                                t("auth.signUp.confirmPassword.mismatch")
                            ),
                    otherwise: (schema) => schema.optional(),
                }),
                agreeToTerms: Yup.boolean().when(
                    "state", {
                        is: SignUpState.Registration,
                        then: (schema) =>
                        {
                            return schema.oneOf(
                                [true],
                                t("auth.signUp.agreeToTerms.required")
                            )
                        },
                        otherwise: (schema) => schema.optional(),
                    }
                ),
                otp: Yup.string().when("state", {
                    is: SignUpState.Otp,
                    then: (schema) =>
                        schema
                            .required(t("auth.signUp.otp.required"))
                            .matches(/^\d{6}$/, t("auth.signUp.otp.invalid")),
                    otherwise: (schema) => schema.optional(),
                }),
            }),
        [t]
    )

    const formik = useFormik<SignUpFormikValues>({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        /** Re-run Yup when fields change so checkbox/terms errors clear after the user fixes them. */
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            switch (signUpState) {
            case SignUpState.Registration: {
                let challengeId: string | undefined
                const ok = await runGraphQLWithToast(
                    async () => {
                        const apolloResult = await mutateSignUpInit({
                            request: {
                                email: values.email,
                                password: values.password,
                            },
                        })
                        const env = apolloResult.data?.signUpInit
                        if (!env) {
                            throw new Error("signUpInit failed")
                        }
                        challengeId = env.data?.challengeId
                        if (!env.success || !challengeId) {
                            throw new Error(
                                env.error ?? env.message ?? "signUpInit failed"
                            )
                        }
                        return env
                    },
                    {
                        showErrorToast: true,
                        showSuccessToast: true,
                    }
                )
                if (!ok) return
                await formik.setFieldValue("challengeId", challengeId)
                await formik.setFieldValue("otp", "")
                await formik.setFieldValue("state", SignUpState.Otp)
                dispatch(setSignUpState(SignUpState.Otp))
                return
            }
            case SignUpState.Otp: {
                const ok = await runGraphQLWithToast(
                    async () => {
                        if (!values.challengeId) {
                            throw new Error("challengeId is required")
                        }
                        const apolloResult = await mutateSignUpVerifyOtp({
                            request: {
                                challengeId: values.challengeId,
                                otp: values.otp,
                            },
                        })
                        const verifyEnv = apolloResult.data?.signUpVerifyOtp
                        if (!verifyEnv) {
                            throw new Error("signUpVerifyOtp failed")
                        }
                        return verifyEnv
                    },
                    {
                        showErrorToast: true,
                        showSuccessToast: true,
                    }
                )
                if (!ok) return
                formik.resetForm()
                dispatch(resetSignUpState())
                dispatch(setAuthenticationModalTab(AuthenticationModalTab.SignIn))
                return
            }
            default:
                throw new Error("Invalid sign-up state")
            }
        },
    })

    /**
     * Debounced bloom-filter check: invalid email, or email already on file (sign-up).
     */
    useEffect(() => {
        const controller = new AbortController()
        const debounced = _.debounce(async () => {
            const trimmed = formik.values.email.trim()
            if (!trimmed) {
                return
            }
            const valid = validator.isEmail(trimmed)
            if (!valid) {
                return
            }
            const result = await queryCheckEmailExists({
                request: {
                    email: trimmed,
                },
                signal: controller.signal,
            })
            if (result.isBloomFilterReady) {
                formik.setFieldValue("emailExists", result.exists)
            }
        }, 300)
        debounced()
        return () => {
            controller.abort()
            debounced.cancel()
        }
    }, [formik.values.email, queryCheckEmailExists])

    return formik
}
