import { queryCvReviewHistory } from "@/modules/api"
import { useKeycloak } from "@/hooks/singleton/keycloak"
import useSWR from "swr"

/**
 * Loads review history for current CV submission id from singleton Formik state.
 */
export const useQueryCvReviewHistorySwrCore = () => {
    const keycloak = useKeycloak()
    const token = keycloak.data?.authenticated ? keycloak.data?.token : undefined

    const swr = useSWR(
        token
            ? [
                "QUERY_CV_REVIEW_HISTORY_SWR",
                token,
            ]
            : null,
        async () => {
            const response = await queryCvReviewHistory({
                token,
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
