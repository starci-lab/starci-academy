import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type {
    MyOpenPlaygroundSessionRequest,
    PlaygroundRequest,
    PlaygroundsRequest,
    QueryMyOpenPlaygroundSessionResponse,
    QueryPlaygroundResponse,
    QueryPlaygroundsResponse,
} from "./types/playground"

const playgroundsQuery1 = gql`
  query Playgrounds($courseId: ID!) {
    playgrounds(courseId: $courseId) {
      success
      message
      error
      data {
        id
        slug
        title
        icon
        stepCount
      }
    }
  }
`

export enum QueryPlaygrounds {
    Query1 = "query1",
}

const playgroundsQueryMap: Record<QueryPlaygrounds, DocumentNode> = {
    [QueryPlaygrounds.Query1]: playgroundsQuery1,
}

/**
 * Lists the Playground exercises available for one course (hub list).
 * Mirrors backend `playgrounds` (queries/playground/playgrounds).
 */
export const queryPlaygrounds = async ({
    query = QueryPlaygrounds.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryPlaygrounds, PlaygroundsRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryPlaygroundsResponse>({
        query: playgroundsQueryMap[query],
        variables: {
            courseId: request?.courseId,
        },
    })
}

const playgroundQuery1 = gql`
  query Playground($slug: String!) {
    playground(slug: $slug) {
      success
      message
      error
      data {
        id
        slug
        title
        kind
        steps {
          sortIndex
          title
          body
          commandHint
          actionHint
        }
      }
    }
  }
`

export enum QueryPlayground {
    Query1 = "query1",
}

const playgroundQueryMap: Record<QueryPlayground, DocumentNode> = {
    [QueryPlayground.Query1]: playgroundQuery1,
}

/**
 * Loads one Playground exercise by slug (guided steps + command hints).
 * Mirrors backend `playground` (queries/playground/playground).
 */
export const queryPlayground = async ({
    query = QueryPlayground.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryPlayground, PlaygroundRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryPlaygroundResponse>({
        query: playgroundQueryMap[query],
        variables: {
            slug: request?.slug,
        },
    })
}

const myOpenPlaygroundSessionQuery1 = gql`
  query MyOpenPlaygroundSession($playgroundId: String!) {
    myOpenPlaygroundSession(playgroundId: $playgroundId) {
      success
      message
      error
      data {
        id
        pairingCode
        pairingCodeExpiresAt
        connected
      }
    }
  }
`

export enum QueryMyOpenPlaygroundSession {
    Query1 = "query1",
}

const myOpenPlaygroundSessionQueryMap: Record<QueryMyOpenPlaygroundSession, DocumentNode> = {
    [QueryMyOpenPlaygroundSession.Query1]: myOpenPlaygroundSessionQuery1,
}

/**
 * Looks up the caller's still-usable session for one playground so a page reload
 * RESUMES it instead of creating a new one. Mirrors backend
 * `myOpenPlaygroundSession` (queries/playgrounds/my-open-playground-session).
 */
export const queryMyOpenPlaygroundSession = async ({
    query = QueryMyOpenPlaygroundSession.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryMyOpenPlaygroundSession, MyOpenPlaygroundSessionRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryMyOpenPlaygroundSessionResponse>({
        query: myOpenPlaygroundSessionQueryMap[query],
        variables: {
            playgroundId: request?.playgroundId,
        },
    })
}
