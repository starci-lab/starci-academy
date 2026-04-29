import { useFormik } from "formik"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/redux"
import { setSearchQuery } from "@/redux/slices"

export interface GlobalSearchFormikValues {
    query: string
}

export const useGlobalSearchFormikCore = () => {
    const dispatch = useAppDispatch()
    const query = useAppSelector((state) => state.search.query)
    const formik = useFormik<GlobalSearchFormikValues>({
        initialValues: {
            query,
        },
        enableReinitialize: true,
        onSubmit: () => undefined,
    })

    useEffect(() => {
        if (formik.values.query === query) {
            return
        }
        dispatch(setSearchQuery(formik.values.query))
    }, [dispatch, formik.values.query, query])

    return formik
}

