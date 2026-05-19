import {
    GraphQLHeadersKey,
    queryFoundationCategories,
} from "@/modules/api"
import {
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import {
    setFoundationCategories,
    setFoundationCategory,
} from "@/redux/slices"
import { useLocale } from "next-intl"
import useSWR from "swr"

/**
 * Lists foundation categories via `foundationCategories` and stores them in Redux.
 */
export const useQueryFoundationCategoriesSwrCore = () => {
    const locale = useLocale()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const categoryDisplayId = useAppSelector((state) => state.foundation.categoryDisplayId)
    const dispatch = useAppDispatch()

    return useSWR(
        authenticated && enrolled
            ? [
                "QUERY_FOUNDATION_CATEGORIES_SWR",
                locale,
                enrolled,
                authenticated,
            ]
            : null,
        async () => {
            const response = await queryFoundationCategories({
                headers: {
                    [GraphQLHeadersKey.XLocale]: locale,
                },
            })

            const wrapped = response.data?.foundationCategories
            if (!wrapped) {
                throw new Error("Foundation categories not found")
            }
            if (!wrapped.success) {
                throw new Error(wrapped.error || wrapped.message || "Foundation categories not found")
            }

            const payload = wrapped.data ?? []
            dispatch(setFoundationCategories(payload))

            if (categoryDisplayId) {
                const selected = payload.find((item) => item.displayId === categoryDisplayId)
                dispatch(setFoundationCategory(selected))
            }

            return payload
        },
    )
}
