import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR mutation singleton for course enrollment.
 * @returns the course-enroll SWR mutation handle from {@link SwrContext}.
 */
export const useMutateCourseEnrollSwr = () => {
    const { mutateCourseEnrollSwr } = use(SwrContext)!
    return mutateCourseEnrollSwr
}
