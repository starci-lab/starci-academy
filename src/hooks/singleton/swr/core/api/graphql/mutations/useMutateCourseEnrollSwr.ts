import { useKeycloak } from "@/hooks/singleton"
import {
    mutateCourseEnroll,
    type MutateCourseEnrollVariables,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutateCourseEnrollResult = Awaited<ReturnType<typeof mutateCourseEnroll>>

/**
 * SWR mutation wrapper for {@link mutateCourseEnroll} (Bearer from Keycloak).
 */
export const useMutateCourseEnrollSwrCore = () => {
    const keycloak = useKeycloak()
    const getAccessToken = () =>
        keycloak.data?.authenticated ? keycloak.data?.token : undefined
    const refreshAccessToken = async (minValiditySeconds = 30) =>
        (await keycloak.data?.updateToken(minValiditySeconds)) ?? false
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateCourseEnrollResult,
        Error,
        string,
        MutateCourseEnrollVariables
    >(
        "MUTATE_COURSE_ENROLL_SWR",
        async (_key, { arg }) => {
            if (!keycloak.data?.authenticated) {
                throw new Error("Not authenticated")
            }
            return mutateCourseEnroll({
                variables: arg,
                getAccessToken,
                refreshAccessToken,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
