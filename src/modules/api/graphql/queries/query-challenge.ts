import type { ChallengeEntity } from "@/modules/types"
import { createAuthApolloClient } from "../clients"
import { type GraphQLResponse, type QueryParams } from "../types"
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
    debug,
    signal,
}: QueryParams<QueryChallenge, ChallengeRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    }
    )
    return apollo.query<QueryChallengeResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
