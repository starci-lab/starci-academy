import { useContext } from "react"
import { FormikContext } from "../FormikContext"

/**
 * Hook to use singleton personal project GitHub URL formik.
 */
export const usePersonalProjectGithubUrlFormik = () => {
    const { personalProjectGithubUrlFormik } = useContext(FormikContext)!
    return personalProjectGithubUrlFormik
}
