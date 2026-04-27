import { ModuleEntity } from "@/modules/types"
import { createApolloClient } from "../clients"
import { withAbortContext, type GraphQLResponse, type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

/**
 * Module shell only — matches `ref/queries/module/module.service.ts`
 * (no nested full contents / lesson videos / challenges; use `content`, `lessonVideo`, `challenge` queries).
 * Lists may still return `{ id, orderIndex }` stubs when the API provides them for hydration.
 */
const query1 = gql`
  query Module($request: ModuleRequest!) {
    module(request: $request) {
      success
      message
      error
      data {
        id
        displayId
        title
        description
        numContents
        orderIndex
        previewContents {
          id
          orderIndex
          text
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

export interface ModuleRequest {
    /** The display id. */
    displayId?: string
    /** The id. */
    id?: string
}

/**
 * Fetches one module shell by id or displayId via Apollo.
 */
export const queryModule = async ({
    query = QueryModule.Query1,
    request,
    headers,
    token,
    getAccessToken,
    refreshAccessToken,
    minValiditySeconds,
    debug,
    signal,
}: QueryParams<QueryModule, ModuleRequest>) => {
    const hasAuth = Boolean(token) || Boolean(getAccessToken)
    const apollo = createApolloClient({
        auth: hasAuth,
        cache: false,
        token,
        getAccessToken,
        refreshAccessToken,
        minValiditySeconds,
        headers,
        debug,
    })

    return apollo.query<QueryModuleResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
        ...withAbortContext(signal),
    })
}
