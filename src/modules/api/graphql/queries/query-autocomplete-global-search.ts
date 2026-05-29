import { createAuthApolloClient } from "../clients"
import type { QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type {
    QueryAutocompleteGlobalSearchRequest,
    QueryAutocompleteGlobalSearchResponse,
} from "./types"

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
