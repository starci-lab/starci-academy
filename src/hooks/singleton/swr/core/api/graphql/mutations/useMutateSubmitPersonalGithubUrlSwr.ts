import {
    GraphQLHeadersKey,
    mutateSubmitPersonalGithubUrl,
    type SubmitPersonalGithubUrlRequest,
} from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWRMutation from "swr/mutation"

type MutateSubmitPersonalGithubUrlResult = Awaited<
    ReturnType<typeof mutateSubmitPersonalGithubUrl>
>

/**
 * SWR mutation for submitting personal project GitHub URL.
 */
export const useMutateSubmitPersonalGithubUrlSwrCore = () => {
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const swr = useSWRMutation<
        MutateSubmitPersonalGithubUrlResult,
        Error,
        string,
        SubmitPersonalGithubUrlRequest
    >(
        "MUTATE_SUBMIT_PERSONAL_GITHUB_URL_SWR",
        async (_key, { arg }) => {
            if (!authenticated) {
                throw new Error("Not authenticated")
            }
            if (!courseId) {
                throw new Error("Course id not found")
            }
            return mutateSubmitPersonalGithubUrl({
                request: arg,
                headers: {
                    [GraphQLHeadersKey.XCourseId]: courseId,
                },
            })
        },
    )
    return swr
}
