import useSWR from "swr"
import { queryAutocompleteGlobalSearch } from "@/modules/api/graphql/queries/query-autocomplete-global-search"
import { type SearchableEntity } from "@/modules/api/graphql/queries/types/autocomplete-global-search"
import { useSearchOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setGlobalSearchResults } from "@/redux/slices/socketio"

// `autocompleteGlobalSearch` is PUBLIC (BE: KeycloakOptionalAuthGraphQLGuard) — free courses
// and free challenges must be searchable by guests too, so this hook does NOT gate on `authenticated`.

const DEFAULT_ENTITIES: Array<SearchableEntity> = [
    "CourseEntity",
    "ModuleEntity",
    "ContentEntity",
    "ChallengeEntity",
    "MilestoneEntity",
    "MilestoneTaskEntity",
    "FlashcardDeckEntity",
    "FoundationEntity",
]

const DEFAULT_SIZE = 8

/**
 * Queries `autocompleteGlobalSearch` and syncs grouped results into Redux.
 */
export const useAutocompleteGlobalSearchSwr = () => {
    const dispatch = useAppDispatch()
    const { isOpen } = useSearchOverlayState()
    const query = useAppSelector((state) => state.search.query).trim()

    return useSWR(
        isOpen
            ? [
                "QUERY_AUTOCOMPLETE_GLOBAL_SEARCH_SWR",
                query,
                isOpen,
            ]
            : null,
        async () => {
            if (!query) {
                dispatch(setGlobalSearchResults(undefined))
                return undefined
            }
            const response = await queryAutocompleteGlobalSearch({
                request: {
                    query,
                    entities: DEFAULT_ENTITIES,
                    size: DEFAULT_SIZE,
                },
            })
            const payload = response.data?.autocompleteGlobalSearch?.data
            if (!payload) {
                throw new Error("Autocomplete global search not found")
            }
            dispatch(setGlobalSearchResults({ data: payload }))
            return payload
        },
    )
}
