import { DocumentNode, gql } from "@apollo/client"
import { createRefreshTokenApolloClient } from "./client"
import { GraphQLResponse, MutateParams } from "../../../types"

export enum MutationRefreshToken {
    Mutation1 = "mutation1",
}

export const mutation1 = gql`
  mutation RefreshToken($request: RefreshTokenRequest!) {
    refreshToken(request: $request) {
      success
      message
      error
      data {
        accessToken
      }
    }
  }
`

/**
 * The refresh token mutation map.
 */
const mutationMap: Record<MutationRefreshToken, DocumentNode> = {
    [MutationRefreshToken.Mutation1]: mutation1,
}


/**
 * The refresh token mutation request.
 */
export interface RefreshTokenRequest {
    /** 
     * Minimum validity seconds.
     */
    minValiditySeconds?: number
}

export interface RefreshTokenData {
    accessToken: string
}
/**
 * The refresh token mutation response.
 */
export interface MutateRefreshTokenResponse {   
    refreshToken: GraphQLResponse<RefreshTokenData>
}

/**
 * The refresh token mutation variables.
 */
export interface RefreshTokenVariables {
    request: RefreshTokenRequest
}

/**
 * The refresh token mutation.
 */
export const mutateRefreshToken = async ({
    mutation = MutationRefreshToken.Mutation1,
    request,
    debug,
    signal,
}: MutateParams<MutationRefreshToken, RefreshTokenRequest>) => {
    const apollo = createRefreshTokenApolloClient({
        debug,
        signal,
    })
    return apollo.mutate<MutateRefreshTokenResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
