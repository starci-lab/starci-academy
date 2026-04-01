import { ModuleEntity } from "@/modules/types"
import { createApolloClient } from "../clients"
import type { GraphQLResponse, QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import { ModuleRequest } from "../../../../../ref/module/graphql-types"

const query1 = gql`
  query Module($request: ModuleRequest!) {
    module(request: $request) {
      success
      message
      error
      data {
        id
        title
        description
        orderIndex
        contents {
          id
          orderIndex
          title
          body
        }
        lessonVideos {
          id
          title
          description
          url
          durationMs
          orderIndex
        }
      }
    }
  }
`

export enum QueryModule {
    Query1 = "query1",
}

const queryMap: Record<QueryModule, DocumentNode> = {
    [QueryModule.Query1]: query1,
}

export interface QueryModuleResponse {
    module: GraphQLResponse<ModuleEntity>
}

/**
 * Fetches one module by id via Apollo.
 *
 * Mirrors `ref/module/module.resolver.ts`.
 */
export const queryModule = async ({
    query = QueryModule.Query1,
    request,
    headers,
    token,
}: QueryParams<QueryModule, ModuleRequest>) => {
    const apollo = createApolloClient({
        auth: Boolean(token),
        cache: false,
        token,
        headers,
    })

    return apollo.query<QueryModuleResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}

