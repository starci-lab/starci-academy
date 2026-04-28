import { CombinedGraphQLErrors, CombinedProtocolErrors } from "@apollo/client"
import { ErrorLink } from "@apollo/client/link/error"

/**
 * Centralized logging for GraphQL, protocol, and network errors.
 *
 * @see {@link https://www.apollographql.com/docs/react/api/link/apollo-link-error | ErrorLink API}
 */
export const createErrorLink = (debug = false) =>
    new ErrorLink(({ error }) => {
        if (CombinedGraphQLErrors.is(error)) {
            for (const gqlErr of error.errors) {
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
        console.error(`[Network error]: ${error.message}`)
    }
    )
