import { queryCourseEnrollmentStatus } from "@/modules/api"
import { useKeycloakZustand } from "@/hooks/zustand"
import { useAppDispatch, useAppSelector } from "@/redux"
import { setEnrolled } from "@/redux/slices"
import useSWR from "swr"

/**
 * The core function to query course enrollment status with SWR.
 */
export const useQueryCourseEnrollmentStatusSwrCore = () => {
    const dispatch = useAppDispatch()
    const keycloak = useKeycloakZustand()
    const course = useAppSelector((state) => state.course.entity)
    const authenticated = Boolean(keycloak.authenticated)
    const getAccessToken = () =>
        keycloak.authenticated ? keycloak.token : undefined
    const refreshAccessToken = async (minValiditySeconds = 30) =>
        (await keycloak.updateToken(minValiditySeconds)) ?? false
    /** The SWR. */
    const swr = useSWR(
        course?.id && authenticated
            ? [
                "QUERY_COURSE_ENROLLMENT_STATUS_SWR",
                course?.id,
                authenticated,
            ]
            : null,
        async () => {
            if (!course?.id) {
                throw new Error("Course id not found")
            }
            const data = await queryCourseEnrollmentStatus({
                variables: {
                    request: { courseId: course?.id },
                },
                getAccessToken,
                refreshAccessToken,
            })
            if (!data || !data.data) {
                throw new Error("Course enrollment status not found")
            }
            dispatch(setEnrolled(Boolean(data.data.courseEnrollmentStatus.data?.isEnrolled)))
            return data.data
        }
    )
    /** Return the SWR. */
    return swr
}
