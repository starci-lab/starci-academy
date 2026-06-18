import {
    mutatePinCourseProject,
    type PinCourseProjectRequest,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutatePinCourseProjectResult = Awaited<ReturnType<typeof mutatePinCourseProject>>

/**
 * SWR mutation wrapper for {@link mutatePinCourseProject} (Bearer from Keycloak).
 */
export const useMutatePinCourseProjectSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutatePinCourseProjectResult,
        Error,
        string,
        PinCourseProjectRequest
    >(
        "MUTATE_PIN_COURSE_PROJECT_SWR",
        async (_key, { arg }) => {
            return mutatePinCourseProject({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
