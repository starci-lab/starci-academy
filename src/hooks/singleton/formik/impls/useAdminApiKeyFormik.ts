
import { useContext } from "react"
import { FormikContext } from "../FormikContext"

/**
 * Hook to use the admin API key formik
 */
export const useAdminApiKeyFormik = () => {
    const { adminApiKeyFormik } = useContext(FormikContext)!
    return adminApiKeyFormik
}
