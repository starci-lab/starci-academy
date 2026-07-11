import useSWR from "swr"
import { queryRagPlaygroundSamples } from "@/modules/api/graphql/queries/query-rag-playground-samples"
import type { RagPlaygroundSample } from "@/modules/api/graphql/queries/types/rag-playground-samples"

/**
 * Loads the public RAG Playground's built-in sample catalog for the Sample
 * tab's picker. Public — works for anonymous viewers.
 */
export const useQueryRagPlaygroundSamplesSwr = () => {
    const swr = useSWR<Array<RagPlaygroundSample>>(
        ["QUERY_RAG_PLAYGROUND_SAMPLES_SWR"],
        async () => {
            const { data } = await queryRagPlaygroundSamples({})
            const envelope = data?.ragPlaygroundSamples
            const inner = envelope?.data
            if (!envelope?.success || !inner) {
                throw new Error(
                    envelope?.error ?? envelope?.message ?? "RAG Playground samples not found",
                )
            }
            return inner
        },
    )
    return swr
}
