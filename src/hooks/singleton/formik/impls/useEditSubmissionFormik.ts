
import { useContext } from "react"
import { FormikContext } from "../FormikContext"

/**
 * Access the singleton edit-submission Formik instance from {@link FormikContext}.
 * @returns the edit-submission formik handle.
 */
export const useEditSubmissionFormik = () => {
    const { editSubmissionFormik } = useContext(FormikContext)!
    return editSubmissionFormik
}