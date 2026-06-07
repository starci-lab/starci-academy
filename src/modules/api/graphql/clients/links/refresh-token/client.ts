/**
 * Apollo client used **only for refresh token mutations**
 * (to avoid circular dependency with the full client).
 *
 * ## Link execution order (`ApolloLink.from`: left → right = outer → inner pipeline)
 *
 * Each `Operation` flows through the link chain; `HttpLink` is always **terminal**
 * and performs the actual network request (`fetch`).
 *
 * ```text
 *     (SWR / component calls apollo.mutate)
 *                 │
 *                 ▼
 *   ┌─────────────────────────┐
 *   │ 1. RetryLink            │  Retries transient network failures (backoff + jitter).
 *   └───────────┬─────────────┘
 *               ▼
 *   ┌─────────────────────────┐
 *   │ 2. ErrorLink            │  Logs GraphQL / network / protocol errors from downstream.
 *   └───────────┬─────────────┘
 *               ▼
 *   ┌─────────────────────────┐
 *   │ 3. TimeoutLink          │  Aborts request if no response within `graphql.timeout` ms.
 *   └───────────┬─────────────┘
 *               ▼
 *   ┌─────────────────────────┐
 *   │ 4. AttachAccessTokenLink│  Attaches `Authorization: Bearer <JWT>` from LocalStorage.
 *   └───────────┬─────────────┘
 *               ▼
 *   ┌─────────────────────────┐
 *   │ 5. HttpLink             │  Executes GraphQL `POST` request with `credentials: include`
 *   │                         │  (sends HttpOnly refresh cookie automatically).
 *   └───────────┬─────────────┘
 *               ▼
 *            (server)
 * ```
 *
 * The `keycloak_refresh_token` cookie is **not accessible via JavaScript**
 * and is automatically included via `credentials: include` in `HttpLink`.
 *
 * @module
 */

import { publicEnv } from "@/resources"
import { 
    ApolloClient, 
    ApolloLink, 
    InMemoryCache 
} from "@apollo/client"
import {
    createErrorLink,
    createTimeoutLink,
    createRetryLink,
    createAttachAccessTokenLink,
    createAttachCsrfTokenLink,
    createAttachDeviceFingerprintLink,
    defaultOptions,
    createHttpLink
} from "../../links"

/**
 * Parameters for creating a refresh token Apollo client.
 */
export interface CreateRefreshTokenApolloClientParams {
    /** When `true`, logs attach-token and auth-related errors (not all network errors). */
    debug?: boolean;

    /** Optional AbortSignal forwarded to `HttpLink` for request cancellation (e.g. SWR abort). */
    signal?: AbortSignal;
}

/**
 * Creates a minimal Apollo Client instance dedicated to the `refreshToken` mutation.
 */
export const createRefreshTokenApolloClient = ({
    signal,
    debug = false,
}: CreateRefreshTokenApolloClientParams) => {
    return new ApolloClient({
        link: ApolloLink.from([
            createRetryLink(),
            createErrorLink(debug),
            createTimeoutLink(),
            createAttachAccessTokenLink(debug),
            createAttachCsrfTokenLink(debug),
            createAttachDeviceFingerprintLink(debug),
            createHttpLink({
                withCredentials: true,
                headers: {},
                uri: `${publicEnv().api.graphql}`,
                signal,
            }),
        ]),
        cache: new InMemoryCache(),
        defaultOptions,
    })
}