import { useFormik } from "formik"
import * as Yup from "yup"
import { usePostKeycloakLoginSwr, useQueryCheckEmailExistsSwr } from "@/hooks/singleton"
import { useKeycloakZustand } from "@/hooks/zustand"
import { runRestWithToast } from "@/modules/toast"
import { useEffect, useMemo } from "react"
import { useTranslations } from "next-intl"
import validator from "validator"
import _ from "lodash"
/**
 * Formik values for the sign in form
 */
export interface SignInFormikValues {
    /** User email address. */
    email: string
    /** Whether the email exists in the database. */
    emailExists: boolean
    /** Plain-text password. */
    password: string
    /** Whether to persist the session. */
    rememberMe: boolean
}

/**
 * Initial values for the sign in form
 */
const initialValues: SignInFormikValues = {
    email: "",
    emailExists: true,
    password: "",
    rememberMe: false,
}

/**
 * Hook to use the sign in formik.
 * Calls `POST /api/v1/keycloak/auth/login` via SWR mutation on submit,
 * then triggers a Keycloak SSO check so the session picks up the new tokens.
 */
export const useSignInFormikCore = () => {
    const { trigger: postKeycloakLogin } = usePostKeycloakLoginSwr()
    const { trigger: queryCheckEmailExists } = useQueryCheckEmailExistsSwr()
    const { init } = useKeycloakZustand()
    const t = useTranslations()
    const validationSchema = useMemo(
        () => Yup.object(
            {
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
                password: Yup.string()
                    .required(t("auth.signIn.password.required"))
                    .min(8, t("auth.signIn.password.minLength")),
                rememberMe: Yup.boolean(),
            }
        ), [t]
    )
    const formik = useFormik<SignInFormikValues>({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            const result = await runRestWithToast(
                () => postKeycloakLogin({
                    username: values.email,
                    password: values.password,
                }),
                { 
                    successMessage: t("auth.signIn.success"),
                    showErrorToast: false,
                    showSuccessToast: false,
                },
            )
            if (result) {
                await init({
                    onLoad: "check-sso",
                    token: result.accessToken,
                    refreshToken: result.refreshToken,
                    checkLoginIframe: false,
                })
            }
        },
    }
    )

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
