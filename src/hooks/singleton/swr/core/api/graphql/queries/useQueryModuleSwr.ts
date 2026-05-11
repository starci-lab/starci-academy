import { GraphQLHeadersKey, queryModule } from "@/modules/api"
import { useAppDispatch, useAppSelector } from "@/redux"
import useSWR from "swr"
import { setModule } from "@/redux/slices"

/**
 * Loads module shell (`ref/queries/modules/module`).
 * Full `contents` / `lessonVideos` / `challenges` rows come from `useQueryContentsSwr` /
 * `useQueryLessonVideosSwr` / `useQueryChallengesSwr` (list queries under `ref/queries/...`).
 */
export const useQueryModuleSwrCore = () => {
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const id = useAppSelector((state) => state.module.id)
    const course = useAppSelector((state) => state.course.entity)
    const dispatch = useAppDispatch()
    const swr = useSWR(
        enrolled && id && course?.id
            ? [
                "QUERY_MODULE_SWR",
                id,
                course?.id,
                enrolled,
            ]
            : null,
        async () => {
            if (!id) {
                throw new Error("Module id not found")
            }
            const data = await queryModule({
                request: {
                    id,
                },
                headers: {
                    [GraphQLHeadersKey.XCourseId]: course?.id,
                },
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
