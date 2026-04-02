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
        brief
        description
        score
        difficulty
        thumbnailUrl
        orderIndex
        defaultLocale
        translations {
          id
          challengeId
          locale
          field
          value
        }
        steps {
          id
          title
          description
          body
          orderIndex
          defaultLocale
          translations {
            challengeStepId
            locale
            field
            value
          }
        }
        inputs {
          id
          description
          orderIndex
          defaultLocale
          translations {
            id
            challengeInputId
            locale
            field
            value
          }
        }
        references {
          id
          alias
          url
          orderIndex
          defaultLocale
          translations {
            id
            challengeReferenceId
            locale
            field
            value
          }
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
}: QueryParams<QueryChallenge, ChallengeRequest>) => {
    const apollo = createApolloClient({
        auth: Boolean(token),
        cache: false,
        token,
        headers,
    })

    return apollo.query<QueryChallengeResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
