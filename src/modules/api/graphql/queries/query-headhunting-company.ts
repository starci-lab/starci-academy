import type { HeadhuntingCompanyEntity } from "@/modules/types"
import { createAuthApolloClient } from "../clients"
import type { GraphQLResponse, QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

export interface HeadhuntingCompanyRequest {
    id?: string
    displayId?: string
}

const query1 = gql`
  query HeadhuntingCompany($request: HeadhuntingCompanyRequest!) {
    headhuntingCompany(request: $request) {
      success
      message
      error
      data {
        id
        displayId
        title
        description
        websiteUrl
        logoUrl
        address
        phone
        email
        facebookUrl
        linkedinUrl
        orderIndex
      }
    }
  }
`

export enum QueryHeadhuntingCompany {
    Query1 = "query1",
}

const queryMap: Record<QueryHeadhuntingCompany, DocumentNode> = {
    [QueryHeadhuntingCompany.Query1]: query1,
}

export interface QueryHeadhuntingCompanyResponse {
    headhuntingCompany: GraphQLResponse<HeadhuntingCompanyEntity>
}

export const queryHeadhuntingCompany = async ({
    query = QueryHeadhuntingCompany.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryHeadhuntingCompany, HeadhuntingCompanyRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryHeadhuntingCompanyResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
