import { HttpLink } from "@apollo/client"
import { publicEnv } from "@/resources/env"

/**
 * Terminal link: HTTP transport to the configured GraphQL endpoint (`publicEnv().api.graphql`).
 *
 * @param withCredentials - When `true`, sends cookies on cross-site requests (`credentials: "include"`).
 * @param headers - Extra static headers merged into each request.
 *
 * @see {@link https://www.apollographql.com/docs/react/api/link/apollo-link-http | HttpLink API}
 * @see {@link https://www.apollographql.com/docs/react/networking/advanced-http-networking#including-credentials-in-requests | Including credentials}
 */
export const createHttpLink = (
    withCredentials = true,
    headers: Record<string, string> = {}
) => {
    return new HttpLink({
        uri: `${publicEnv().api.graphql}`,
        credentials: withCredentials ? "include" : "same-origin",
        headers,
    })
}
