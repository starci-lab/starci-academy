"use client"
import { useLocale } from "next-intl"
import useSWRMutation from "swr/mutation"
import { GraphQLHeadersKey } from "@/modules/api/graphql/types"
import { mutateUploadCv } from "@/modules/api/graphql/mutations/mutation-upload-cv"
import { type UploadCvRequest } from "@/modules/api/graphql/mutations/types/upload-cv"
import { useAppSelector } from "@/redux/hooks"

type MutateUploadCvResult = Awaited<ReturnType<typeof mutateUploadCv>>

/**
 * SWR mutation for {@link mutateUploadCv} (auth client, `X-Locale` from next-intl).
 * Registers an already-uploaded CV into the unified table and enqueues scoring.
 */
export const useMutateUploadCvSwr = () => {
    const locale = useLocale()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWRMutation<MutateUploadCvResult, Error, string, UploadCvRequest>(
        "MUTATE_UPLOAD_CV_SWR",
        async (_key, { arg }) => {
            if (!authenticated) {
                throw new Error("Not authenticated")
            }
            return mutateUploadCv({
                request: arg,
                headers: {
                    [GraphQLHeadersKey.XLocale]: locale,
                },
            })
        },
    )
}
