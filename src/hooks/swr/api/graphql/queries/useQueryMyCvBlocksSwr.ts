"use client"

import useSWR from "swr"
import {
    queryMyCvBlocks,
} from "@/modules/api/graphql/queries/query-my-cv-blocks"
import { useAppSelector } from "@/redux/hooks"

/**
 * Loads every CV block-editor document (`cv_blocks`) the signed-in user owns
 * (newest first) — the document-tab data source for the CV block editor
 * workspace (`CvBlocksWorkspace`).
 *
 * @param enabled - Gate the fetch (e.g. only when the block editor is visible).
 */
export const useQueryMyCvBlocksSwr = (enabled = true) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const swr = useSWR(
        authenticated && enabled
            ? [
                "QUERY_MY_CV_BLOCKS_SWR",
                authenticated,
            ]
            : null,
        async () => {
            const response = await queryMyCvBlocks({
                debug: false,
            })

            const payload = response.data?.myCvBlocks?.data
            if (!payload) {
                throw new Error("CV blocks not found")
            }

            return payload
        },
    )

    return swr
}
