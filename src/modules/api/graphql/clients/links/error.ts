import { CombinedGraphQLErrors, CombinedProtocolErrors } from "@apollo/client"
import { ServerError, ServerParseError } from "@apollo/client/errors"
import { ErrorLink } from "@apollo/client/link/error"
import { LocalStorage } from "@/modules/storage/local/storage"
import { LocalStorageId } from "@/modules/storage/local/enums/id"
import { useOverlayStore } from "@/hooks/zustand/overlay/store"

/** Substring of the backend message raised when a newer login evicts this session. */
const SESSION_SUPERSEDED_MARKER = "superseded"

/** Lower bound of the 5xx range — server-side failure (gateway down, mid-deploy, crash). */
const SERVER_ERROR_STATUS_MIN = 500
/** Upper bound (exclusive) of the 5xx range. */
const SERVER_ERROR_STATUS_MAX = 600

/**
 * Whether a network error is a persistent 5xx from the gateway/backend (not a
 * plain offline/timeout/CORS failure, which carries no HTTP status at all).
 *
 * `ServerError` = non-2xx with a JSON body; `ServerParseError` = non-2xx with a
 * non-JSON body (e.g. nginx's default HTML error page — a bare 502 usually lands
 * in the latter). Both expose `.statusCode`; a plain network error does not.
 */
const isMaintenanceError = (error: unknown): boolean =>
    (ServerError.is(error) || ServerParseError.is(error))
    && error.statusCode >= SERVER_ERROR_STATUS_MIN
    && error.statusCode < SERVER_ERROR_STATUS_MAX

/**
 * Handles the single-session eviction: when a newer login on another device
 * supersedes this session, the backend rejects authenticated requests. We drop
 * the stale access token and send the user back to the home page (which renders
 * the logged-out state), so they aren't stuck on a half-broken authed view.
 */
const handleSessionSuperseded = (): void => {
    // only act in the browser — the error link can also run during SSR
    if (typeof window === "undefined") return
    // remove the now-invalid access token so the app treats us as logged out
    LocalStorage.removeItem(LocalStorageId.KeycloakAccessToken)
    // flag in sessionStorage so we can show a toast after hard reload
    try {
        sessionStorage.setItem("superseded_toast", "true")
    } catch {
        // ignore storage quota/security restrictions
    }
    // hard navigate home to reset all in-memory auth state (redux, apollo cache)
    window.location.href = "/"
}

/**
 * Centralized logging for GraphQL, protocol, and network errors, plus
 * single-session eviction handling.
 *
 * @see {@link https://www.apollographql.com/docs/react/api/link/apollo-link-error | ErrorLink API}
 */
export const createErrorLink = (debug = false) =>
    new ErrorLink(({ error }) => {
        if (CombinedGraphQLErrors.is(error)) {
            for (const gqlErr of error.errors) {
                // a newer login elsewhere evicted this session → force logout
                if (gqlErr.message?.includes(SESSION_SUPERSEDED_MARKER)) {
                    handleSessionSuperseded()
                    return
                }
                if (
                    gqlErr.message === "Unauthorized"
                    || gqlErr.extensions?.code === "UNAUTHENTICATED"
                ) {
                    if (debug) {
                        console.log("[GraphQL error]: Unauthorized")
                    }
                }
            }
            return
        }
        if (CombinedProtocolErrors.is(error)) {
            error.errors.forEach(({ message, extensions }) => {
                if (debug) {
                    console.log(
                        `[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(
                            extensions
                        )}`
                    )
                }
            }
            )
            return
        }
        // persistent 5xx (retries already exhausted by RetryLink) → block the app
        // with the maintenance dialog. A plain network error (offline/timeout/CORS)
        // has no statusCode and falls through to the log below unchanged.
        if (isMaintenanceError(error) && typeof window !== "undefined") {
            useOverlayStore.getState().openOverlay("maintenance")
            return
        }
        console.error(`[Network error]: ${error.message}`)
    }
    )
