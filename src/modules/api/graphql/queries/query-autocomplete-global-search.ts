import { createAuthApolloClient } from "../clients"
import type { GraphQLResponse, QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

export type SearchableEntity =
    | "CourseEntity"
    | "ModuleEntity"
    | "ContentEntity"
    | "LessonVideoEntity"
    | "ChallengeEntity"

export interface AutocompleteGlobalSearchItem {
    id: string
    displayId?: string
    title?: string
    texts?: Array<string>
}

export interface AutocompleteGlobalSearchData {
    courses?: Array<AutocompleteGlobalSearchItem>
    modules?: Array<AutocompleteGlobalSearchItem>
    challenges?: Array<AutocompleteGlobalSearchItem>
    contents?: Array<AutocompleteGlobalSearchItem>
    lessonVideos?: Array<AutocompleteGlobalSearchItem>
}

const query1 = gql`
  query AutocompleteGlobalSearch($request: AutocompleteGlobalSearchRequest!) {
    autocompleteGlobalSearch(request: $request) {
      success
      message
      error
      data {
        courses {
          id
          displayId
          title
          texts
        }
        modules {
          id
          displayId
          title
          texts
        }
        challenges {
          id
          displayId
          title
          texts
        }
        contents {
          id
          displayId
          title
          texts
        }
        lessonVideos {
          id
          displayId
          title
          texts
        }
      }
    }
  }
`

export enum QueryAutocompleteGlobalSearch {
    Query1 = "query1",
}

const queryMap: Record<QueryAutocompleteGlobalSearch, DocumentNode> = {
    [QueryAutocompleteGlobalSearch.Query1]: query1,
}

export interface QueryAutocompleteGlobalSearchRequest {
    query: string
    entities?: Array<SearchableEntity>
    size?: number
}

export interface QueryAutocompleteGlobalSearchResponse {
    autocompleteGlobalSearch: GraphQLResponse<AutocompleteGlobalSearchData>
}

export const queryAutocompleteGlobalSearch = async ({
    query = QueryAutocompleteGlobalSearch.Query1,
    request,
    debug,
    signal,
}: QueryParams<QueryAutocompleteGlobalSearch, QueryAutocompleteGlobalSearchRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.query<QueryAutocompleteGlobalSearchResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
