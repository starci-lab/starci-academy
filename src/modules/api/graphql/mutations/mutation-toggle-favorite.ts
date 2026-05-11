import { createAuthApolloClient } from "../clients"
import { type GraphQLResponse, type MutateParams, type QueryVariables } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const addMutation = gql`
  mutation AddToFavorites($request: AddToFavoritesRequest!) {
    addToFavorites(request: $request) {
      success
      message
      error
      data {
        id
        isFavorite
      }
    }
  }
`

const removeMutation = gql`
  mutation RemoveFromFavorites($request: RemoveFromFavoritesRequest!) {
    removeFromFavorites(request: $request) {
      success
      message
      error
      data {
        id
        isFavorite
      }
    }
  }
`

export interface ToggleFavoriteRequest {
    contentId: string
    /** true = add to favorites, false = remove */
    isFavorite: boolean
}

export interface ToggleFavoriteData {
    id: string
    isFavorite: boolean
}

export interface MutateToggleFavoriteResponse {
    addToFavorites?: GraphQLResponse<ToggleFavoriteData>
    removeFromFavorites?: GraphQLResponse<ToggleFavoriteData>
}

export const mutateToggleFavorite = async ({
    request,
    debug,
    signal,
}: {
    request: ToggleFavoriteRequest
    debug?: boolean
    signal?: AbortSignal
}) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })
    const { contentId, isFavorite } = request
    const result = await apollo.mutate<MutateToggleFavoriteResponse>({
        mutation: isFavorite ? addMutation : removeMutation,
        variables: { request: { contentId } },
    })
    const env = isFavorite
        ? result.data?.addToFavorites
        : result.data?.removeFromFavorites
    return env
}
