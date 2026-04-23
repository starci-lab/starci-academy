import { queryCvReviewHistory } from "@/modules/api"
import { useKeycloak } from "@/hooks/singleton/keycloak"
import useSWR from "swr"

/**
 * Loads review history for current CV submission id from singleton Formik state.
 */
export const useQueryCvReviewHistorySwrCore = () => {
    const keycloak = useKeycloak()
    const getAccessToken = () =>
        keycloak.data?.authenticated ? keycloak.data?.token : undefined
    const refreshAccessToken = async (minValiditySeconds = 30) =>
        (await keycloak.data?.updateToken(minValiditySeconds)) ?? false

    const swr = useSWR(
        keycloak.data?.authenticated
            ? [
                "QUERY_CV_REVIEW_HISTORY_SWR",
                keycloak.data?.authenticated,
            ]
            : null,
        async () => {
            const response = await queryCvReviewHistory({
                getAccessToken,
                refreshAccessToken,
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
