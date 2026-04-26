import { queryCvReviewHistory } from "@/modules/api"
import { useKeycloakZustand } from "@/hooks/zustand"
import useSWR from "swr"

/**
 * Loads review history for current CV submission id from singleton Formik state.
 */
export const useQueryCvReviewHistorySwrCore = () => {
    const keycloak = useKeycloakZustand()
    const getAccessToken = () =>
        keycloak.authenticated ? keycloak.token : undefined
    const refreshAccessToken = async (minValiditySeconds = 30) =>
        (await keycloak.updateToken(minValiditySeconds)) ?? false

    const swr = useSWR(
        keycloak.authenticated
            ? [
                "QUERY_CV_REVIEW_HISTORY_SWR",
                keycloak.authenticated,
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
