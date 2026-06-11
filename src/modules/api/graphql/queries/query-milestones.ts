import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMilestonesRequest, QueryMilestonesResponse } from "./types"

const query1 = gql`
  query Milestones($request: MilestonesRequest!) {
    milestones(request: $request) {
      success
      message
      error
      data {
        data {
          id
          title
          orderIndex
          courseId
          tasks {
            id
            title
            description
            hint
            orderIndex
            briefs {
              id
              lang
              body
              orderIndex
              defaultLocale
              translations {
                locale
                field
                value
              }
            }
            criterias {
              id
              text
              hint
              score
              orderIndex
            }
            codeImplementations {
              id
              lang
              guide
              example
              orderIndex
            }
          }
        }
      }
    }
  }
`

export enum QueryMilestones {
    Query1 = "query1",
}

const queryMap: Record<QueryMilestones, DocumentNode> = {
    [QueryMilestones.Query1]: query1,
}

export const queryMilestones = async ({
    query = QueryMilestones.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryMilestones, QueryMilestonesRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.query<QueryMilestonesResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
