import { useContext } from "react"
import { FormikContext } from "../FormikContext"

/**
 * Singleton Formik for personal project `githubUrl` + `branch` (debounced sync; submit = AI review).
 */
export const usePersonalProjectGithubFormik = () => {
    const { personalProjectGithubFormik } = useContext(FormikContext)!
    return personalProjectGithubFormik
}
