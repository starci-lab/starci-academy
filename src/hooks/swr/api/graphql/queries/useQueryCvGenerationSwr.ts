"use client"

import useSWR from "swr"
import { queryCvGeneration } from "@/modules/api/graphql/queries/query-cv-generation"
import { CvGenerationStatus } from "@/modules/types/enums/cv-generation-status"
import { useAppSelector } from "@/redux/hooks"

/**
 * Fetches (and polls) a single AI CV generation by id until it reaches a terminal
 * state (`Done`/`Failed`). Pass `undefined` to disable the fetch (no active generation).
 *
 * @param cvGenerationId - `cv_generations.id` to poll, or `undefined` to skip.
 */
export const useQueryCvGenerationSwr = (cvGenerationId?: string) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const swr = useSWR(
        authenticated && cvGenerationId
            ? [
                "QUERY_CV_GENERATION_SWR",
                authenticated,
                cvGenerationId,
            ]
            : null,
        async () => {
            const response = await queryCvGeneration({
                debug: false,
                request: { id: cvGenerationId as string },
            })
            const wrapped = response.data?.cvGeneration
            if (!wrapped) {
                throw new Error("CV generation query failed")
            }
            if (!wrapped.success) {
                throw new Error(wrapped.error || wrapped.message || "CV generation query failed")
            }
            return wrapped.data ?? null
        },
        {
            // Poll while the generation is still in flight; stop once terminal.
            refreshInterval: (data) => {
                if (
                    data?.status === CvGenerationStatus.Pending ||
                    data?.status === CvGenerationStatus.Processing
                ) {
                    return 3000
                }
                return 0
            },
        },
    )

    return swr
}
