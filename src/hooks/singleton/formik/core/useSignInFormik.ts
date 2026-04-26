import { useFormik } from "formik"
import * as Yup from "yup"
import { usePostKeycloakLoginSwr } from "@/hooks/singleton"
import { useKeycloakZustand } from "@/hooks/zustand"
import { runRestWithToast } from "@/modules/toast"

/**
 * Formik values for the sign in form
 */
export interface SignInFormikValues {
    /** User email address. */
    email: string
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
    password: "",
    rememberMe: false,
}

/**
 * Validation schema for the sign in form
 */
const validationSchema = Yup.object({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
    rememberMe: Yup.boolean(),
})

/**
 * Hook to use the sign in formik.
 * Calls `POST /api/v1/keycloak/auth/login` via SWR mutation on submit,
 * then triggers a Keycloak SSO check so the session picks up the new tokens.
 */
export const useSignInFormikCore = () => {
    const { trigger: postKeycloakLogin } = usePostKeycloakLoginSwr()
    const { init } = useKeycloakZustand()
    return useFormik<SignInFormikValues>({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            const result = await runRestWithToast(
                () => postKeycloakLogin({
                    username: values.email,
                    password: values.password,
                }),
                { 
                    successMessage: "Đăng nhập thành công!",
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
    })
}
