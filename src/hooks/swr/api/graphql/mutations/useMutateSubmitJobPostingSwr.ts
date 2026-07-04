import useSWRMutation from "swr/mutation"
import { mutateSubmitJobPosting } from "@/modules/api/graphql/mutations/mutation-submit-job-posting"
import { type SubmitJobPostingRequest } from "@/modules/api/graphql/mutations/types/job-postings"

type MutateSubmitJobPostingResult = Awaited<ReturnType<typeof mutateSubmitJobPosting>>

/**
 * SWR mutation wrapper for {@link mutateSubmitJobPosting} (Bearer from Keycloak).
 */
export const useMutateSubmitJobPostingSwr = () => {
    const swr = useSWRMutation<
        MutateSubmitJobPostingResult,
        Error,
        string,
        SubmitJobPostingRequest
    >(
        "MUTATE_SUBMIT_JOB_POSTING_SWR",
        async (_key, { arg }) => {
            return mutateSubmitJobPosting({
                request: arg,
            })
        },
    )
    return swr
}
