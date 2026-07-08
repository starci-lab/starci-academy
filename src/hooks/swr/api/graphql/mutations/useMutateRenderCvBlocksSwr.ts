import useSWRMutation from "swr/mutation"
import { mutateRenderCvBlocks } from "@/modules/api/graphql/mutations/mutation-render-cv-blocks"
import { type RenderCvBlocksRequest } from "@/modules/api/graphql/mutations/types/render-cv-blocks"

type MutateRenderCvBlocksResult = Awaited<ReturnType<typeof mutateRenderCvBlocks>>

/**
 * SWR mutation wrapper for {@link mutateRenderCvBlocks} — renders a CV
 * document to PDF (feeds the live preview pane, debounced, and the "Tải PDF"
 * download button).
 */
export const useMutateRenderCvBlocksSwr = () => {
    return useSWRMutation<
        MutateRenderCvBlocksResult,
        Error,
        string,
        RenderCvBlocksRequest
    >(
        "MUTATE_RENDER_CV_BLOCKS_SWR",
        async (_key, { arg }) => {
            return mutateRenderCvBlocks({
                request: arg,
            })
        },
    )
}
