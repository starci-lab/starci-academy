import {
    mutateCourseEnroll,
    type CourseEnrollRequest,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutateCourseEnrollResult = Awaited<ReturnType<typeof mutateCourseEnroll>>

/**
 * SWR mutation wrapper for {@link mutateCourseEnroll} (Bearer from Keycloak).
 */
export const useMutateCourseEnrollSwrCore = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateCourseEnrollResult,
        Error,
        string,
        CourseEnrollRequest
    >(
        "MUTATE_COURSE_ENROLL_SWR",
        async (_key, { arg }) => {
            return mutateCourseEnroll({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
