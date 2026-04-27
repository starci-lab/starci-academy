import { createApolloClient } from "../clients"
import {
    type GraphQLResponse,
    type MutateParams,
    type QueryVariables,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { ExchangeCodeForTokenData } from "./mutation-exchange-code-for-token"

const mutation1 = gql`
  mutation RefreshKeycloakToken($request: RefreshTokenRequest!) {
    refresh(request: $request) {
      success
      message
      error
      data {
        accessToken
        refreshToken
        tokenType
        expiresIn
        idToken
        scope
        sessionState
      }
    }
  }
`

export enum MutationRefreshKeycloakToken {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationRefreshKeycloakToken, DocumentNode> = {
    [MutationRefreshKeycloakToken.Mutation1]: mutation1,
}

/** GraphQL `RefreshTokenRequest` body. */
export type RefreshKeycloakTokenRequest = {
    refreshToken: string
}

export type MutateRefreshKeycloakTokenVariables = QueryVariables<RefreshKeycloakTokenRequest>

export type MutateRefreshKeycloakTokenParams = MutateParams<
    MutationRefreshKeycloakToken,
    RefreshKeycloakTokenRequest
>

export interface MutateRefreshKeycloakTokenResponse {
    refresh: GraphQLResponse<ExchangeCodeForTokenData>
}

/**
 * Refreshes Keycloak access/refresh tokens using a refresh token (public body-only auth).
 *
 * Mirrors `src/keycloak/refresh/refresh-token.resolver.ts` (mutation name `refresh`).
 */
export const mutateRefreshKeycloakToken = async ({
    mutation = MutationRefreshKeycloakToken.Mutation1,
    request,
    debug,
    signal,
}: MutateRefreshKeycloakTokenParams) => {
    const apollo = createApolloClient({
        auth: false,
        cache: false,
        debug,
        signal,
    })
    return apollo.mutate<MutateRefreshKeycloakTokenResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
