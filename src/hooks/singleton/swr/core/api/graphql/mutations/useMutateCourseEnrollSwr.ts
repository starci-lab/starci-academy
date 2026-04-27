import { useKeycloakZustand } from "@/hooks/zustand"
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
    const keycloak = useKeycloakZustand()
    const getAccessToken = () =>
        keycloak.authenticated ? keycloak.token : undefined
    const refreshAccessToken = async (minValiditySeconds = 30) =>
        (await keycloak.updateToken(minValiditySeconds)) ?? false
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateCourseEnrollResult,
        Error,
        string,
        CourseEnrollRequest
    >(
        "MUTATE_COURSE_ENROLL_SWR",
        async (_key, { arg }) => {
            if (!keycloak.authenticated) {
                throw new Error("Not authenticated")
            }
            return mutateCourseEnroll({
                request: arg,
                getAccessToken,
                refreshAccessToken,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
