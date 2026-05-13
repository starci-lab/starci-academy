import { createAuthApolloClient } from "../clients"
import { TemplateCVEntity, type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import {
    GraphQLResponse,
} from "../types"

const query1 = gql`
  query TemplateCvs {
    templateCvs {
      success
      message
      error
      data {
        id
        title
        description
      }
    }
  }
`

export enum QueryTemplateCvs {
  Query1 = "query1",
}

const queryMap: Record<QueryTemplateCvs, DocumentNode> = {
    [QueryTemplateCvs.Query1]: query1,
}

export interface QueryTemplateCvsResponse {
  templateCvs: GraphQLResponse<Array<TemplateCVEntity>>;
}

export const queryTemplateCvs = async ({
    query = QueryTemplateCvs.Query1,
    debug,
    headers,
    signal,
}: QueryParams<QueryTemplateCvs>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
        headers
    })

    return apollo.query<QueryTemplateCvsResponse>({
        query: queryMap[query],
    })
}
