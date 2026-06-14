import type { GraphQLResponse } from "../../types"
import type { QueryMyDashboardFeedItemData } from "./my-dashboard"

/** Which home feed to read (mirrors backend `MyFeedTab`). */
export enum MyFeedTab {
    /** Recommended — recent platform-wide activity. */
    ForYou = "forYou",
    /** Activity from followed users. */
    Following = "following",
}

/** Variables for the cursor-paginated `myFeed` query. */
export interface MyFeedRequest {
    /** Which feed to read. */
    tab: MyFeedTab
    /** Opaque cursor from the previous page; omit for page 1. */
    cursor?: string
    /** Max items per page. */
    limit?: number
}

/** Payload inside `myFeed.data`. */
export interface QueryMyFeedResponseData {
    /** Feed items for this page, newest first. */
    items: Array<QueryMyDashboardFeedItemData>
    /** Cursor for the next page; null when no more. */
    nextCursor: string | null
}

/** Apollo response shape for `myFeed`. */
export interface QueryMyFeedResponse {
    /** Top-level `myFeed` field wrapping the standard API response. */
    myFeed: GraphQLResponse<QueryMyFeedResponseData>
}
