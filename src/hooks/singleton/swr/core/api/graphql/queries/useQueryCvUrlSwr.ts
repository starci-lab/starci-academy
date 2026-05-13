import { queryCvUrl } from "@/modules/api"
import { useAppDispatch, useAppSelector } from "@/redux"
import { setCvUrl } from "@/redux/slices/cv-url"
import useSWR from "swr"

/**
 * Fetches the presigned CV view URL for the Keycloak user and mirrors it into Redux.
 */
export const useQueryCvUrlSwrCore = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const dispatch = useAppDispatch()
    const swr = useSWR(
        authenticated
            ? [
                "QUERY_CV_URL_SWR",
                authenticated,
            ]
            : null,
        async () => {
            const response = await queryCvUrl({
                debug: false,
            })
            const wrapped = response.data?.cvUrl
            if (!wrapped) {
                throw new Error("CV URL query failed")
            }
            if (!wrapped.success) {
                throw new Error(wrapped.error || wrapped.message || "CV URL query failed")
            }
            dispatch(setCvUrl(wrapped.data ?? null))
            return wrapped.data ?? null
        },
    )

    return swr
}
