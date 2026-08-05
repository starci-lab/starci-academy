import { InputSearch } from "@/components/atoms/forms"
import React from "react"
import { ListBox, ScrollShadow } from "@heroui/react"
import { CardsThreeIcon, MicrophoneStageIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"

import { StackV } from "@/components/frames/Stack"
import { Box } from "@/components/frames/Box"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Placeholder row count the deck list shows while the first load is in flight. */
const SKELETON_ROW_COUNT = 5

/** Study mode vs quiz mode — the top mode switch. */
export type FlashcardStudyRailMode = "study" | "quiz"

/** One deck row, already resolved (sorted + search-filtered) by the connected `FlashcardStudyRail`. */
export interface FlashcardStudyRailDeck {
    id: string
    title: string
    dueCount?: number
}

/** All display text, already localized by the connected `FlashcardStudyRail`; a story passes i18n keys. */
export interface FlashcardStudyRailLabels {
    /** Accessible name for the mode-switch tab list. */
    modeAria: string
    modeStudy: string
    modeQuiz: string
    /** Visible caption above the deck search box, and the deck list's accessible name. */
    decksLabel: string
    /** Accessible name for the search box (falls back to the placeholder, matching the pre-split behaviour). */
    searchAria: string
    searchPlaceholder: string
    /** Empty-state title — the connected file already picks between the generic and the "no match for <query>" phrasing. */
    emptyTitle: string
    errorTitle: string
}

/** Props for {@link _FlashcardStudyRail} — presentational; all data resolved, no fetch/store/i18n. */
export interface FlashcardStudyRailProps extends WithClassNames<undefined> {
    /** First load, nothing in hand → the deck list shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with no deck to show (search narrowed the list to nothing, or the course has none). */
    isEmpty?: boolean
    /** Truthy → the error message (beats a stale loading flag). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler for the error branch — the connected file's SWR `mutate`. */
    onRetry?: () => void
    mode: FlashcardStudyRailMode
    onModeChange: (mode: FlashcardStudyRailMode) => void
    /** Deck-search box value — study mode only. */
    query: string
    onQueryChange: (query: string) => void
    /** The deck highlighted in the rail (none during the cross-deck due session). */
    activeDeckId: string | null
    /** Already sorted + search-filtered decks. */
    decks: Array<FlashcardStudyRailDeck>
    onSelectDeck: (deckId: string) => void
    labels: FlashcardStudyRailLabels
}

/**
 * The flashcards LEFT RAIL — the same docs-style sidebar as the content-map rail
 * (pinned header + scroll region, full rail height). A mode switch (Study / Quiz)
 * + the course's decks as a searchable nav list; all selection drives the URL
 * (owned by the connected file), so the rail (layout) and the work pane (page)
 * share one source of truth. Presentational half of {@link FlashcardStudyRail}
 * (`tiers/split.md`): the deck list threads `isSkeleton` to every leaf so the
 * shimmer mirrors the loaded shape (loading-and-skeleton.md) instead of a
 * separate hand-kept skeleton tree — `error` beats a stale loading flag,
 * `isEmpty` is only read once settled.
 *
 * The deck list still composes HeroUI's `ListBox`/`ScrollShadow` directly: no
 * design-system atom wraps a selectable nav list or a shadowed scroll region
 * yet (the same gap the sibling `PracticeRail`/`ArchitectureRail` rails carry),
 * so this is a genuine vocabulary gap rather than a shape to invent here.
 *
 * @param props - {@link FlashcardStudyRailProps}
 */
export const _FlashcardStudyRail = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    mode,
    onModeChange,
    query,
    onQueryChange,
    activeDeckId,
    decks,
    onSelectDeck,
    labels,
    className,
}: FlashcardStudyRailProps) => {
    // placeholder rows while shimmering keep the SAME ListBox + row shape as the real decks —
    // only the leaves (Typography/Chip) switch to their own shimmer (loading-and-skeleton.md).
    const rows: Array<FlashcardStudyRailDeck> = isSkeleton
        ? Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({ id: `skeleton-${index}`, title: "" }))
        : decks

    /** error → skeleton/content → empty, in priority order (loading-and-skeleton.md). */
    const renderDeckRegion = () => {
        if (error) {
            return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} />
        }
        if (!isSkeleton && isEmpty) {
            return <AsyncContentEmpty title={labels.emptyTitle} />
        }
        return (
            <ListBox
                aria-label={labels.decksLabel}
                selectionMode="single"
                selectedKeys={activeDeckId ? [activeDeckId] : []}
                onSelectionChange={(keys) => {
                    // rows are placeholders while shimmering — nothing real to select onto
                    if (isSkeleton) return
                    const key = [...keys][0]
                    if (typeof key === "string") {
                        onSelectDeck(key)
                    }
                }}
                className="gap-1 p-0"
            >
                {rows.map((deck) => (
                    <ListBox.Item
                        key={deck.id}
                        id={deck.id}
                        textValue={deck.title}
                        className="cursor-pointer rounded-2xl px-3 py-2 data-[hovered=true]:bg-default-100 data-[selected=true]:bg-accent-soft"
                    >
                        <span className="flex w-full min-w-0 items-center justify-between gap-2">
                            <Typography
                                size="sm"
                                truncate
                                isSkeleton={isSkeleton}
                                classNames={["min-w-0", "flex-1"]}
                                text={deck.title}
                            />
                            {isSkeleton || deck.dueCount ? (
                                <Chip
                                    isSkeleton={isSkeleton}
                                    tone="warning"
                                    text={deck.dueCount}
                                    classNames={["shrink-0"]}
                                />
                            ) : null}
                        </span>
                    </ListBox.Item>
                ))}
            </ListBox>
        )
    }

    return (
        <Box
            identity={{ tier: "block", component: "FlashcardStudyRail" }}
            className={`relative flex min-h-0 min-w-0 flex-col gap-3 p-6${className ? ` ${className}` : ""}`}
        >
            {/* pinned header: mode switch + deck search (study mode only) */}
            <StackV gap={4} items={[
                () => (
                    <TabsCard
                        variant="primary"
                        leftTabs={{
                            selectedKey: mode,
                            ariaLabel: labels.modeAria,
                            onSelectionChange: (key) => {
                                if (key === "study" || key === "quiz") {
                                    onModeChange(key)
                                }
                            },
                            items: [
                                {
                                    key: "study",
                                    icon: <CardsThreeIcon className="size-4 shrink-0" aria-hidden focusable="false" />,
                                    label: labels.modeStudy,
                                },
                                {
                                    key: "quiz",
                                    icon: <MicrophoneStageIcon className="size-4 shrink-0" aria-hidden focusable="false" />,
                                    label: labels.modeQuiz,
                                },
                            ],
                        }}
                    />
                ),
                ...(mode === "study" ? [() => (
                    <InputSearch
                        label={labels.decksLabel}
                        ariaLabel={labels.searchAria}
                        placeholder={labels.searchPlaceholder}
                        value={query}
                        onValueChange={onQueryChange}
                    />
                )] : []),
            ]} />

            {/* scroll region: the deck nav list (study mode only) */}
            {mode === "study" ? (
                <ScrollShadow hideScrollBar className="-mx-1 min-h-0 min-w-0 flex-1 overflow-y-auto px-1">
                    {renderDeckRegion()}
                </ScrollShadow>
            ) : null}
        </Box>
    )
}
