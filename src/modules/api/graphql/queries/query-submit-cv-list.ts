import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const query1 = gql`
  query CvReviewHistory {
    cvReviewHistory {
      data {
        cvSubmissionId
        data {
          attemptId
          attemptNumber
          fileUrl
          submittedAt
          status
          feedback
          score
        }
      }
    }
  }
`

export enum QueryCvReviewHistory {
  Query1 = "query1",
}

const queryMap: Record<QueryCvReviewHistory, DocumentNode> = {
    [QueryCvReviewHistory.Query1]: query1,
}

export interface CvReviewHistoryItemPayload {
    attemptId: string
    attemptNumber: number
    fileUrl: string
    submittedAt: string
    status: string
    feedback: string | null
    score: number | null
}

export interface CvReviewHistoryDataPayload {
    cvSubmissionId: string
  data: Array<CvReviewHistoryItemPayload>
}

export interface CvReviewHistoryResponsePayload {
    data: CvReviewHistoryDataPayload
}

export interface QueryCvReviewHistoryResponse {
  cvReviewHistory: CvReviewHistoryResponsePayload;
}

export const queryCvReviewHistory = async ({
    query = QueryCvReviewHistory.Query1,
    debug,
    signal,
}: QueryParams<QueryCvReviewHistory>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.query<QueryCvReviewHistoryResponse>({
        query: queryMap[query],
        fetchPolicy: "no-cache",
    })
}
