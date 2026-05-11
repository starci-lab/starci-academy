import type { MilestoneEntity } from "@/modules/types"
import { createAuthApolloClient } from "../clients"
import { type GraphQLResponse, type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

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
            criterias {
              id
              text
              hint
              score
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

export interface QueryMilestonesRequest {
    courseId: string
}

export interface QueryMilestonesResponseData {
    data: Array<MilestoneEntity>
}

export interface QueryMilestonesResponse {
    milestones: GraphQLResponse<QueryMilestonesResponseData>
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
