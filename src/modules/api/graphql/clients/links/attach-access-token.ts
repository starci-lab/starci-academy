import { ApolloLink } from "@apollo/client"
import { LocalStorage, LocalStorageId } from "@/modules/storage"

export interface CreateAttachAccessTokenLinkParams {
    /** When `true`, logs the resolved token (masked). */
    debug?: boolean
    /** Optional token getter. Defaults to localStorage `KeycloakAccessToken`. */
    getAccessToken?: () => string | undefined
}

export const createAttachAccessTokenLink = (
    params: CreateAttachAccessTokenLinkParams | boolean = false
) => {
    const debug = typeof params === "boolean" ? params : (params.debug ?? false)
    const getAccessToken =
        typeof params === "boolean"
            ? undefined
            : params.getAccessToken

    const resolveAccessToken =
        getAccessToken
        ?? (() =>
            LocalStorage.getItemAsString(
                LocalStorageId.KeycloakAccessToken
            ))

    return new ApolloLink((operation, forward) => {
        const accessToken = resolveAccessToken()
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
            console.log(`[AttachAccessTokenLink] op=${operation.operationName} token=${masked}`)
        }
        return forward(operation)
    }
    )
}