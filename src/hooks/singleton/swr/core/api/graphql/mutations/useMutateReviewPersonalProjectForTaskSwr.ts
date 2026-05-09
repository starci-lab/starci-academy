import {
    GraphQLHeadersKey,
    mutateReviewPersonalProjectForTask,
    type ReviewPersonalProjectForTaskRequest,
} from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWRMutation from "swr/mutation"

type MutateReviewPersonalProjectForTaskResult = Awaited<
    ReturnType<typeof mutateReviewPersonalProjectForTask>
>

/**
 * SWR mutation for queueing personal project review task.
 */
export const useMutateReviewPersonalProjectForTaskSwrCore = () => {
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const swr = useSWRMutation<
        MutateReviewPersonalProjectForTaskResult,
        Error,
        string,
        ReviewPersonalProjectForTaskRequest
    >(
        "MUTATE_REVIEW_PERSONAL_PROJECT_FOR_TASK_SWR",
        async (_key, { arg }) => {
            if (!authenticated) {
                throw new Error("Not authenticated")
            }
            if (!courseId) {
                throw new Error("Course id not found")
            }
            return mutateReviewPersonalProjectForTask({
                request: arg,
                headers: {
                    [GraphQLHeadersKey.XCourseId]: courseId,
                },
            })
        },
    )
    return swr
}
