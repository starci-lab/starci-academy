import { useFormik } from "formik"
import * as Yup from "yup"
import {
    useAuthenticationOverlayState,
    useMutateSignInInitSwr,
    useMutateSignInVerifyOtpSwr,
    useQueryCheckEmailExistsSwr,
} from "@/hooks/singleton"
import { runGraphQLWithToast } from "@/modules/toast"
import { useEffect, useMemo } from "react"
import { useTranslations } from "next-intl"
import validator from "validator"
import _ from "lodash"
import { 
    useAppDispatch, 
    useAppSelector 
} from "@/redux"
import { resetSignInState, setSignInState, SignInState } from "@/redux/slices"
/**
 * Formik values for the sign in form
 */
export interface SignInFormikValues {
    /** Synced with Redux sign-in step for Yup (`credentials` vs `otp`). */
    state: SignInState
    /** User email address. */
    email: string
    /** Whether the email exists in the database. */
    emailExists: boolean
    /** Plain-text password. */
    password: string
    /** Challenge id returned from `signIn` init; used for OTP verification. */
    challengeId?: string
    /** 6-digit OTP code. */
    otp: string
    /** Whether to persist the session. */
    rememberMe: boolean
}

/**
 * Initial values for the sign in form
 */
const initialValues: SignInFormikValues = {
    state: SignInState.Credentials,
    email: "",
    emailExists: true,
    password: "",
    challengeId: undefined,
    otp: "",
    rememberMe: false,
}

/**
 * Hook to use the sign in formik.
 * Calls `POST /api/v1/keycloak/auth/login` via SWR mutation on submit,
 * then triggers a Keycloak SSO check so the session picks up the new tokens.
 */
export const useSignInFormikCore = () => {
    const { trigger: mutateSignInInit } = useMutateSignInInitSwr()
    const { trigger: mutateSignInVerifyOtp } = useMutateSignInVerifyOtpSwr()
    const { trigger: queryCheckEmailExists } = useQueryCheckEmailExistsSwr()
    const { close: onAuthenticationClose } = useAuthenticationOverlayState()
    const dispatch = useAppDispatch()
    const signInState = useAppSelector((state) => state.state.signInState)
    const t = useTranslations()
    const validationSchema = useMemo(
        () => Yup.object(
            {
                state: Yup.mixed<SignInState>().oneOf([
                    SignInState.Credentials,
                    SignInState.OTP,
                ]),
                email: Yup.string()
                    .test(
                        "is-email", 
                        t("auth.signIn.email.invalid"), 
                        (value) => {
                            if (!value) {
                                return true
                            }
                            return validator.isEmail(value)
                        }
                    )
                    .test(
                        "is-email-exists",
                        t("auth.signIn.email.notExists"),
                        function () {
                            const emailExists = this.parent.emailExists
                            return emailExists
                        }
                    )
                    .required(t("auth.signIn.email.required")),
                password: Yup.string().when("state", {
                    is: SignInState.Credentials,
                    then: (schema) =>
                        schema
                            .required(t("auth.signIn.password.required"))
                            .min(8, t("auth.signIn.password.minLength")),
                    otherwise: (schema) => schema.optional(),
                }),
                otp: Yup.string().when("state", {
                    is: SignInState.OTP,
                    then: (schema) =>
                        schema
                            .required(t("auth.signIn.otp.required"))
                            .matches(/^\d{6}$/, t("auth.signIn.otp.invalid")),
                    otherwise: (schema) => schema.optional(),
                }),
                rememberMe: Yup.boolean(),
            }
        ), [t]
    )
    const formik = useFormik<SignInFormikValues>({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            switch (signInState) {
            case SignInState.Credentials:
            {
                let challengeId: string | undefined
                const ok = await runGraphQLWithToast(
                    async () => {
                        const apolloResult = await mutateSignInInit({
                            request: {
                                email: values.email,
                                password: values.password,
                            },
                        })
                        const env = apolloResult.data?.signInInit
                        if (!env) {
                            throw new Error("signIn init failed")
                        }
                        challengeId = env.data?.challengeId
                        if (!env.success || !challengeId) {
                            throw new Error(env.error ?? env.message ?? "signIn init failed")
                        }
                        
                        return env
                    },
                    {
                        showErrorToast: true,
                        showSuccessToast: true,
                    },
                )
                if (!ok) return
                await formik.setFieldValue(
                    "challengeId", 
                    challengeId
                )
                await formik.setFieldValue("otp", "")
                await formik.setFieldValue("state", SignInState.OTP)
                dispatch(setSignInState(SignInState.OTP))
                return
            }
            case SignInState.OTP:
            {
                const ok = await runGraphQLWithToast(
                    async () => {
                        if (!values.challengeId) {
                            throw new Error("challengeId is required")
                        }
                        const apolloResult = await mutateSignInVerifyOtp({
                            request: {
                                challengeId: values.challengeId,
                                otp: values.otp,
                            },
                        })
                        const verifyEnv = apolloResult.data?.signInVerifyOtp
                        if (!verifyEnv) {
                            throw new Error("signInVerifyOtp failed")
                        }
                        return verifyEnv
                    },
                    {
                        showErrorToast: true,
                        showSuccessToast: true,
                    },
                )
                if (!ok) return
                formik.resetForm()
                dispatch(resetSignInState())
                onAuthenticationClose()
                return
            }
            default:
                throw new Error("Invalid sign in tab")
            }   
        },
    })

    /**
     * Debounced bloom-filter check: invalid email, or email already on file (sign-in).
     */
    useEffect(
        () => {
            const controller = new AbortController()
            const debounced = _.debounce(
                async () => {
                    const trimmed = formik.values.email.trim()
                    if (!trimmed) {
                        return
                    }
                    const valid = validator.isEmail(trimmed)
                    if (!valid) {
                        return
                    }
                    const result = await queryCheckEmailExists(
                        { 
                            request: {
                                email: trimmed, 
                            },
                            signal: controller.signal,
                        }
                    )
                    if (result.isBloomFilterReady) {
                        formik.setFieldValue(
                            "emailExists", 
                            result.exists
                        )
                    }
                },
                300
            )
            debounced()
            return () => {
                controller.abort()
                debounced.cancel()
            }
        },
        [formik.values.email, queryCheckEmailExists]
    )
    return formik
}
