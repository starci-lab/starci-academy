import type { HeadhuntingCompanyEntity } from "@/modules/types"
import { createAuthApolloClient } from "../clients"
import type { GraphQLResponse, QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const query1 = gql`
  query HeadhuntingCompanies {
    headhuntingCompanies {
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

export enum QueryHeadhuntingCompanies {
    Query1 = "query1",
}

const queryMap: Record<QueryHeadhuntingCompanies, DocumentNode> = {
    [QueryHeadhuntingCompanies.Query1]: query1,
}

export interface QueryHeadhuntingCompaniesResponse {
    headhuntingCompanies: GraphQLResponse<Array<HeadhuntingCompanyEntity>>
}

export const queryHeadhuntingCompanies = async ({
    query = QueryHeadhuntingCompanies.Query1,
    debug,
    headers,
    signal,
}: QueryParams<QueryHeadhuntingCompanies>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
        headers,
    })

    return apollo.query<QueryHeadhuntingCompaniesResponse>({
        query: queryMap[query],
    })
}
