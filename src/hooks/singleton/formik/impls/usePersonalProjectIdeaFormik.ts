import { useContext } from "react"
import { FormikContext } from "../FormikContext"

/**
 * Hook to use singleton personal project idea formik.
 */
export const usePersonalProjectIdeaFormik = () => {
    const { personalProjectIdeaFormik } = useContext(FormikContext)!
    return personalProjectIdeaFormik
}
