import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMyVouchersResponse } from "./types"

const query1 = gql`
  query MyVouchers {
    myVouchers {
      success
      message
      error
      data {
        id
        code
        discountType
        value
        courseId
        courseTitle
        status
        expiresAt
        usedAt
        createdAt
      }
    }
  }
`

export enum QueryMyVouchers {
    Query1 = "query1",
}

const queryMap: Record<QueryMyVouchers, DocumentNode> = {
    [QueryMyVouchers.Query1]: query1,
}

/**
 * Fetches the viewer's Coin-shop vouchers, newest first.
 *
 * Mirrors `myVouchers` (queries/dashboard/my-vouchers).
 */
export const queryMyVouchers = async ({
    query = QueryMyVouchers.Query1,
    headers,
    debug,
    signal,
}: Omit<QueryParams<QueryMyVouchers, never>, "request"> & { request?: never }) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.query<QueryMyVouchersResponse>({
        query: queryMap[query],
    })
}
