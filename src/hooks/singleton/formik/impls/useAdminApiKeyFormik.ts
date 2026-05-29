
import { useContext } from "react"
import { FormikContext } from "../FormikContext"

/**
 * Access the singleton admin API key Formik instance from {@link FormikContext}.
 * @returns the admin API key formik handle.
 */
export const useAdminApiKeyFormik = () => {
    const { adminApiKeyFormik } = useContext(FormikContext)!
    return adminApiKeyFormik
}
