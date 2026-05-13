import { createAuthApolloClient } from "../clients"
import {
    type GraphQLResponse,
    type QueryParams,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

/**
 * Payload of the `cvUrl` GraphQL query (`CvUrlViewData` on the server).
 */
export interface CvUrlViewData {
    /** cv_submissions.id */  
    id: string
    /** Aggregate submission status. */
    status: string
    /** Presigned GET or absolute URL to open the CV PDF; null when no file. */
    cvUrl: string
    /** TTL in seconds for presigned cvUrl (e.g. 900 for 15 minutes); 0 if cvUrl is null or not presigned. */
    cvUrlExpiresInSeconds: number
    /** Full AI review (markdown) on the latest attempt after analyze. */
    detailFeedback?: string | null
}

const query1 = gql`
  query CvUrl {
    cvUrl {
      success
      message
      error
      data {
        id
        status
        cvUrl
        cvUrlExpiresInSeconds
        detailFeedback
      }
    }
  }
`

export enum QueryCvUrl {
    Query1 = "query1",
}

const queryMap: Record<QueryCvUrl, DocumentNode> = {
    [QueryCvUrl.Query1]: query1,
}

export interface QueryCvUrlResponse {
    cvUrl: GraphQLResponse<CvUrlViewData | null>
}

/**
 * Fetches presigned CV view URL for the authenticated user (Keycloak bearer).
 */
export const queryCvUrl = async ({
    query = QueryCvUrl.Query1,
    debug,
    signal,
    headers,
}: QueryParams<QueryCvUrl, undefined>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
        headers
    })

    return apollo.query<QueryCvUrlResponse>({
        query: queryMap[query],
    })
}
