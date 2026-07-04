import { createAuthApolloClient } from "../clients"
import {
    type QueryParams,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type {
    CvGenerationRequest,
    QueryCvGenerationResponse,
} from "./types/cv-generation"

const query1 = gql`
  query CvGeneration($request: CvGenerationRequest!) {
    cvGeneration(request: $request) {
      success
      message
      error
      data {
        id
        mode
        status
        source
        score
        label
        courseId
        targetRole
        language
        sourceCvSubmissionId
        latexSource
        extraPrompts
        structuredData
        errorMessage
        processedAt
        createdAt
      }
    }
  }
`

export enum QueryCvGeneration {
    Query1 = "query1",
}

const queryMap: Record<QueryCvGeneration, DocumentNode> = {
    [QueryCvGeneration.Query1]: query1,
}

/**
 * Fetches a single AI CV generation by id (poll until `status` is `Done`).
 */
export const queryCvGeneration = async ({
    query = QueryCvGeneration.Query1,
    request,
    debug,
    signal,
    headers,
}: QueryParams<QueryCvGeneration, CvGenerationRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
        headers,
    })

    return apollo.query<QueryCvGenerationResponse>({
        query: queryMap[query],
        variables: { request },
        fetchPolicy: "no-cache",
    })
}
