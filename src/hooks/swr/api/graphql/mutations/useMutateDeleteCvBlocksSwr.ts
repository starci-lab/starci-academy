"use client"
import { useLocale } from "next-intl"
import useSWRMutation from "swr/mutation"
import { GraphQLHeadersKey } from "@/modules/api/graphql/types"
import { mutateDeleteCvBlocks } from "@/modules/api/graphql/mutations/mutation-delete-cv-blocks"
import { type DeleteCvBlocksRequest } from "@/modules/api/graphql/mutations/types/delete-cv-blocks"
import { useAppSelector } from "@/redux/hooks"

type MutateDeleteCvBlocksResult = Awaited<ReturnType<typeof mutateDeleteCvBlocks>>

/**
 * SWR mutation for {@link mutateDeleteCvBlocks} (auth client, `X-Locale` from next-intl).
 */
export const useMutateDeleteCvBlocksSwr = () => {
    const locale = useLocale()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWRMutation<MutateDeleteCvBlocksResult, Error, string, DeleteCvBlocksRequest>(
        "MUTATE_DELETE_CV_BLOCKS_SWR",
        async (_key, { arg }) => {
            if (!authenticated) {
                throw new Error("Not authenticated")
            }
            return mutateDeleteCvBlocks({
                request: arg,
                headers: {
                    [GraphQLHeadersKey.XLocale]: locale,
                },
            })
        },
    )
}
