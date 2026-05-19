import {
    GraphQLHeadersKey,
    queryHeadhuntingCompanies,
} from "@/modules/api"
import {
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import {
    setHeadhunterCompanies,
} from "@/redux/slices"
import { useLocale } from "next-intl"
import useSWR from "swr"

/**
 * Lists headhunting companies via `headhuntingCompanies` and stores them in Redux.
 */
export const useQueryHeadhunterCompaniesSwrCore = () => {
    const locale = useLocale()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const dispatch = useAppDispatch()

    return useSWR(
        authenticated && enrolled
            ? [
                "QUERY_HEADHUNTING_COMPANIES_SWR",
                locale,
                enrolled,
                authenticated,
            ]
            : null,
        async () => {
            const response = await queryHeadhuntingCompanies({
                headers: {
                    [GraphQLHeadersKey.XLocale]: locale,
                },
            })

            const wrapped = response.data?.headhuntingCompanies
            if (!wrapped) {
                throw new Error("Headhunting companies not found")
            }
            if (!wrapped.success) {
                throw new Error(
                    wrapped.error || wrapped.message || "Headhunting companies not found",
                )
            }

            const payload = wrapped.data ?? []
            dispatch(setHeadhunterCompanies(payload))
            return payload
        },
    )
}
