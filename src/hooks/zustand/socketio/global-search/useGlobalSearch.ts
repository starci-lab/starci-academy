"use client"

import { useSearchOverlayState } from "@/hooks/singleton/overlay-state/impls/useSearchOverlayState"
import { useGlobalSearchFormik } from "@/hooks/singleton/formik/impls/useGlobalSearchFormik"
import { useEffect, useMemo } from "react"
import { useLocale } from "next-intl"
import debounce from "lodash/debounce"
import { useAutocompleteSocketIo } from "../useAutocompleteSocketIo"
import { PublicationEvent } from "../enums"
import type { SearchableEntity } from "../types"

const DEFAULT_ENTITIES: Array<SearchableEntity> = [
    "CourseEntity",
    "ModuleEntity",
    "ContentEntity",
    "LessonVideoEntity",
    "ChallengeEntity",
]

const SEARCH_DEBOUNCE_MS = 200
const RESULT_PAGE_SIZE = 8

/**
 * Return value of {@link useGlobalSearch} — everything the command-palette UI needs
 * except i18n `t(...)` for copy.
 */
export interface UseGlobalSearchResult {
    /** Whether the search modal is open. */
    isOpen: boolean
    /** HeroUI-style open change handler. */
    onOpenChange: (open: boolean) => void
    /** Shared Formik instance (query string). */
    formik: ReturnType<typeof useGlobalSearchFormik>
}

/**
 * Wires search overlay, Formik query, and Socket.IO `PublicationEvent.GlobalSearch` publishes
 * (debounced) while the modal is open. Subscriptions merge into Redux via {@link useAutocompleteSocketIo}.
 * @returns Modal state, formik, and static entity list for rendering.
 */
export const useGlobalSearch = (): UseGlobalSearchResult => {
    const { isOpen, onOpenChange } = useSearchOverlayState()
    const formik = useGlobalSearchFormik()
    const socket = useAutocompleteSocketIo()
    const locale = useLocale()

    const entities = useMemo(() => DEFAULT_ENTITIES, [])

    useEffect(() => {
        if (!isOpen) {
            return
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") {
                return
            }
            event.preventDefault()
            onOpenChange(false)
        }
        window.addEventListener("keydown", onKeyDown)
        return () => {
            window.removeEventListener("keydown", onKeyDown)
        }
    }, [isOpen, onOpenChange])

    useEffect(() => {
        if (!isOpen) {
            return
        }
        const emitSearch = debounce((query: string) => {
            socket.emit(PublicationEvent.GlobalSearch, {
                locale,
                data: {
                    query,
                    entities,
                    size: RESULT_PAGE_SIZE,
                },
            })
        }, SEARCH_DEBOUNCE_MS)
        emitSearch(formik.values.query.trim())
        return () => {
            emitSearch.cancel()
        }
    }, [entities, formik.values.query, isOpen, locale, socket])

    return { isOpen, onOpenChange, formik }
}
