import { GraphQLHeadersKey, queryModule } from "@/modules/api"
import { useKeycloak } from "@/hooks/singleton"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWR from "swr"
import { setModule } from "@/redux/slices"

/**
 * Loads module shell (`ref/queries/modules/module`).
 * Full `contents` / `lessonVideos` / `challenges` rows come from `useQueryContentsSwr` /
 * `useQueryLessonVideosSwr` / `useQueryChallengesSwr` (list queries under `ref/queries/...`).
 */
export const useQueryModuleSwrCore = () => {
    const keycloak = useKeycloak()
    const token = keycloak.data?.authenticated ? keycloak.data?.token : undefined
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const moduleId = useAppSelector((state) => state.course.moduleId)
    const courseId = useAppSelector((state) => state.course.course?.id)
    const dispatch = useAppDispatch()
    const swr = useSWR(
        enrolled && courseId
            ? [
                "QUERY_MODULE_SWR",
                moduleId,
                courseId,
                enrolled,
            ]
            : null,
        async () => {
            if (!moduleId) {
                throw new Error("Module id not found")
            }
            if (!courseId) {
                throw new Error("Course id not found")
            }
            const data = await queryModule({
                request: {
                    displayId: moduleId,
                },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: courseId,
                },
                token,
            })
            if (!data || !data.data) {
                throw new Error("Module not found")
            }
            const shell = data.data.module.data
            if (!shell) {
                throw new Error("Module not found")
            }
            dispatch(setModule(shell))
            return data.data
        },
    )

    return swr
}
