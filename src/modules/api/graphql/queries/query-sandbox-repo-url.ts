import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { gql } from "@apollo/client"

/** Request body for {@link querySandboxRepoUrl}. */
export interface SandboxRepoUrlRequest {
    contentId: string
}

/** Apollo response shape for {@link querySandboxRepoUrl}. */
export interface QuerySandboxRepoUrlResponse {
    sandboxRepoUrl: string
}

const query1 = gql`
  query SandboxRepoUrl($request: SandboxRepoUrlRequest!) {
    sandboxRepoUrl(request: $request)
  }
`

export enum QuerySandboxRepoUrl {
    Query1 = "Query1",
}

const queryMap = {
    [QuerySandboxRepoUrl.Query1]: query1,
}

/** Fetches the sandbox repository URL for a playground slug. */
export const querySandboxRepoUrl = async ({
    query = QuerySandboxRepoUrl.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QuerySandboxRepoUrl, SandboxRepoUrlRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })
    return apollo.query<QuerySandboxRepoUrlResponse>({
        query: queryMap[query],
        variables: { request },
    })
}
