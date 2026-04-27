import { useFormik } from "formik"
import * as Yup from "yup"
import { 
    usePostKeycloakRegisterSwr,
    useQueryCheckEmailExistsSwr
} from "@/hooks/singleton"
import { runRestWithToast } from "@/modules/toast"
import { useTranslations } from "next-intl"
import { useEffect } from "react"
import _ from "lodash"
import validator from "validator"

/**
 * Formik values for the sign up form
 */
export interface SignUpFormikValues {
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
}

/**
 * Initial values for the sign up form
 */
const initialValues: SignUpFormikValues = {
    email: "",
    emailExists: false,
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
}

/**
 * Hook to use the sign up formik.
 * Calls `POST /api/v1/keycloak/auth/register` via SWR mutation on submit,
 * then redirects to Keycloak login so the user can sign in with the new account.
 */
export const useSignUpFormikCore = () => {
    const t = useTranslations()
    const { trigger: postKeycloakRegister } = usePostKeycloakRegisterSwr()
    const { trigger: queryCheckEmailExists } = useQueryCheckEmailExistsSwr()
    const validationSchema = Yup.object({
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
        password: Yup.string()
            .required(t("auth.signUp.password.required"))
            .min(8, t("auth.signUp.password.minLength")),
        confirmPassword: Yup.string()
            .required(t("auth.signUp.confirmPassword.required"))
            .oneOf([Yup.ref("password")], t("auth.signUp.confirmPassword.mismatch")),
        agreeToTerms: Yup.boolean().oneOf(
            [true],
            t("auth.signUp.agreeToTerms.required")
        ),
    })

    const formik = useFormik<SignUpFormikValues>(
        {
            enableReinitialize: true,
            initialValues,
            validationSchema,
            onSubmit: async (values) => {
                await runRestWithToast(
                    () => postKeycloakRegister({
                        username: values.email,
                        email: values.email,
                        password: values.password,
                        firstName: null,
                        lastName: null,
                        sendVerifyEmail: true,
                    }),
                    { 
                        successMessage: t("auth.signUp.success"),
                        showErrorToast: false,
                        showSuccessToast: false,
                    }
                )
            },
        }
    )

    /**
     * Debounced bloom-filter check: invalid email, or email already on file (sign-up).
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
        [
            formik.values.email,
            queryCheckEmailExists,
            t
        ]
    )
    return formik
}
