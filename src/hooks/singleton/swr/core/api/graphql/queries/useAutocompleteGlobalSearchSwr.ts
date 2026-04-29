import {
    queryAutocompleteGlobalSearch,
    type SearchableEntity,
} from "@/modules/api"
import {
    useSearchOverlayState
} from "@/hooks/singleton"
import { useAppDispatch, useAppSelector } from "@/redux"
import { setGlobalSearchResults } from "@/redux/slices"
import useSWR from "swr"

const DEFAULT_ENTITIES: Array<SearchableEntity> = [
    "CourseEntity",
    "ModuleEntity",
    "ContentEntity",
    "LessonVideoEntity",
    "ChallengeEntity",
]

const DEFAULT_SIZE = 8

/**
 * Queries `autocompleteGlobalSearch` and syncs grouped results into Redux.
 */
export const useAutocompleteGlobalSearchSwrCore = () => {
    const dispatch = useAppDispatch()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const { isOpen } = useSearchOverlayState()
    const query = useAppSelector((state) => state.search.query).trim()

    return useSWR(
        authenticated && isOpen
            ? [
                "QUERY_AUTOCOMPLETE_GLOBAL_SEARCH_SWR",
                query,
                authenticated,
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
