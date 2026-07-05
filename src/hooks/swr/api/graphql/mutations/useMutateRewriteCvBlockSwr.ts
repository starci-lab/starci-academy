import useSWRMutation from "swr/mutation"
import { mutateRewriteCvBlock } from "@/modules/api/graphql/mutations/mutation-rewrite-cv-block"
import { type RewriteCvBlockRequest } from "@/modules/api/graphql/mutations/types/rewrite-cv-block"

type MutateRewriteCvBlockResult = Awaited<ReturnType<typeof mutateRewriteCvBlock>>

/**
 * SWR mutation wrapper for {@link mutateRewriteCvBlock} — the "✨ AI viết
 * giúp" per-block rewrite. Each block editor keeps its OWN call/spinner (this
 * hook is instantiated per block-in-flight, never shared), so one block's AI
 * failure never blocks the rest of the form.
 */
export const useMutateRewriteCvBlockSwr = () => {
    return useSWRMutation<
        MutateRewriteCvBlockResult,
        Error,
        string,
        RewriteCvBlockRequest
    >(
        "MUTATE_REWRITE_CV_BLOCK_SWR",
        async (_key, { arg }) => {
            return mutateRewriteCvBlock({
                request: arg,
            })
        },
    )
}
