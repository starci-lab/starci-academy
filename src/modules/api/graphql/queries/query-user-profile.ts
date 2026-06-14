import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryUserProfileResponse } from "./types"

/** Variables for the `userProfile` query. */
export interface QueryUserProfileRequest {
    /** Id of the user whose public profile to fetch. */
    userId: string
}

const query1 = gql`
  query UserProfile($userId: ID!) {
    userProfile(userId: $userId) {
      success
      message
      error
      data {
        id
        username
        displayName
        bio
        avatar
        followerCount
        followingCount
        isFollowedByMe
      }
    }
  }
`

export enum QueryUserProfile {
    Query1 = "query1",
}

const queryMap: Record<QueryUserProfile, DocumentNode> = {
    [QueryUserProfile.Query1]: query1,
}

/**
 * Fetches a user's public profile by id via Apollo.
 *
 * Mirrors `userProfile` (queries/users/user-profile/user-profile.resolver.ts);
 * the user is at `data.userProfile.data`.
 */
export const queryUserProfile = async ({
    query = QueryUserProfile.Query1,
    request,
    debug,
    signal,
}: QueryParams<QueryUserProfile, QueryUserProfileRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })
    return apollo.query<QueryUserProfileResponse>({
        query: queryMap[query],
        variables: {
            userId: request?.userId,
        },
    })
}
