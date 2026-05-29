
import { useContext } from "react"
import { FormikContext } from "../FormikContext"

/**
 * Access the singleton sign-up Formik instance from {@link FormikContext}.
 * @returns the sign-up formik handle.
 */
export const useSignUpFormik = () => {
    const { signUpFormik } = useContext(FormikContext)!
    return signUpFormik
}