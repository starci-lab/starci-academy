import { queryCvReviewHistory } from "@/modules/api"    
import { useAppSelector } from "@/redux"
import useSWR from "swr"

/**
 * Loads review history for current CV submission id from singleton Formik state.
 */
export const useQueryCvReviewHistorySwrCore = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const swr = useSWR(
        authenticated
            ? [
                "QUERY_CV_REVIEW_HISTORY_SWR",
                authenticated,
            ]
            : null,
        async () => {
            const response = await queryCvReviewHistory({
                debug: false,
            })

            const payload = response.data?.cvReviewHistory?.data
            if (!payload) {
                throw new Error("CV review history not found")
            }

            return payload
        },
    )

    return swr
}
