/**
 * Apollo Client factory and custom link chain for the StarCI Academy GraphQL layer.
 *
 * Link chain order:
 * ```
 * RetryLink → AuthRefreshLink? → DynamicAuthLink? → ErrorLink → TimeoutLink → AbortSignal? → HttpLink
 * ```
 *
 * **Key Apollo concepts used here:**
 * - {@link https://www.apollographql.com/docs/react/api/link/introduction | Apollo Link overview}
 * - {@link https://www.apollographql.com/docs/react/api/core/ApolloClient | ApolloClient API}
 * - {@link https://www.apollographql.com/docs/react/api/link/apollo-link-error | ErrorLink API}
 * - {@link https://www.apollographql.com/docs/react/api/link/apollo-link-retry | RetryLink API}
 * - {@link https://www.apollographql.com/docs/react/networking/authentication | Authentication guide}
 * - {@link https://www.apollographql.com/docs/react/networking/advanced-http-networking | Advanced HTTP networking}
 *
 * @module
 */

import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client"
import type { GraphQLError } from "graphql"
import type { Subscription } from "rxjs"
import { Observable } from "@apollo/client/utilities"
import {
    CombinedGraphQLErrors,
    CombinedProtocolErrors,
} from "@apollo/client/errors"
import { ErrorLink } from "@apollo/client/link/error"
import { createTimeoutLink } from "./timeout"
import { createRetryLink } from "./retry"
import { createHttpLink } from "./http"
import { defaultOptions } from "./options"
import { sleep } from "@/modules/utils"

/** Callback that returns the current access token, or `undefined` when not authenticated. */
type AccessTokenGetter = () => string | undefined

/**
 * Callback to refresh the access token (e.g. via Keycloak `updateToken`).
 *
 * @param minValiditySeconds - Minimum remaining validity (in seconds) before a refresh is triggered.
 * @returns `true` if the token was refreshed (or still valid), `false` otherwise.
 */
type RefreshAccessToken = (minValiditySeconds?: number) => Promise<boolean>

/**
 * Returns `true` when the GraphQL response contains an `UNAUTHENTICATED` error
 * (either by `extensions.code` or the literal `"Unauthorized"` message).
 *
 * @see {@link https://www.apollographql.com/docs/react/networking/authentication | Apollo authentication guide}
 */
const isUnauthenticatedGraphQLError = (errors?: ReadonlyArray<GraphQLError>) =>
    (errors ?? []).some(
        (gqlErr) =>
            gqlErr.message === "Unauthorized"
            || gqlErr.extensions?.code === "UNAUTHENTICATED",
    )

/**
 * Injects `Authorization: Bearer <token>` using the latest value from {@link AccessTokenGetter}.
 *
 * Unlike `setContext` with a static token, this link calls the getter on **every** request
 * so the header always carries the freshest token — important after a silent refresh.
 *
 * @see {@link https://www.apollographql.com/docs/react/networking/authentication | Apollo authentication guide}
 * @see {@link https://www.apollographql.com/docs/react/api/link/apollo-link-context | SetContext link}
 */
const createDynamicAccessTokenAuthLink = (getAccessToken: AccessTokenGetter, debug = false) =>
    new ApolloLink((operation, forward) => {
        const accessToken = getAccessToken()
        if (accessToken) {
            operation.setContext(({ headers = {} }) => ({
                headers: {
                    ...headers,
                    authorization: `Bearer ${accessToken}`,
                },
            }))
        }
        if (debug) {
            const masked = accessToken ? `${accessToken.slice(0, 10)}…` : "(none)"
            console.log(`[DynamicAuthLink] op=${operation.operationName} token=${masked}`)
        }
        return forward(operation)
    }
    )

/** Parameters for {@link createAuthRefreshLink}. */
export interface CreateAuthRefreshLinkParams {
    /** Callback to refresh the access token. */
    refreshAccessToken: RefreshAccessToken
    /** Minimum validity seconds forwarded to {@link RefreshAccessToken}. */
    minValiditySeconds?: number
    /** When `true`, logs refresh flow details to the console. */
    debug?: boolean
}
/**
 * Intercepts `UNAUTHENTICATED` GraphQL errors, refreshes the token once via
 * {@link RefreshAccessToken}, then retries the failed operation.
 *
 * A single in-flight refresh is shared across concurrent requests to prevent
 * multiple refresh calls. The retry flag `__authRetry` on the operation context
 * prevents infinite retry loops.
 *
 * @see {@link https://www.apollographql.com/docs/react/networking/authentication | Apollo authentication guide}
 * @see {@link https://www.apollographql.com/docs/react/api/link/introduction | Apollo Link overview}
 */
