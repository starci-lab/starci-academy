import useSWRMutation from "swr/mutation"
import { mutateUpdateCvBlocks } from "@/modules/api/graphql/mutations/mutation-update-cv-blocks"
import { type UpdateCvBlocksRequest } from "@/modules/api/graphql/mutations/types/update-cv-blocks"

type MutateUpdateCvBlocksResult = Awaited<ReturnType<typeof mutateUpdateCvBlocks>>

/**
 * SWR mutation wrapper for {@link mutateUpdateCvBlocks} — autosaves a partial
 * update (label/blocks/style) to a CV block-editor document the caller owns.
 */
export const useMutateUpdateCvBlocksSwr = () => {
    return useSWRMutation<
        MutateUpdateCvBlocksResult,
        Error,
        string,
        UpdateCvBlocksRequest
    >(
        "MUTATE_UPDATE_CV_BLOCKS_SWR",
        async (_key, { arg }) => {
            return mutateUpdateCvBlocks({
                request: arg,
            })
        },
    )
}
