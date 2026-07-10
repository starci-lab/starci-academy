import useSWR from "swr"
import { queryMyInstallmentPlans } from "@/modules/api/graphql/queries/query-my-installment-plans"
import { useAppSelector } from "@/redux/hooks"

/**
 * SWR query wrapper for {@link queryMyInstallmentPlans}. `data` is the unwrapped
 * array of the viewer's non-completed installment plans (or `[]` when absent).
 * User-scoped — only runs once the viewer is authenticated.
 */
export const useQueryMyInstallmentPlansSwr = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const swr = useSWR(
        authenticated ? ["QUERY_MY_INSTALLMENT_PLANS_SWR"] : null,
        async () => {
            const data = await queryMyInstallmentPlans({})

            if (!data || !data.data) {
                throw new Error("Failed to fetch installment plans")
            }

            return data.data.myInstallmentPlans?.data?.plans ?? []
        },
    )

    return swr
}
