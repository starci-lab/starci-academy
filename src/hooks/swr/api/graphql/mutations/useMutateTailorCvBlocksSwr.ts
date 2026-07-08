import useSWRMutation from "swr/mutation"
import { mutateTailorCvBlocks } from "@/modules/api/graphql/mutations/mutation-tailor-cv-blocks"
import { type TailorCvBlocksRequest } from "@/modules/api/graphql/mutations/types/tailor-cv-blocks"

type MutateTailorCvBlocksResult = Awaited<ReturnType<typeof mutateTailorCvBlocks>>

/**
 * SWR mutation wrapper for {@link mutateTailorCvBlocks} — AI-adjusts the CV's
 * blocks toward a pasted job description (ingest path, not persisted; caller
 * loads the result into the editor and autosaves it like any other edit).
 */
export const useMutateTailorCvBlocksSwr = () => {
    return useSWRMutation<
        MutateTailorCvBlocksResult,
        Error,
        string,
        TailorCvBlocksRequest
    >(
        "MUTATE_TAILOR_CV_BLOCKS_SWR",
        async (_key, { arg }) => {
            return mutateTailorCvBlocks({
                request: arg,
            })
        },
    )
}
