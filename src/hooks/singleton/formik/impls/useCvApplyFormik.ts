import { useContext } from "react"
import { FormikContext } from "../FormikContext"

/**
 * Hook to use singleton CV apply formik.
 */
export const useCvApplyFormik = () => {
    const { cvApplyFormik } = useContext(FormikContext)!
    return cvApplyFormik
}
