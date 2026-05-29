import { useFormik } from "formik"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/redux"
import { setSearchQuery } from "@/redux/slices"

/** Formik values for the global search bar. */
export interface GlobalSearchFormikValues {
    /** Current search query string, kept in sync with Redux `search.query`. */
    query: string
}

/**
 * Core Formik for the global search bar.
 * Syncs `query` bidirectionally with Redux `search.query` via a `useEffect`.
 * @returns the global-search formik instance.
 */
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

