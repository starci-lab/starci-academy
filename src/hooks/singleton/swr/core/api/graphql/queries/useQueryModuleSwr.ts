import { GraphQLHeadersKey, queryModule } from "@/modules/api"
import { useKeycloakZustand } from "@/hooks/zustand"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWR from "swr"
import { setModule } from "@/redux/slices"

/**
 * Loads module shell (`ref/queries/modules/module`).
 * Full `contents` / `lessonVideos` / `challenges` rows come from `useQueryContentsSwr` /
 * `useQueryLessonVideosSwr` / `useQueryChallengesSwr` (list queries under `ref/queries/...`).
 */
export const useQueryModuleSwrCore = () => {
    const keycloak = useKeycloakZustand()
    const getAccessToken = () =>
        keycloak.authenticated ? keycloak.token : undefined
    const refreshAccessToken = async (minValiditySeconds = 30) =>
        (await keycloak.updateToken(minValiditySeconds)) ?? false
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const displayId = useAppSelector((state) => state.module.displayId)
    const id = useAppSelector((state) => state.module.id)
    const course = useAppSelector((state) => state.course.entity)
    const dispatch = useAppDispatch()
    const swr = useSWR(
        enrolled && (id || displayId)
            ? [
                "QUERY_MODULE_SWR",
                id,
                displayId,
                course?.id,
                enrolled,
            ]
            : null,
        async () => {
            if (!id && !displayId) {
                throw new Error("Module id not found")
            }
            if (!course?.id) {
                throw new Error("Course id not found")
            }
            const data = await queryModule({
                request: {
                    id,
                    displayId,
                },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course?.id,
                },
                getAccessToken,
                refreshAccessToken,
            })
            if (!data || !data.data) {
                throw new Error("Module not found")
            }
            dispatch(setModule(data.data.module.data))
            return data.data
        },
    )

    return swr
}
