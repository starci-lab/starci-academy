import useSWR from "swr"
import { queryCoursesCheckoutPreview } from "@/modules/api/graphql/queries/query-courses-checkout-preview"
import type { CoursesCheckoutPreviewData } from "@/modules/api/graphql/queries/types/courses-checkout-preview"
import { useAppSelector } from "@/redux/hooks"

/** SWR key prefix for {@link useQueryCoursesCheckoutPreviewSwr}. */
export const QUERY_COURSES_CHECKOUT_PREVIEW_SWR = "QUERY_COURSES_CHECKOUT_PREVIEW_SWR"

/**
 * SWR wrapper for {@link queryCoursesCheckoutPreview}. `data` is the viewer's
 * pre-checkout preview for the given cart courses (per-course + summed list vs
 * charged prices, saving, bundle bonus), or `null`. Disabled until the viewer is
 * authenticated (loyalty is per-user) and at least one course id is given. The key
 * folds in the SORTED course ids so it revalidates whenever the cart changes.
 *
 * @param courseIds - the cart courses to price together (empty → disabled).
 */
export const useQueryCoursesCheckoutPreviewSwr = (courseIds: Array<string>) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const sortedKey = [...courseIds].sort().join(",")
    return useSWR<CoursesCheckoutPreviewData | null>(
        authenticated && courseIds.length > 0
            ? [QUERY_COURSES_CHECKOUT_PREVIEW_SWR, sortedKey]
            : null,
        async () => {
            const result = await queryCoursesCheckoutPreview({ courseIds })
            return result.data?.coursesCheckoutPreview?.data ?? null
        },
    )
}
