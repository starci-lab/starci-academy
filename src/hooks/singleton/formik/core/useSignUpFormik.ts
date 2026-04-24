import { useFormik } from "formik"
import * as Yup from "yup"
import { 
    usePostKeycloakRegisterSwr 
} from "@/hooks/singleton"
import { runRestWithToast } from "@/modules/toast"

/**
 * Formik values for the sign up form
 */
export interface SignUpFormikValues {
    /** User email address (also used as username). */
    email: string
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
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
}

/**
 * Validation schema for the sign up form
 */
const validationSchema = Yup.object({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
    confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    agreeToTerms: Yup.boolean().oneOf(
        [true],
        "You must accept the terms and privacy policy"
    ),
})

/**
 * Hook to use the sign up formik.
 * Calls `POST /api/v1/keycloak/auth/register` via SWR mutation on submit,
 * then redirects to Keycloak login so the user can sign in with the new account.
 */
export const useSignUpFormikCore = () => {
    const { trigger: postKeycloakRegister } = usePostKeycloakRegisterSwr()

    return useFormik<SignUpFormikValues>({
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
                    successMessage: "Đăng ký thành công!",
                    showErrorToast: false,
                    showSuccessToast: false,
                }
            )
        },
    })
}
