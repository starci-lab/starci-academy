import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR singleton for the course enrollment status query.
 * @returns the SWR query handle from {@link SwrContext}.
 */
export const useQueryCourseEnrollmentStatusSwr = () => {
    const { queryCourseEnrollmentStatusSwr } = use(SwrContext)!
    return queryCourseEnrollmentStatusSwr
}
