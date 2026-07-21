import useSWRMutation from "swr/mutation"
import { mutateSetContentAiSessionArchived } from "@/modules/api/graphql/mutations/mutation-set-content-ai-session-archived"
import { type SetContentAiSessionArchivedRequest } from "@/modules/api/graphql/mutations/types/set-content-ai-session-archived"

type MutateSetContentAiSessionArchivedResult = Awaited<ReturnType<typeof mutateSetContentAiSessionArchived>>

/**
 * SWR mutation wrapper for {@link mutateSetContentAiSessionArchived}.
 * Pass `{ sessionId, archived }` as arg; archived conversations drop from the
 * default list but stay searchable.
 */
export const useMutateSetContentAiSessionArchivedSwr = () => {
    const swr = useSWRMutation<
        MutateSetContentAiSessionArchivedResult,
        Error,
        string,
        SetContentAiSessionArchivedRequest
    >(
        "MUTATE_SET_CONTENT_AI_SESSION_ARCHIVED_SWR",
        async (_key, { arg }) => {
            return mutateSetContentAiSessionArchived({
                request: arg,
            })
        },
    )
    return swr
}
