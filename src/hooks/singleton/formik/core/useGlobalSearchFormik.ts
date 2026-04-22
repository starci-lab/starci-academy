import { useFormik } from "formik"

export interface GlobalSearchFormikValues {
    query: string
}

const initialValues: GlobalSearchFormikValues = {
    query: "",
}

export const useGlobalSearchFormikCore = () =>
    useFormik<GlobalSearchFormikValues>({
        initialValues,
        onSubmit: () => undefined,
    })

