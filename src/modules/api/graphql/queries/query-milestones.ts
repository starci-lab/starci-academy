
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
        id
        title
        orderIndex
        tasks {
          id
          title
          description
          orderIndex
          passCriteria {
            id
            text
            orderIndex
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

/** Apollo variables for `milestones(request: MilestonesRequest!)`. */
export interface QueryMilestonesRequest {
    /** The course id. */
    courseId: string
}

export interface QueryMilestonesResponse {
    milestones: GraphQLResponse<Array<MilestoneEntity>>
}

/**
 * Fetches all milestones for a course via Apollo.
 *
 * @param params - Document key, GraphQL variables
 * @returns Apollo query result; milestones at `data.milestones.data`
 */
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
