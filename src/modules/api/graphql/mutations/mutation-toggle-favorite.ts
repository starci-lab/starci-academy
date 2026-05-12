import { createAuthApolloClient } from "../clients"
import { MutateParams, type GraphQLResponse } from "../types"
import { gql } from "@apollo/client"

const mutation = gql`
  mutation ToggleFavourite($request: ToggleFavouriteRequest!) {
    toggleFavourite(request: $request) {
      success
      message
      error
    }
  }
`

export interface ToggleFavoriteRequest {
    /** Content ID to toggle favourite for. */
    contentId: string
    /** true = add to favorites, false = remove. */
    isFavorite: boolean
}

export type MutateToggleFavoriteParams = MutateParams<
    MutateToggleFavoriteResponse,
    ToggleFavoriteRequest
>

export interface ToggleFavoriteData {
    /** User content record ID. */
    id: string
    /** Current favourite state after toggle. */
    isFavorite: boolean
}

export interface MutateToggleFavoriteResponse {
    toggleFavourite: GraphQLResponse<ToggleFavoriteData>
}

export const mutateToggleFavorite = async ({
    request,
    debug,
    headers,
    signal,
}: MutateToggleFavoriteParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        headers,
        signal,
    })
    const result = await apollo.mutate<MutateToggleFavoriteResponse>({
        mutation,
        variables: { request },
    })
    return result.data?.toggleFavourite
}
