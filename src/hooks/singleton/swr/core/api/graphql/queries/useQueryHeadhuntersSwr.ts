import {
    GraphQLHeadersKey,
    defaultConsultantsListLimit,
    defaultConsultantsListSorts,
    queryConsultants,
} from "@/modules/api"
import type { ConsultantEntity } from "@/modules/types"
import {
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import {
    setHeadhunter,
    setHeadhunters,
    setHeadhuntersCount,
} from "@/redux/slices"
import { useLocale } from "next-intl"
import useSWR from "swr"

/**
 * Loads consultants for all companies and merges into Redux `headhunter.entities`.
 */
export const useQueryHeadhuntersSwrCore = () => {
    const locale = useLocale()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const companies = useAppSelector((state) => state.headhunter.companies)
    const headhunterId = useAppSelector((state) => state.headhunter.headhunterId)
    const dispatch = useAppDispatch()

    const companyIdsKey = companies?.map((c) => c.id).join(",") ?? ""

    return useSWR(
        authenticated && enrolled && companies?.length
            ? [
                "QUERY_CONSULTANTS_ALL_SWR",
                locale,
                companyIdsKey,
            ]
            : null,
        async () => {
            const merged: Array<ConsultantEntity> = []
            let total = 0

            for (const company of companies ?? []) {
                const response = await queryConsultants({
                    headers: {
                        [GraphQLHeadersKey.XLocale]: locale,
                    },
                    request: {
                        companyId: company.id,
                        filters: {
                            limit: defaultConsultantsListLimit,
                            pageNumber: 0,
                            sorts: defaultConsultantsListSorts,
                        },
                    },
                })

                const wrapped = response.data?.consultants
                if (!wrapped) {
                    continue
                }
                if (!wrapped.success) {
                    throw new Error(
                        wrapped.error || wrapped.message || "Consultants not found",
                    )
                }
                const payload = wrapped.data
                if (!payload) {
                    continue
                }
                total += payload.count
                merged.push(...payload.data)
            }

            merged.sort((a, b) => a.orderIndex - b.orderIndex)
            dispatch(setHeadhunters(merged))
            dispatch(setHeadhuntersCount(total))

            if (headhunterId) {
                const selected = merged.find((item) => item.id === headhunterId)
                dispatch(setHeadhunter(selected))
            }

            return merged
        },
    )
}
