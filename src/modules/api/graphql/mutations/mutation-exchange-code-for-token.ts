import { createNoAuthApolloClient } from "../clients/clients"
import {
    type GraphQLResponse,
    type MutateParams,
    type QueryVariables,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

/**
 * Identity broker passed to {@link exchangeCodeForToken} (mirrors Nest `KeycloakIdentityProvider`).
 * Must match GraphQL enum values on the API.
 */
export enum KeycloakIdentityProvider {
    Google = "google",
    Github = "github",
}

/** Token payload inside `exchangeCodeForToken.data` (mirrors `ExchangeCodeForTokenData`). */
export interface ExchangeCodeForTokenData {
    accessToken: string
}

const mutation1 = gql`
  mutation ExchangeCodeForToken($request: ExchangeCodeForTokenRequest!) {
    exchangeCodeForToken(request: $request) {
      success
      message
      error
      data {
        accessToken
      }
    }
  }
`

export enum MutationExchangeCodeForToken {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationExchangeCodeForToken, DocumentNode> = {
    [MutationExchangeCodeForToken.Mutation1]: mutation1,
}

export interface ExchangeCodeForTokenRequest {
    code: string
    provider: KeycloakIdentityProvider
    state: string
}

export type MutateExchangeCodeForTokenVariables = QueryVariables<ExchangeCodeForTokenRequest>

export type MutateExchangeCodeForTokenParams = MutateParams<
    MutationExchangeCodeForToken,
    ExchangeCodeForTokenRequest
>

export interface MutateExchangeCodeForTokenResponse {
    exchangeCodeForToken: GraphQLResponse<ExchangeCodeForTokenData>
}

/**
 * Exchanges an OIDC authorization code for Keycloak tokens (public; used after IdP redirect).
 *
 * Mirrors `src/keycloak/exchangeCodeForToken/exchange-code-for-token.resolver.ts` (`exchangeCodeForToken`).
 */
export const mutateExchangeCodeForToken = async ({
    mutation = MutationExchangeCodeForToken.Mutation1,
    request,
    debug,
    signal,
}: MutateExchangeCodeForTokenParams) => {
    const apollo = createNoAuthApolloClient({
        cache: false,
        debug,
        signal,
        withCredentials: true,
    })
    return apollo.mutate<MutateExchangeCodeForTokenResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
