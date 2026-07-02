"use client"
import { useLocale } from "next-intl"
import useSWRMutation from "swr/mutation"
import { GraphQLHeadersKey } from "@/modules/api/graphql/types"
import { mutateReviseCv } from "@/modules/api/graphql/mutations/mutation-revise-cv"
import { type ReviseCvRequest } from "@/modules/api/graphql/mutations/types/revise-cv"
import { useAppSelector } from "@/redux/hooks"

type MutateReviseCvResult = Awaited<ReturnType<typeof mutateReviseCv>>

/**
 * SWR mutation for {@link mutateReviseCv} (auth client, `X-Locale` from next-intl).
 */
export const useMutateReviseCvSwr = () => {
    const locale = useLocale()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWRMutation<MutateReviseCvResult, Error, string, ReviseCvRequest>(
        "MUTATE_REVISE_CV_SWR",
        async (_key, { arg }) => {
            if (!authenticated) {
                throw new Error("Not authenticated")
            }
            return mutateReviseCv({
                request: arg,
                headers: {
                    [GraphQLHeadersKey.XLocale]: locale,
                },
            })
        },
    )
}
