import { useContext } from "react"
import { FormikContext } from "../FormikContext"

export const useGlobalSearchFormik = () => {
    const { globalSearchFormik } = useContext(FormikContext)!
    return globalSearchFormik
}

