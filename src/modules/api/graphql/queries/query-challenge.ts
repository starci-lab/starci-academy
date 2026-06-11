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
          sortIndex
        }
        outputs {
          id
          text
          sortIndex
        }
        prerequisites {
          id
          text
          sortIndex
        }
        description
        score
        difficulty
        sortIndex
        steps {
          id
          title
          body
          sortIndex
        }
        submissions {
          id
          type
          title
          description
          sortIndex
          userSubmission {
            submissionUrl
          }
        }
        references {
          id
          alias
          url
          sortIndex
        }
        verified
        defaultLocale
        requirementsV2 {
          id
          sortIndex
          defaultLocale
          langs {
            id
            lang
            sortIndex
            score
            defaultLocale
            title
            body
          }
        }
        stepsV2 {
          id
          sortIndex
          defaultLocale
          langs {
            id
            lang
            sortIndex
            defaultLocale
            title
            body
          }
        }
        outputsV2 {
          id
          sortIndex
          defaultLocale
          langs {
            id
            lang
            sortIndex
            defaultLocale
            text
          }
        }
        prerequisitesV2 {
          id
          sortIndex
          defaultLocale
          langs {
            id
            lang
            sortIndex
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
