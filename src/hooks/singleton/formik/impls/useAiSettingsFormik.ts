import { useContext } from "react"
import { FormikContext } from "../FormikContext"

/**
 * Access the singleton AI settings Formik instance from {@link FormikContext}.
 * @returns the AI settings formik handle.
 */
export const useAiSettingsFormik = () => {
    const { aiSettingsFormik } = useContext(FormikContext)!
    return aiSettingsFormik
}
