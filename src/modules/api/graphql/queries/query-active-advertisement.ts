import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryActiveAdvertisementResponse } from "./types"

const query1 = gql`
  query ActiveAdvertisement {
    activeAdvertisement {
      success
      message
      error
      data {
        id
        mediaType
        media
        title
        ctaText
        linkUrl
        sponsorName
      }
    }
  }
`

export enum QueryActiveAdvertisement {
    Query1 = "query1",
}

const queryMap: Record<QueryActiveAdvertisement, DocumentNode> = {
    [QueryActiveAdvertisement.Query1]: query1,
}

/**
 * Fetches the banner to show in the dashboard right rail (paid first, else the
 * internal house ad), or null when none is active.
 *
 * Mirrors `activeAdvertisement` (queries/dashboard/active-advertisement).
 */
export const queryActiveAdvertisement = async ({
    query = QueryActiveAdvertisement.Query1,
    headers,
    debug,
    signal,
}: Omit<QueryParams<QueryActiveAdvertisement, never>, "request"> & { request?: never }) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.query<QueryActiveAdvertisementResponse>({
        query: queryMap[query],
    })
}
