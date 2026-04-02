import type { ChallengeEntity } from "@/modules/types"
import { createApolloClient } from "../clients"
import {
    SortOrder,
    type GraphQLResponse,
    type PaginationFilters,
    type QueryParams,
    type SortInput,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

/** Sort keys for `challenges` list (`ChallengesSortBy`). */
export enum ChallengesSortBy {
    Title = "title",
    OrderIndex = "orderIndex",
    CreatedAt = "createdAt",
    UpdatedAt = "updatedAt",
}

export interface QueryChallengesPayload {
    count: number
    data: Array<ChallengeEntity>
}

const query1 = gql`
  query Challenges($request: ChallengesRequest!) {
    challenges(request: $request) {
      success
      message
      error
      data {
        count
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
  }
`

export enum QueryChallenges {
    Query1 = "query1",
}

const queryMap: Record<QueryChallenges, DocumentNode> = {
    [QueryChallenges.Query1]: query1,
}

export type ChallengesListFilters = PaginationFilters<ChallengesSortBy> & {
    moduleId: string
}

export interface ChallengesListRequest {
    filters: ChallengesListFilters
}

export interface QueryChallengesResponse {
    challenges: GraphQLResponse<QueryChallengesPayload>
}

export const defaultChallengesListSorts: Array<SortInput<ChallengesSortBy>> = [
    {
        by: ChallengesSortBy.OrderIndex,
        order: SortOrder.Asc,
    },
]

/**
 * Paginated module challenges (`ref/queries/challenges/challenges`).
 */
export const queryChallenges = async ({
    query = QueryChallenges.Query1,
    request,
    headers,
    token,
}: QueryParams<QueryChallenges, ChallengesListRequest>) => {
    const apollo = createApolloClient({
        auth: Boolean(token),
        cache: false,
        token,
        headers,
    })

    return apollo.query<QueryChallengesResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
