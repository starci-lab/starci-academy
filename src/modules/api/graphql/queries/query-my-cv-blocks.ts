import { createAuthApolloClient } from "../clients"
import {
    type QueryParams,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type {
    QueryMyCvBlocksResponse,
} from "./types/cv-blocks"

const query1 = gql`
  query MyCvBlocks {
    myCvBlocks {
      success
      message
      error
      data {
        id
        label
        blocks
        style
        pdfCdnKey
        texSource
        createdAt
        updatedAt
      }
    }
  }
`

export enum QueryMyCvBlocks {
    Query1 = "query1",
}

const queryMap: Record<QueryMyCvBlocks, DocumentNode> = {
    [QueryMyCvBlocks.Query1]: query1,
}

/**
 * Loads every CV block-editor document (`cv_blocks`) the signed-in user owns,
 * newest first. Feeds the document-tab selector in the block editor workspace.
 */
export const queryMyCvBlocks = async ({
    query = QueryMyCvBlocks.Query1,
    debug,
    signal,
    headers,
}: QueryParams<QueryMyCvBlocks, undefined>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
        headers,
    })

    return apollo.query<QueryMyCvBlocksResponse>({
        query: queryMap[query],
        fetchPolicy: "no-cache",
    })
}
