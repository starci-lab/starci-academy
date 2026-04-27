import { createApolloClient } from "../clients"
import { withAbortContext, type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const query1 = gql`
  query SubmitCvPresignedUrl($request: SubmitCvPresignedUrlRequest!) {
    SubmitCvPresignedUrl(request: $request) {
      url
      cvSubmissionId
      cvSubmissionAttemptId
    }
  }
`

export enum QuerySubmitCvPresignedUrl {
  Query1 = "query1",
}

const queryMap: Record<QuerySubmitCvPresignedUrl, DocumentNode> = {
    [QuerySubmitCvPresignedUrl.Query1]: query1,
}

export interface QuerySubmitCvPresignedUrlRequest {
  fileName: string;
}

export interface SubmitCvPresignedUrlPayload {
  url: string;
  cvSubmissionId: string;
  cvSubmissionAttemptId: string;
}

export interface QuerySubmitCvPresignedUrlResponse {
  SubmitCvPresignedUrl: SubmitCvPresignedUrlPayload;
}

export const querySubmitCvPresignedUrl = async ({
    query = QuerySubmitCvPresignedUrl.Query1,
    request,
    token,
    getAccessToken,
    refreshAccessToken,
    minValiditySeconds,
    debug,
    signal,
}: QueryParams<
  QuerySubmitCvPresignedUrl,
  QuerySubmitCvPresignedUrlRequest
>) => {
    const hasAuth = Boolean(token) || Boolean(getAccessToken)
    const apollo = createApolloClient({
        auth: hasAuth,
        cache: false,
        token,
        getAccessToken,
        refreshAccessToken,
        minValiditySeconds,
        debug,
    })

    return apollo.query<QuerySubmitCvPresignedUrlResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
        fetchPolicy: "no-cache",
        ...withAbortContext(signal),
    })
}
