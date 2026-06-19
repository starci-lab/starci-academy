import {
    GraphQLHeadersKey,
    mutateAskContentAi,
    type AskContentAiRequest,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"
import { useAppSelector } from "@/redux"

type MutateAskContentAiResult = Awaited<ReturnType<typeof mutateAskContentAi>>

/**
 * SWR mutation wrapper for {@link mutateAskContentAi}.
 * Pass `{ contentId, question }` as arg; returns the answer envelope.
 */
export const useMutateAskContentAiSwr = () => {
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const swr = useSWRMutation<
        MutateAskContentAiResult,
        Error,
        string,
        AskContentAiRequest
    >(
        "MUTATE_ASK_CONTENT_AI_SWR",
        async (_key, { arg }) => {
            if (!courseId) {
                throw new Error("Course id not found")
            }
            return mutateAskContentAi({
                request: arg,
                headers: {
                    [GraphQLHeadersKey.XCourseId]: courseId,
                },
            })
        }
    )
    return swr
}
