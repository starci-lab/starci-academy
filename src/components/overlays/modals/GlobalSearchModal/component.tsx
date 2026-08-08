import { InputSearch } from "@/components/atoms/forms"
import React from "react"
import {
    CardsIcon,
    CheckSquareIcon,
    FileTextIcon,
    FlagIcon,
    GraduationCapIcon,
    LightbulbIcon,
    PuzzlePieceIcon,
    StackIcon,
} from "@phosphor-icons/react"
import type { Icon as PhosphorIcon } from "@phosphor-icons/react"
import { ModalShell } from "@/components/composites/layout/ModalShell"

import { Typography } from "@/components/atoms/text/Typography"
import { Cluster } from "@/components/frames/Cluster"
import { StackV } from "@/components/frames/Stack"
import { GlobalSearchContent } from "./Content"

/**
 * `_GlobalSearchModal` — the presentational half of `GlobalSearchModal`, the
 * keyboard-first command palette opened by the Navbar (Ctrl/Cmd+K). Composes
 * `ModalShell`: a search field header, a grouped-results/popular-fallback
 * body (`GlobalSearchContent`), and a keyboard-hint footer row. Every field
 * arrives already resolved — no store, no fetch, no `t()` (see `./index.tsx`).
 *
 * MISSING VOCABULARY (documented, not invented here — see the task's
 * `missingVocabulary` report): the design system has no atom wrapping a
 * `Kbd`-style keycap chip, so the shortcut hints render as plain
 * `Typography` instead of key-cap glyphs; `InputSearch` exposes neither
 * `autoFocus` nor `onKeyDown`, so the palette no longer autofocuses on open
 * nor moves focus into the results on ArrowDown; and there is no
 * roving-tabindex "options list" composite (the old raw HeroUI `ListBox`
 * gave ↑↓ arrow-key navigation between rows for free) — results render
 * through `SurfaceCardList` instead, which is Tab-order only.
 */

/** Entity bucket a pressed search item belongs to — drives its leading icon. */
export type GlobalSearchKind =
    | "course"
    | "module"
    | "content"
    | "challenge"
    | "flashcardDeck"
    | "milestone"
    | "milestoneTask"
    | "foundation"

/** Leading icon per result kind (phosphor) — a required classifier in a mixed result list. */
export const GLOBAL_SEARCH_KIND_ICON: Record<GlobalSearchKind, PhosphorIcon> = {
    course: GraduationCapIcon,
    module: StackIcon,
    content: FileTextIcon,
    challenge: PuzzlePieceIcon,
    flashcardDeck: CardsIcon,
    milestone: FlagIcon,
    milestoneTask: CheckSquareIcon,
    foundation: LightbulbIcon,
}

/** One resolved search-result row — already carries which badges to show; no raw `t()`/store left to read. */
export interface GlobalSearchResultRow {
    /** Stable row key. */
    id: string
    /** Kind of this row — picks the leading icon. */
    kind: GlobalSearchKind
    /** Primary title line. */
    title: string
    /** Additional matched text snippets, may carry `<em>…</em>` markup around the matched span. */
    textLines: Array<string>
    /** Server-built deep link; rows with no path are not actionable. */
    path?: string | null
    /** `true` → an "Enrolled" chip (course rows the viewer already owns). */
    showEnrolledChip: boolean
    /** `true` → a "Free" chip (a not-enrolled free course, or a non-premium lesson). */
    showFreeChip: boolean
    /** `true` → a muted lock glyph (a premium lesson the viewer hasn't unlocked). */
    showPremiumLock: boolean
    /** `true` → the trailing "View course →" hint (course rows only). */
    showViewCourseHint: boolean
}

/** One grouped section of results — one non-empty bucket, header label already interpolated with its count. */
export interface GlobalSearchModalSection {
    /** Bucket kind — also this section's stable key. */
    kind: GlobalSearchKind
    /** Already-translated `"Courses (3)"`-style heading. */
    label: string
    /** Rows in this bucket. */
    items: Array<GlobalSearchResultRow>
}

/** One popular-course fallback row shown while the palette is idle or has no matches. */
export interface GlobalSearchModalPopularCourse {
    /** Stable row key. */
    id: string
    /** Public slug — the connected half routes on this when pressed. */
    displayId: string
    /** Course title. */
    title: string
    /** The viewer's loyalty-discounted price. */
    discountedPriceVnd: number
}