const createAuthRefreshLink = (
    { 
        refreshAccessToken, 
        minValiditySeconds = 30, 
        debug = false 
    }: CreateAuthRefreshLinkParams
) => {
    let inFlightRefresh: Promise<boolean> | null = null
    
    const runRefresh = async () => {
        if (!inFlightRefresh) {
            if (debug) console.log("[AuthRefreshLink] Calling refreshAccessToken…")
            inFlightRefresh = refreshAccessToken(minValiditySeconds).finally(() => {
                inFlightRefresh = null
            })
        }
        return inFlightRefresh
    }

    return new ApolloLink(
        (operation, forward) => {
            return new Observable((observer) => {
                let sub: Subscription | null = null

                const run = () => {
                    sub = forward(operation).subscribe({
                        next: async (result) => {
                            const context = operation.getContext() as { __authRetry?: boolean }
                            if (
                                !context.__authRetry
                            && isUnauthenticatedGraphQLError(result.errors as ReadonlyArray<GraphQLError> | undefined)
                            ) {
                                if (debug) console.log(`[AuthRefreshLink] op=${operation.operationName} → UNAUTHENTICATED, keep request for refresh token`)
                                operation.setContext({ __authRetry: true })
                                try {
                                    const ok = await runRefresh()
                                    if (ok) {
                                        if (debug) console.log(`[AuthRefreshLink] Refresh successful, retry op=${operation.operationName}`)
                                        sub?.unsubscribe()
                                        await sleep(100)
                                        run()
                                        return
                                    }
                                    if (debug) console.log("[AuthRefreshLink] Refresh returned false, do not retry")
                                } catch {
                                    if (debug) console.log("[AuthRefreshLink] Refresh failed, propagate original result")
                                }
                            }
                            observer.next(result)
                        },
                        error: (error) => {
                            if (debug) console.log(`[AuthRefreshLink] op=${operation.operationName} error:`, error)
                            observer.error(error)
                        },
                        complete: () => {
                            observer.complete()
                        },
                    })
                }
                run()
                return () => {
                    sub?.unsubscribe()
                }
            })
        })
}

/**
 * Forwards a fixed {@link AbortSignal} to HttpLink `fetchOptions` (one client instance = one in-flight request scope).
 */
const createAbortSignalLink = (signal: AbortSignal) =>
    new ApolloLink((operation, forward) => {
        const ctx = operation.getContext() as { fetchOptions?: RequestInit }
        const fetchOptions = ctx.fetchOptions ?? {}
        operation.setContext({
            fetchOptions: {
                ...fetchOptions,
                signal,
            },
        })
        return forward(operation)
    })

/**
 * Centralized logging for GraphQL, protocol, and network errors.
 *
 * @see {@link https://www.apollographql.com/docs/react/api/link/apollo-link-error | ErrorLink API}
 */
const createErrorLink = () =>
    new ErrorLink(({ error }) => {
        if (CombinedGraphQLErrors.is(error)) {
            for (const gqlErr of error.errors) {
                if (
                    gqlErr.message === "Unauthorized"
                    || gqlErr.extensions?.code === "UNAUTHENTICATED"
                ) {
                    console.log("[GraphQL error]: Unauthorized")
                }
            }
            return
        }
        if (CombinedProtocolErrors.is(error)) {
            error.errors.forEach(({ message, extensions }) =>
                console.log(
                    `[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(
                        extensions
                    )}`
                )
            )
            return
        }
        console.error(`[Network error]: ${error.message}`)
    })

/**
 * Configuration for {@link createApolloClient}.
 *
 * @see {@link https://www.apollographql.com/docs/react/api/core/ApolloClient | ApolloClient constructor options}
 */
export interface CreateApolloClientOptions {
    /** When `false`, skips the bearer auth link entirely. */
    auth?: boolean
    /**
     * When `false`, does not apply {@link defaultOptions} (caller may pass custom `defaultOptions`).
     *
     * @see {@link https://www.apollographql.com/docs/react/api/core/ApolloClient#defaultoptions | ApolloClient defaultOptions}
     */
    cache?: boolean
    /** Explicit bearer token; otherwise falls back to session storage when `auth` is `true`. */
    token?: string
    /**
     * Preferred token getter for per-request header injection.
     * Takes precedence over the static `token` value.
     *
     * @see {@link https://www.apollographql.com/docs/react/networking/authentication | Apollo authentication guide}
     */
    getAccessToken?: AccessTokenGetter
    /**
     * Optional refresh callback; when provided, enables the auth-refresh link
     * that retries failed `UNAUTHENTICATED` operations after refreshing the token.
     */
    refreshAccessToken?: RefreshAccessToken
    /** Minimum validity seconds passed into {@link RefreshAccessToken}. Defaults to `30`. */
    minValiditySeconds?: number
    /**
     * Forward cookies on same-origin or cross-site requests.
     *
     * @see {@link https://www.apollographql.com/docs/react/networking/advanced-http-networking#including-credentials-in-requests | Including credentials}
     */
    withCredentials?: boolean
    /**
     * Additional headers passed to the {@link https://www.apollographql.com/docs/react/api/link/apollo-link-http | HttpLink}.
     */
    headers?: Record<string, string>
    /**
     * Overrides default fetch/error policies for this client instance.
     *
     * @see {@link https://www.apollographql.com/docs/react/api/core/ApolloClient#defaultoptions | ApolloClient defaultOptions}
     */
    defaultOptions?: ApolloClient.DefaultOptions
    /**
     * When `true`, logs the flow through the link chain
     * (DynamicAuthLink, AuthRefreshLink, ErrorLink, HttpLink).
     */
    debug?: boolean
    /**
     * Optional {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal | AbortSignal} for all operations
     * on this client; merged into {@link https://www.apollographql.com/docs/react/api/link/apollo-link-http | HttpLink} `fetchOptions`.
     */
    signal?: AbortSignal
}

