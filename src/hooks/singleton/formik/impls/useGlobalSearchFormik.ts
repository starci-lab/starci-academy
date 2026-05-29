import { useContext } from "react"
import { FormikContext } from "../FormikContext"

/**
 * Access the singleton global-search Formik instance from {@link FormikContext}.
 * @returns the global-search formik handle.
 */
export const useGlobalSearchFormik = () => {
    const { globalSearchFormik } = useContext(FormikContext)!
    return globalSearchFormik
}