/** Every translated string this modal renders, resolved by the connected half. */
export interface GlobalSearchModalLabels {
    /** Search-field placeholder. */
    placeholder: string
    /** "↑↓ to navigate" hint. */
    hintMove: string
    /** "↵ to open" hint. */
    hintOpen: string
    /** "Esc to close" hint. */
    hintClose: string
    /** Shown when a query was typed but matched nothing. */
    noResults: string
    /** Shown when the query is blank (idle palette). */
    idleHint: string
    /** "Popular" fallback-list heading. */
    popular: string
    /** "Enrolled" chip text. */
    enrolled: string
    /** "Free" chip text. */
    free: string
    /** "View course" trailing hint text. */
    viewCourse: string
    /** Accessible label for the premium-lock glyph. */
    premiumLock: string
}

/** Props for {@link _GlobalSearchModal}. */
export interface GlobalSearchModalProps {
    /** Whether the palette is open. */
    isOpen: boolean
    /** Open-state change handler (backdrop, Escape, close trigger). */
    onOpenChange: (open: boolean) => void
    /** Current (uncommitted) search-field text. */
    query: string
    /** Fires on every keystroke. */
    onQueryChange: (value: string) => void
    /** Non-empty result buckets, in display order. */
    sections: Array<GlobalSearchModalSection>
    /** `true` once a non-blank query has been committed — switches the empty state's copy. */
    hasQuery: boolean
    /** Popular-course fallback rows (idle palette, or a query with no hits). */
    popularCourses: Array<GlobalSearchModalPopularCourse>
    /** Every translated string this modal renders. */
    labels: GlobalSearchModalLabels
    /** Fired when a result row is pressed. */
    onSelectResult: (row: GlobalSearchResultRow) => void
    /** Fired when a popular-course fallback row is pressed. */
    onSelectPopularCourse: (course: GlobalSearchModalPopularCourse) => void
}

/**
 * The keyboard-first search command palette. See the file header for the
 * full contract and the documented vocabulary gaps.
 *
 * @param props - {@link GlobalSearchModalProps}
 */
export const _GlobalSearchModal = ({
    isOpen,
    onOpenChange,
    query,
    onQueryChange,
    sections,
    hasQuery,
    popularCourses,
    labels,
    onSelectResult,
    onSelectPopularCourse,
}: GlobalSearchModalProps) => {
    const header = () => (
        <InputSearch
            ariaLabel={labels.placeholder}
            placeholder={labels.placeholder}
            value={query}
            onValueChange={onQueryChange}
        />
    )

    const body = () => (
        <StackV
            gap={5}
            principle="block-boundary"
            explain="Results above keyboard hints — not sibling-stack, because these are complementary regions rather than repeating peers."
            items={[
                () => (
                    <GlobalSearchContent
                        sections={sections}
                        hasQuery={hasQuery}
                        popularCourses={popularCourses}
                        labels={labels}
                        onSelectResult={onSelectResult}
                        onSelectPopularCourse={onSelectPopularCourse}
                    />
                ),
                () => (
                    // The plain "↑↓"/"↵" glyphs are universal symbols, not translated
                    // copy — composed here (not baked into the i18n string) exactly
                    // like `Content/index.tsx` composes a section's translated label
                    // with its own count. `hintClose` already spells out "esc" in
                    // every locale (`search.hint.close`), so it needs no glyph prefix.
                    <Cluster
                        gap={5}
                        principle="chip-row"
                        explain="Keyboard hint chips share one wrapping row so related shortcuts stay together without stacking as a column."
                        items={[
                            () => <Typography size="xs" color="muted" text={`↑↓ ${labels.hintMove}`} />,
                            () => <Typography size="xs" color="muted" text={`↵ ${labels.hintOpen}`} />,
                            () => <Typography size="xs" color="muted" text={labels.hintClose} />,
                        ]}
                    />
                ),
            ]}
        />
    )

    return (
        <ModalShell
            identity={{ tier: "overlay", component: "GlobalSearchModal" }}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="lg"
            scroll="inside"
            header={header}
            body={body}
        />
    )
}
