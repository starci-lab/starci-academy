import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryPublicUserCvResponse } from "./types/public-user-cv"

/** Variables for the `publicUserCv` query. */
export interface QueryPublicUserCvRequest {
    /** Username of the profile whose PUBLIC CV to fetch. */
    username: string
}

const query1 = gql`
  query PublicUserCv($username: String!) {
    publicUserCv(username: $username) {
      success
      message
      error
      data {
        id
        label
        pdfUrl
        updatedAt
      }
    }
  }
`

export enum QueryPublicUserCv {
    Query1 = "query1",
}

const queryMap: Record<QueryPublicUserCv, DocumentNode> = {
    [QueryPublicUserCv.Query1]: query1,
}

/**
 * Fetches the ONE CV a user has flagged public (read-only, PDF-only) by username
 * via Apollo. Public read — works for anonymous viewers. `data` is `null` when
 * the user has no public CV; when present its `pdfUrl` is `null` until the CV has
 * been compiled once.
 */
export const queryPublicUserCv = async ({
    query = QueryPublicUserCv.Query1,
    request,
    debug,
    signal,
}: QueryParams<QueryPublicUserCv, QueryPublicUserCvRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })
    return apollo.query<QueryPublicUserCvResponse>({
        query: queryMap[query],
        variables: {
            username: request?.username,
        },
    })
}
