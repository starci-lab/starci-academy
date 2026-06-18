import { queryRecommendedCourses } from "@/modules/api"
import type { QueryRecommendedCoursesData } from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWR from "swr"

/**
 * SWR wrapper for {@link queryRecommendedCourses}. `data` is the viewer's
 * recommended (not-enrolled) courses with their loyalty-discounted prices, or
 * `null`. User-scoped — only runs once authenticated.
 */
export const useQueryRecommendedCoursesSwr = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<QueryRecommendedCoursesData | null>(
        authenticated ? ["QUERY_RECOMMENDED_COURSES_SWR"] : null,
        async () => {
            // unwrap the standard API envelope; null when absent
            const result = await queryRecommendedCourses({})
            return result.data?.recommendedCourses?.data ?? null
        },
    )
}
