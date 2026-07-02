"use client"
import { useLocale } from "next-intl"
import useSWRMutation from "swr/mutation"
import { GraphQLHeadersKey } from "@/modules/api/graphql/types"
import { mutateGenerateCv } from "@/modules/api/graphql/mutations/mutation-generate-cv"
import { type GenerateCvRequest } from "@/modules/api/graphql/mutations/types/generate-cv"
import { useAppSelector } from "@/redux/hooks"

type MutateGenerateCvResult = Awaited<ReturnType<typeof mutateGenerateCv>>

/**
 * SWR mutation for {@link mutateGenerateCv} (auth client, `X-Locale` from next-intl).
 */
export const useMutateGenerateCvSwr = () => {
    const locale = useLocale()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWRMutation<MutateGenerateCvResult, Error, string, GenerateCvRequest>(
        "MUTATE_GENERATE_CV_SWR",
        async (_key, { arg }) => {
            if (!authenticated) {
                throw new Error("Not authenticated")
            }
            return mutateGenerateCv({
                request: arg,
                headers: {
                    [GraphQLHeadersKey.XLocale]: locale,
                },
            })
        },
    )
}
