import useSWRMutation from "swr/mutation"
import { mutateAskRagPlayground } from "@/modules/api/graphql/mutations/mutation-ask-rag-playground"
import { type AskRagPlaygroundRequest } from "@/modules/api/graphql/mutations/types/ask-rag-playground"

type MutateAskRagPlaygroundResult = Awaited<
    ReturnType<typeof mutateAskRagPlayground>
>

/**
 * SWR mutation for {@link mutateAskRagPlayground}. PUBLIC — the RAG
 * Playground is an anonymous marketing demo, no auth check here.
 */
export const useMutateAskRagPlaygroundSwr = () => {
    return useSWRMutation<
        MutateAskRagPlaygroundResult,
        Error,
        string,
        AskRagPlaygroundRequest
    >(
        "MUTATE_ASK_RAG_PLAYGROUND_SWR",
        async (_key, { arg }) => mutateAskRagPlayground({ request: arg }),
    )
}
