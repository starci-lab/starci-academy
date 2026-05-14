import { useContext } from "react"
import { FormikContext } from "../FormikContext"

/**
 * Hook to use singleton CV review Formik (queue `reviewCv` via SWR mutation).
 */
export const useCvReviewFormik = () => {
    const { cvReviewFormik } = useContext(FormikContext)!
    return cvReviewFormik
}
