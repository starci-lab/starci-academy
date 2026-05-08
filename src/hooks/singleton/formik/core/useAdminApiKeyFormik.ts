import { useFormik } from "formik"
import * as Yup from "yup"
import { useAppDispatch } from "@/redux"
import { setAdminApiKey } from "@/redux/slices"
import { useRouter } from "next/navigation"
import { useMemo } from "react"

/**
 * Formik values for the admin API key form.
 */
export interface AdminApiKeyFormikValues {
    /** Admin API key. */
    apiKey: string
}

/**
 * Initial values for the admin API key form.
 */
const initialValues: AdminApiKeyFormikValues = {
    apiKey: "",
}

/**
 * Hook to use the admin API key formik.
 * On submit, saves the API key to Redux and navigates to the tools page.
 */
export const useAdminApiKeyFormikCore = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()

    const validationSchema = useMemo(
        () => Yup.object({
            apiKey: Yup.string()
                .required("API key is required")
                .min(1, "API key cannot be empty"),
        }),
        [],
    )

    const formik = useFormik<AdminApiKeyFormikValues>({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            dispatch(setAdminApiKey(values.apiKey))
            router.push("admin/tools/upload-video")
        },
    })

    return formik
}
