import React from "react"
import { AsyncContent, type AsyncContentEmptyProps } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { Grid, type GridItem } from "@sb-components/frames/Grid/Grid"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ConsultantCard, type ConsultantCardConsultant } from "@sb-components/starci/blocks/consultant/ConsultantCard/ConsultantCard"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ConsultantDirectoryGrid`: the BROWSE surface of the consultant
 * directory — how many consultants matched, then the cards themselves, across
 * the full loading → empty → content lifecycle.
 *
 * REUSE, NOT A REBUILD (the exact trap this run exists to correct — see
 * `ContentModeNav`'s file header for the shape of that bug). Nothing here is
 * hand-rolled:
 *   • `AsyncContent` (composite)  — the error → loading → empty → content
 *     switch, ported straight from the real `ConsultantGrid`'s
 *     `isLoading={!consultants}` / `isEmpty={sortedConsultants.length === 0}`
 *     gating (`src/…/Headhuntings/ConsultantGrid/index.tsx`).
 *   • `Grid` (frame)              — the responsive tile track. The block only
 *     decides the column steps and the seam; it does not lay out cells itself.
 *   • `Typography` (atom)         — the count line's text, real or its own
 *     skeleton bar.
 *   • `ConsultantCard` (block)    — one consultant tile, UNCHANGED. This block
 *     never reaches past it to draw an avatar/name/company card by hand — that
 *     shape already belongs to `ConsultantCard`.
 * This block only decides HOW MANY tiles, IN WHAT SHAPE, and WHAT the count
 * line says — never how one card itself looks.
 *
 * WHAT THIS BLOCK OWNS (§14d.1 — domain wording the caller must not hand in):
 * the count line's wording ("N chuyên viên tư vấn"). The caller hands over a
 * bare `count` number, never a pre-formatted string — same contract
 * `FoundationCategorySearchBar` and `ModuleHeader`-style meta rows use. The
 * EMPTY message itself (`emptyTitle`) stays a caller prop rather than an owned
 * string, because — unlike the count — the directory's "nothing matched"
 * copy depends on caller-side context this block never receives (plain empty
 * course roster vs. a search that came up empty), exactly like the real
 * `ConsultantGrid` which hands `AsyncContent` an already-translated
 * `t("headhuntings.empty")` rather than deciding the words itself.
 *
 * ⭐ `isLoading` IS A SEPARATE PROP FROM `consultants`, on purpose — matching
 * `AsyncContent`'s own contract (§ composite doc): the region's loading state
 * is never INFERRED from content presence, it is always an explicit signal
 * the caller passed in already reduced. The real screen computes it exactly
 * as `!consultants` (the Redux slice not yet resolved) and hands the FLAG
 * down, not the raw undefined-vs-array distinction — this block stays a pure
 * function of `{ isLoading, isEmpty }` like every other `AsyncContent` user
 * in this tree.
 *
 * ⭐ `count` IS NOT `consultants.length` — the count line answers "how many
 * consultants are listed in this directory", which the real query resolves
 * once at the top of the page. `consultants` is only what got fetched for the
 * grid itself. Kept as two separate props rather than deriving one from the
 * other so a future paginated/filtered directory does not have to lie by
 * passing a page slice's length as the total (same reasoning
 * `FlashcardDeckList` documents for its own added `totalPages` prop).
 *
 * 📐 ONE LEAF (`Default`), per the brief. `isLoading` / `isEmpty` swap which
 * `AsyncContent` branch renders (skeleton grid ↔ empty message ↔ real grid),
 * but the block's own shape never changes — it is always "a count line above
 * one grid-shaped region" — so these are STATES of the one leaf, not leaves
 * of their own (§14d.2: a branch `AsyncContent` itself already owns is not a
 * NEW structural fork for the block wrapping it, same call
 * `FoundationResourceList`'s R0 note makes for `resources.length === 0`).
 *
 * ⭐ JUDGEMENT CALL — the count line lives INSIDE `AsyncContent`'s `content`
 * slot, beside the grid, not as permanent chrome above the whole switch. A
 * "0 chuyên viên tư vấn" line sitting on top of the empty message would say
 * the same thing twice in two different voices; the count is only worth
 * saying once real cards are on screen to be counted.
 *
 * ⭐ JUDGEMENT CALL — `count === undefined` renders NO count line at all
 * (rather than falling back to `consultants?.length`), matching
 * `FoundationCategorySearchBar`'s "count not known yet" contract: a directory
 * that has cards but has not resolved its total should stay silent, not
 * guess a number from whatever page happened to load.
 *
 * ⭐ SKELETON TILES CARRY A BLANK PLACEHOLDER `consultant`, never a press
 * handler that could fire. `ConsultantCard` takes `consultant` unconditionally
 * (it has no `undefined`-shaped variant), so the placeholder is an id-only,
 * name-empty stub — `ConsultantCard`'s own `isSkeleton` branch never reads any
 * of its text fields anyway (§12c: the atom, not this block, decides what a
 * loading tile shows).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link ConsultantDirectoryGrid}. */
export interface ConsultantDirectoryGridProps {
    /**
     * The current page's consultants, already sorted by the caller. `undefined`
     * ⇒ the list has not resolved yet (see {@link ConsultantDirectoryGridProps.isLoading}).
     */
    consultants?: Array<ConsultantCardConsultant>
    /**
     * How many consultants the directory lists in total. `undefined` ⇒ the
     * count line does not render yet (see file header's judgement call).
     */
    count?: number
    /**
     * `true` while the consultant list's own fetch has not resolved. Passed
     * straight to `AsyncContent` — this block never infers it from
     * `consultants` itself (see file header).
     */
    isLoading: boolean
    /** Fired with a consultant's id when their card is pressed. */
    onOpenConsultant: (id: string) => void
    /** The empty-state message, already localized by the caller (see file header for why this stays a caller prop). */
    emptyTitle: string
    /** Accessible name for the directory region — the block has no visible heading of its own. */
    ariaLabel: string
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/** How many placeholder tiles mirror the grid while the list hasn't resolved — ported from the real `ConsultantGrid`'s `SKELETON_COUNT`. */
const SKELETON_TILE_COUNT = 6

/** Skeleton tiles pass this as `onOpen` — `ConsultantCard.isSkeleton` disables its own press, so it never fires. */
const NOOP = () => {}

/** The block's own wording for the count line (§14d.1) — the caller only ever hands over a bare number. */
const countLabel = (count: number): string => `${count} chuyên viên tư vấn`

/**
 * The consultant directory's browse surface. See the file header for the full
 * contract and why the count line only shows beside real cards.
 *
 * @param props - {@link ConsultantDirectoryGridProps}
 */
const ConsultantDirectoryGrid = ({
    consultants,
    count,
    isLoading,
    onOpenConsultant,
    emptyTitle,
    ariaLabel,
    showAnatomy = false,
    anatPart,
}: ConsultantDirectoryGridProps) => {
    // Resolved-but-zero, matching the real `ConsultantGrid`'s Redux-driven gating
    // (`!consultants` = loading, `sortedConsultants.length === 0` = empty).
    const isEmpty = !isLoading && (consultants?.length ?? 0) === 0

    const skeletonTiles: Array<GridItem> = Array.from({ length: SKELETON_TILE_COUNT }, (_unused, index) => ({
        key: `skeleton-${index}`,
        content: (
            <ConsultantCard
                consultant={{ id: `skeleton-${index}`, fullName: "" }}
                onOpen={NOOP}
                isSkeleton
                showAnatomy={showAnatomy}
                anatPart={showAnatomy ? "ConsultantCard" : undefined}
            />
        ),
    }))

    const tiles: Array<GridItem> = (consultants ?? []).map((consultant) => ({
        key: consultant.id,
        content: (
            <ConsultantCard
                consultant={consultant}
                onOpen={onOpenConsultant}
                showAnatomy={showAnatomy}
                anatPart={showAnatomy ? "ConsultantCard" : undefined}
            />
        ),
    }))

    const emptyContent: AsyncContentEmptyProps = {
        title: emptyTitle,
        anatPart: showAnatomy ? "AsyncContentEmpty" : undefined,
        showAnatomy,
    }

    return (
        <div data-anat-part={anatPart} role="region" aria-label={ariaLabel}>
            <AsyncContent
                isLoading={isLoading}
                skeleton={
                    <div data-anat-part={showAnatomy ? "Grid" : undefined}>
                        <Grid columns={{ base: 1, sm: 2, lg: 3 }} gap="grouped" items={skeletonTiles} showAnatomy={showAnatomy} />
                    </div>
                }
                isEmpty={isEmpty}
                emptyContent={emptyContent}
                showAnatomy={showAnatomy}
                content={
                    <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined} body={
                        <>
                            {count !== undefined ? (
                                <Typography size="sm" color="muted" text={countLabel(count)} showAnatomy={showAnatomy} anatPart={showAnatomy ? "Typography" : undefined} />
                            ) : null}
                            <div data-anat-part={showAnatomy ? "Grid" : undefined}>
                                <Grid columns={{ base: 1, sm: 2, lg: 3 }} gap="grouped" items={tiles} showAnatomy={showAnatomy} />
                            </div>
                        </>
                    } />
                }
            />
        </div>
    )
}

export { ConsultantDirectoryGrid }
