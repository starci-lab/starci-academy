import {
    GraphQLHeadersKey,
    mutateSyncIdealText,
    type SyncIdealTextRequest,
} from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWRMutation from "swr/mutation"

type MutateSyncIdealTextResult = Awaited<
    ReturnType<typeof mutateSyncIdealText>
>

/**
 * SWR mutation for {@link mutateSyncIdealText} (`X-Course-Id` from Redux).
 */
export const useMutateSyncIdealTextSwrCore = () => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const swr = useSWRMutation<
        MutateSyncIdealTextResult,
        Error,
        string,
        SyncIdealTextRequest
    >(
        "MUTATE_SYNC_IDEAL_TEXT_SWR",
        async (_key, { arg }) => {
            if (!authenticated) {
                throw new Error("Not authenticated")
            }
            if (!courseId) {
                throw new Error("Course id not found")
            }
            return mutateSyncIdealText({
                request: arg,
                headers: {
                    [GraphQLHeadersKey.XCourseId]: courseId,
                },
            })
        },
    )
    return swr
}
