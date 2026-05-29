
import { useContext } from "react"
import { FormikContext } from "../FormikContext"

/**
 * Access the singleton sign-in Formik instance from {@link FormikContext}.
 * @returns the sign-in formik handle.
 */
export const useSignInFormik = () => {
    const { signInFormik } = useContext(FormikContext)!
    return signInFormik
}