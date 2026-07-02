import useSWRMutation from "swr/mutation"
import { mutateIndexRagPlayground } from "@/modules/api/graphql/mutations/mutation-index-rag-playground"
import { type IndexRagPlaygroundRequest } from "@/modules/api/graphql/mutations/types/index-rag-playground"

type MutateIndexRagPlaygroundResult = Awaited<
    ReturnType<typeof mutateIndexRagPlayground>
>

/**
 * SWR mutation for {@link mutateIndexRagPlayground}. PUBLIC — the RAG
 * Playground is an anonymous marketing demo, no auth check here.
 */
export const useMutateIndexRagPlaygroundSwr = () => {
    return useSWRMutation<
        MutateIndexRagPlaygroundResult,
        Error,
        string,
        IndexRagPlaygroundRequest
    >(
        "MUTATE_INDEX_RAG_PLAYGROUND_SWR",
        async (_key, { arg }) => mutateIndexRagPlayground({ request: arg }),
    )
}
