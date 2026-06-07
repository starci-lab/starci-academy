"use client"

import {
    GraphQLHeadersKey,
    mutateReviewCv,
    type ReviewCvRequest,
} from "@/modules/api"
import { useAppSelector } from "@/redux"
import { useLocale } from "next-intl"
import useSWRMutation from "swr/mutation"

type MutateReviewCvResult = Awaited<ReturnType<typeof mutateReviewCv>>

/**
 * SWR mutation for {@link mutateReviewCv} (auth client, `X-Locale` from next-intl).
 */
export const useMutateReviewCvSwr = () => {
    const locale = useLocale()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWRMutation<MutateReviewCvResult, Error, string, ReviewCvRequest>(
        "MUTATE_REVIEW_CV_SWR",
        async (_key, { arg }) => {
            if (!authenticated) {
                throw new Error("Not authenticated")
            }
            return mutateReviewCv({
                request: arg,
                headers: {
                    [GraphQLHeadersKey.XLocale]: locale,
                },
            })
        },
    )
}