/**
 * Builds an {@link https://www.apollographql.com/docs/react/api/core/ApolloClient | ApolloClient}
 * with retry, optional auth (including token refresh), error logging, timeout, and HTTP links.
 *
 * Link chain (in execution order):
 * 1. **RetryLink** — exponential-backoff retries on network failures.
 * 2. **AuthRefreshLink** *(opt-in)* — refreshes expired tokens and retries once.
 * 3. **DynamicAuthLink** *(opt-in)* — injects `Authorization` header per request.
     * 4. **ErrorLink** — logs GraphQL, protocol, and network errors.
     * 5. **TimeoutLink** — aborts requests that exceed the configured timeout.
     * 6. **AbortSignal link** *(opt-in)* — forwards `signal` to `fetch` (e.g. SWR cancel).
     * 7. **HttpLink** — sends the operation to the GraphQL endpoint.
 *
 * @param options - Link and cache configuration.
 * @returns A new `ApolloClient` instance (not shared; callers may cache as needed).
 *
 * @see {@link https://www.apollographql.com/docs/react/api/link/introduction | Apollo Link overview}
 * @see {@link https://www.apollographql.com/docs/react/networking/advanced-http-networking | Advanced HTTP networking}
 */
export const createApolloClient = (
    options: CreateApolloClientOptions
) => {
    const {
        auth = true,
        cache = true,
        token,
        getAccessToken,
        refreshAccessToken,
        minValiditySeconds,
        withCredentials = true,
        headers = {},
        defaultOptions: customDefaultOptions,
        debug = false,
    } = options
    // Final headers are the headers passed in the options plus the headers passed in the options
    const finalHeaders = {
        ...headers,
    }
    // Final links are the links passed in the options plus the links passed in the options
    const links: Array<ApolloLink> = [
        createRetryLink(),
    ]
    // If auth is true, add the auth refresh link and the dynamic access token auth link
    if (auth) {
        if (refreshAccessToken) {
            links.push(createAuthRefreshLink({ refreshAccessToken, minValiditySeconds, debug }))
        }
        const getter: AccessTokenGetter = getAccessToken ?? (() => token)
        links.push(createDynamicAccessTokenAuthLink(getter, debug))
    }
    // Add the error link, timeout link, optional abort, and http link
    links.push(
        createErrorLink(),
        createTimeoutLink(),
    )
    if (signal) {
        links.push(createAbortSignalLink(signal))
    }
    links.push(createHttpLink(withCredentials, finalHeaders))

    // Final default options are the custom default options passed in the options plus the default options passed in the options
    const finalDefaultOptions = customDefaultOptions || (cache ? defaultOptions : undefined)

    return new ApolloClient({
        link: ApolloLink.from(links),
        cache: new InMemoryCache(),
        defaultOptions: finalDefaultOptions,
    })
}

/**
 * Convenience wrapper: {@link createApolloClient} with auth + credentials + no cache.
 * Common for authenticated mutations or sensitive reads.
 *
 * @param token - Bearer access token.
 * @param headers - Extra headers (e.g. OTP or feature flags).
 */
export const createApolloClientAndHeaders = (
    token: string,
    headers: Record<string, string>
) => {
    return createApolloClient({
        token,
        headers,
        withCredentials: true,
        auth: true,
        cache: false,
    })
}

/** Anonymous client with cache disabled (suitable for public read-only probes). */
export const client = createApolloClient({
    auth: false,
    cache: false,
})

/** Anonymous client with explicit no-cache default options. */
export const noCacheClient = createApolloClient({
    auth: false,
    cache: false,
})

/** Anonymous client that includes cookies on requests. */
export const noCacheCredentialClient = createApolloClient({
    auth: false,
    cache: false,
    withCredentials: true,
})
