import { queryMyDueFlashcards } from "@/modules/api"
import type { QueryMyDueFlashcardsData } from "@/modules/api"
import { useAppSelector } from "@/redux"
import useSWR from "swr"

/**
 * SWR wrapper for {@link queryMyDueFlashcards}. `data` is the viewer's due-card
 * count plus the cards to review (SM-2), or `null`. User-scoped — only runs once
 * the viewer is authenticated.
 *
 * @param limit - optional cap on the number of cards fetched.
 */
export const useQueryMyDueFlashcardsSwr = (limit?: number) => {
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    return useSWR<QueryMyDueFlashcardsData | null>(
        authenticated ? ["QUERY_MY_DUE_FLASHCARDS_SWR", limit ?? null] : null,
        async () => {
            // unwrap the standard API envelope; null when absent
            const result = await queryMyDueFlashcards({
                request: { limit },
            })
            return result.data?.myDueFlashcards?.data ?? null
        },
    )
}
