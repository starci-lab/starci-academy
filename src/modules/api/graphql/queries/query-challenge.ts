import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryChallengeResponse, ChallengeRequest } from "./types"

const query1 = gql`
  query Challenge($request: ChallengeRequest!) {
    challenge(request: $request) {
      success
      message
      error
      data {
        id
        title
        requirements {
          id
          purpose
          technicalConstraints
          proTipsHints
          forbidden
          orderIndex
        }
        outputs {
          id
          text
          orderIndex
        }
        prerequisites {
          id
          text
          orderIndex
        }
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
        verified
        defaultLocale
        requirementsV2 {
          id
          orderIndex
          defaultLocale
          langs {
            id
            lang
            orderIndex
            score
            defaultLocale
            title
            body
          }
        }
        stepsV2 {
          id
          orderIndex
          defaultLocale
          langs {
            id
            lang
            orderIndex
            defaultLocale
            title
            body
          }
        }
        outputsV2 {
          id
          orderIndex
          defaultLocale
          langs {
            id
            lang
            orderIndex
            defaultLocale
            text
          }
        }
        prerequisitesV2 {
          id
          orderIndex
          defaultLocale
          langs {
            id
            lang
            orderIndex
            defaultLocale
            text
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
