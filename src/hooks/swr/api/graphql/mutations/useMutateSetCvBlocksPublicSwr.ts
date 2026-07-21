import useSWRMutation from "swr/mutation"
import { mutateSetCvBlocksPublic } from "@/modules/api/graphql/mutations/mutation-set-cv-blocks-public"
import { type SetCvBlocksPublicRequest } from "@/modules/api/graphql/mutations/types/set-cv-blocks-public"

type MutateSetCvBlocksPublicResult = Awaited<ReturnType<typeof mutateSetCvBlocksPublic>>

/**
 * SWR mutation wrapper for {@link mutateSetCvBlocksPublic} — flags one CV as the
 * user's public résumé (single-public-per-user, BE-enforced). After triggering,
 * refetch `myCvBlocks` so the whole set reflects the new state (turning one on
 * turns the others off).
 */
export const useMutateSetCvBlocksPublicSwr = () => {
    return useSWRMutation<
        MutateSetCvBlocksPublicResult,
        Error,
        string,
        SetCvBlocksPublicRequest
    >(
        "MUTATE_SET_CV_BLOCKS_PUBLIC_SWR",
        async (_key, { arg }) => {
            return mutateSetCvBlocksPublic({
                request: arg,
            })
        },
    )
}
