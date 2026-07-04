"use client"

import { useState } from "react"
import useSWR from "swr"
import {
    queryMyCvGenerations,
} from "@/modules/api/graphql/queries/query-my-cv-generations"
import { CvGenerationStatus } from "@/modules/types/enums/cv-generation-status"
import { useAppSelector } from "@/redux/hooks"

export const MY_CV_GENERATIONS_PAGE_SIZE = 5

/**
 * Loads AI CV generations for the current user (newest first, flat array). Polls while
 * the newest row is still in flight so a just-enqueued generation resolves in-place.
 *
 * @param enabled - Gate the fetch (e.g. only when the CV page/history is visible).
 */
export const useQueryMyCvGenerationsSwr = (enabled = true) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const [pageNumber, setPageNumber] = useState(0)
    const swr = useSWR(
        authenticated && enabled
            ? [
                "QUERY_MY_CV_GENERATIONS_SWR",
                authenticated,
                pageNumber,
            ]
            : null,
        async () => {
            const response = await queryMyCvGenerations({
                debug: false,
                request: {
                    limit: MY_CV_GENERATIONS_PAGE_SIZE,
                    offset: pageNumber * MY_CV_GENERATIONS_PAGE_SIZE,
                },
            })

            const payload = response.data?.myCvGenerations?.data
            if (!payload) {
                throw new Error("CV generations not found")
            }

            return payload
        },
        {
            refreshInterval: (data) => {
                const latest = data?.[0]
                if (
                    latest?.status === CvGenerationStatus.Pending ||
                    latest?.status === CvGenerationStatus.Processing
                ) {
                    return 3000
                }
                return 0
            },
        },
    )

    return {
        ...swr,
        pageNumber,
        setPageNumber,
        pageSize: MY_CV_GENERATIONS_PAGE_SIZE,
    }
}
