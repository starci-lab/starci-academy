import useSWRMutation from "swr/mutation"
import { mutateCreateCvBlocks } from "@/modules/api/graphql/mutations/mutation-create-cv-blocks"
import { type CreateCvBlocksRequest } from "@/modules/api/graphql/mutations/types/create-cv-blocks"

type MutateCreateCvBlocksResult = Awaited<ReturnType<typeof mutateCreateCvBlocks>>

/**
 * SWR mutation wrapper for {@link mutateCreateCvBlocks} — creates a new CV
 * block-editor document (`cv_blocks` row) owned by the caller.
 */
export const useMutateCreateCvBlocksSwr = () => {
    return useSWRMutation<
        MutateCreateCvBlocksResult,
        Error,
        string,
        CreateCvBlocksRequest | undefined
    >(
        "MUTATE_CREATE_CV_BLOCKS_SWR",
        async (_key, { arg }) => {
            return mutateCreateCvBlocks({
                request: arg,
            })
        },
    )
}
