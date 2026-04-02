
import { useContext } from "react"
import { FormikContext } from "../FormikContext"

/**
 * Hook to use the edit submission formik
 */
export const useEditSubmissionFormik = () => {
    const { editSubmissionFormik } = useContext(FormikContext)!
    return editSubmissionFormik
}