import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMyCartResponse } from "./types/my-cart"

const query1 = gql`
  query MyCart {
    myCart {
      success
      message
      error
      data {
        id
        userId
        courseId
        createdAt
        course {
          id
          displayId
          title
          slug
          description
          cdnUrl
          coverImageUrl
          originalPrice
          originalPriceUsd
          currentPhase
          enrollmentCount
          pricingPhases {
            phase
            price
            priceUsd
          }
          valuePropositions {
            text
          }
        }
      }
    }
  }
`

export enum QueryMyCart {
    Query1 = "query1",
}

const queryMap: Record<QueryMyCart, DocumentNode> = {
    [QueryMyCart.Query1]: query1,
}

/**
 * Fetches the viewer's shopping cart — every {@link import("./types/my-cart").CartItemEntity}
 * with its full course (title, cover, pricing phases, value props) so the cart lines
 * render the same personalised price as the rest of the app.
 *
 * Mirrors backend `myCart`.
 */
export const queryMyCart = async ({
    query = QueryMyCart.Query1,
    headers,
    debug,
    signal,
}: Omit<QueryParams<QueryMyCart, never>, "request"> & { request?: never }) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.query<QueryMyCartResponse>({
        query: queryMap[query],
    })
}
