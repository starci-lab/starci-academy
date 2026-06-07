import {
    defaultFoundationsListLimit,
    defaultFoundationsListSorts,
    GraphQLHeadersKey,
    queryFoundations,
} from "@/modules/api"
import {
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import {
    setFoundations,
    setFoundationsCount,
} from "@/redux/slices"
import { useLocale } from "next-intl"
import { usePathname } from "next/navigation"
import useSWR from "swr"

/**
 * Lists foundations for the selected category via `foundations` and stores rows in Redux.
 * Only fetches on the foundations page (`/foundations`).
 */
export const useQueryFoundationsSwr = () => {
    const locale = useLocale()
    const pathname = usePathname()
    const onFoundationsPage = pathname.includes("/foundations")
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const category = useAppSelector((state) => state.foundation.category)
    const pageNumber = useAppSelector((state) => state.foundation.pageNumber)
    const limit = useAppSelector((state) => state.foundation.limit)
    const dispatch = useAppDispatch()

    return useSWR(
        authenticated && enrolled && category?.id && onFoundationsPage
            ? [
                "QUERY_FOUNDATIONS_SWR",
                category.id,
                locale,
                enrolled,
                authenticated,
                pageNumber,
                limit,
            ]
            : null,
        async () => {
            if (!category?.id) {
                throw new Error("Foundation category id not found")
            }

            const response = await queryFoundations({
                request: {
                    categoryId: category.id,
                    filters: {
                        pageNumber: (pageNumber ?? 1) - 1,
                        limit: limit ?? defaultFoundationsListLimit,
                        sorts: defaultFoundationsListSorts,
                    },
                },
                headers: {
                    [GraphQLHeadersKey.XLocale]: locale,
                },
            })

            const payload = response.data?.foundations?.data
            if (!payload) {
                throw new Error("Foundations not found")
            }

            dispatch(setFoundations(payload.data))
            dispatch(setFoundationsCount(payload.count))
            return payload
        },
    )
}
