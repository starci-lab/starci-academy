"use client"
import { useLocale } from "next-intl"
import useSWRMutation from "swr/mutation"
import { GraphQLHeadersKey } from "@/modules/api/graphql/types"
import { mutateDeleteCvGeneration } from "@/modules/api/graphql/mutations/mutation-delete-cv-generation"
import { type DeleteCvGenerationRequest } from "@/modules/api/graphql/mutations/types/delete-cv-generation"
import { useAppSelector } from "@/redux/hooks"

type MutateDeleteCvGenerationResult = Awaited<ReturnType<typeof mutateDeleteCvGeneration>>

/**
 * SWR mutation for {@link mutateDeleteCvGeneration} (auth client, `X-Locale` from next-intl).
 */
export const useMutateDeleteCvGenerationSwr = () => {
    const locale = useLocale()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWRMutation<MutateDeleteCvGenerationResult, Error, string, DeleteCvGenerationRequest>(
        "MUTATE_DELETE_CV_GENERATION_SWR",
        async (_key, { arg }) => {
            if (!authenticated) {
                throw new Error("Not authenticated")
            }
            return mutateDeleteCvGeneration({
                request: arg,
                headers: {
                    [GraphQLHeadersKey.XLocale]: locale,
                },
            })
        },
    )
}
