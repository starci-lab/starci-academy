import type { ChallengeEntity } from "@/modules/types"
import { createApolloClient } from "../clients"
import type { GraphQLResponse, QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const query1 = gql`
  query Challenge($request: ChallengeRequest!) {
    challenge(request: $request) {
      success
      message
      error
      data {
        id
        title
        requirements
        description
        score
        difficulty
        orderIndex
        steps {
          id
          title
          body
          orderIndex
        }
        submissions {
          id
          type
          title
          description
          orderIndex
          userSubmission {
            submissionUrl
          }
        }
        references {
          id
          alias
          url
          orderIndex
        }
      }
    }
  }
`

export enum QueryChallenge {
    Query1 = "query1",
}

const queryMap: Record<QueryChallenge, DocumentNode> = {
    [QueryChallenge.Query1]: query1,
}

export interface QueryChallengeResponse {
    challenge: GraphQLResponse<ChallengeEntity>
}

export interface ChallengeRequest {
    id: string
}

/**
 * One challenge by id with steps, inputs, references (`ref/queries/challenges`).
 */
export const queryChallenge = async ({
    query = QueryChallenge.Query1,
    request,
    headers,
    token,
    getAccessToken,
    refreshAccessToken,
    minValiditySeconds,
    debug,
}: QueryParams<QueryChallenge, ChallengeRequest>) => {
    const hasAuth = Boolean(token) || Boolean(getAccessToken)
    const apollo = createApolloClient(
        {
            auth: hasAuth,
            cache: false,
            token,
            getAccessToken,
            refreshAccessToken,
            minValiditySeconds,
            headers,
            debug,
        }
    )
    return apollo.query<QueryChallengeResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
