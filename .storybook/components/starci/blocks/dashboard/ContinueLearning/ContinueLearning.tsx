import React from "react"
import { ContinueCardItem } from "@sb-components/starci/blocks/learn/ContinueCard/ContinueCard"
import { AsyncContent } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { Grid, type GridItem } from "@sb-components/frames/Grid/Grid"
import { Button } from "@sb-components/atoms/buttons/Button/Button"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ContinueLearning` (dashboard): the "Continue learning" content slot —
 * a capped set of resume targets (recently-read lessons, mixed with AT MOST one
 * in-progress challenge), or an onboarding CTA when there is nothing to resume
 * yet. Content only — the PAGE frames it with a label; this block never draws
 * its own title (mirrors the real `src/components/features/dashboard/ContinueLearning`,
 * whose own file header says the same: "the greeting lives in the identity column").
 *
 * ⭐ AUDITED FROM `src` 2026-07-31 (matrix-driven build). Data shape in hand: a
 * CAPPED array (≤3, decided upstream by the real `useResumeItems` hook — this
 * block does not slice) of `{ globalId, label, kind }`, `kind` a closed
 * two-value enum (`"lesson" | "challenge"`) that only changes a subtitle word,
 * no long free text anywhere. `node scripts/matrix.mjs` answers:
 *   • `"An ARRAY of UNIFORM cells divided by COLUMN COUNT at container-query steps"`
 *     → `Grid` (frames) — the resume cards reflow `1 → 2 → 3` columns exactly like
 *     the real component's `@app-sm:grid-cols-2 @app-lg:grid-cols-3`.
 *   • `"'Nothing here yet' + at most one way out"` → `AsyncContentEmpty` — the
 *     onboarding CTA (message + one button), reached whether the viewer has zero
 *     courses or zero resume targets; only the WORDING forks on `hasCourses`.
 *   • The card itself is NOT re-derived: `ContinueCardItem` (design tier,
 *     `starci/blocks/learn/ContinueCard`) already owns exactly this shape — its
 *     own JSDoc says `".Item — ONE of N 'continue' cards in a list/grid"`. This
 *     block only decides WHICH `kind` word becomes the subtitle; it never
 *     reshapes the card.
 *
 * LEAF BY STRUCTURE (§14d.2), three of them:
 *   1. Content — 1–3 `ContinueCardItem` tiles inside a `Grid`.
 *   2. Empty   — the WHOLE track is replaced by `AsyncContentEmpty`; wording
 *      forks on `hasCourses` (browse courses vs. nothing resumed yet), but the
 *      shape never forks — always one message + one button.
 *   3. Loading — `items` still empty and `isLoading`: a guessed 3-tile grid,
 *      each tile `ContinueCardItem`'s OWN skeleton mirror (no fabricated title).
 *
 * FULL STATE SET (read before building — nothing left unstated):
 *   • empty   → leaf 2 (two wordings, one shape).
 *   • loading → leaf 3.
 *   • error   → ABSENT, WITH REASON: the real `useResumeItems` hook merges three
 *     SWR queries into `{ resumeItems, hasCourses, isLoading }` — no `error`
 *     field ever reaches this block, so there is no error branch to model
 *     (confirmed by reading `useResumeItems.ts`: SWR errors are not surfaced).
 *   • content → leaf 1.
 *   • pending → ABSENT, WITH REASON: the real `ResumeCard` holds a LOCAL
 *     `pending` flag while it resolves a card's route before navigating
 *     (`queryResolveRoute`). That is a per-press UI detail owned by the caller
 *     that presses `onSelectItem`, not data this presentational block receives
 *     or a shape it draws — nothing in the entity below carries a pending state.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Resume target kind — the ONLY thing that changes the card's subtitle wording. */
export type ContinueLearningItemKind = "lesson" | "challenge"

/** One "pick up where you left off" resume target. */
export interface ContinueLearningItem {
    /** Opaque id — the block never resolves it itself, that's the caller's job on press. */
    id: string
    /** Title to show — already the display string, no further formatting here. */
    title: string
    /** Lesson vs. challenge — drives the subtitle word only. */
    kind: ContinueLearningItemKind
}

/** Props for {@link ContinueLearning}. */
export interface ContinueLearningProps {
    /** Resume targets, already capped + de-duplicated by the caller (§14d.1 — this block does not slice). */
    items: ReadonlyArray<ContinueLearningItem>
    /** `true` → the viewer has joined at least one course (decides the empty leaf's wording). */
    hasCourses: boolean
    /** `true` while the underlying leaf queries are loading (feeds the Loading leaf). */
    isLoading: boolean
    /** Fired with an item's `id` when its card is pressed. */
    onSelectItem: (id: string) => void
    /** Fired when the onboarding CTA is pressed (both empty wordings share one action). */
    onBrowseCourses: () => void
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
}

/** Subtitle word per kind — the block's own wording (§14d.1: design never sees "lesson"/"challenge"). */
const KIND_LABEL: Record<ContinueLearningItemKind, string> = {
    lesson: "Currently reading",
    challenge: "Challenge in progress",
}

/** Placeholder tiles for the guessed 3-card skeleton grid (§12c) — never carry a press handler. */
const SKELETON_ITEMS: Array<ContinueLearningItem> = [
    { id: "skeleton-0", title: "", kind: "lesson" },
    { id: "skeleton-1", title: "", kind: "lesson" },
    { id: "skeleton-2", title: "", kind: "lesson" },
]

/**
 * The dashboard's "Continue learning" content. See the file header for the full
 * leaf/state contract.
 *
 * @param props - {@link ContinueLearningProps}
 */
const ContinueLearning = ({
    items,
    hasCourses,
    isLoading,
    onSelectItem,
    onBrowseCourses,
}: ContinueLearningProps) => {
    const usingPlaceholders = isLoading && items.length === 0
    const source = usingPlaceholders ? SKELETON_ITEMS : items

    const tiles: Array<GridItem> = source.map((item) => ({
        key: item.id,
        content: (
            <ContinueCardItem
                isSkeleton={usingPlaceholders}
                title={item.title}
                subtitle={KIND_LABEL[item.kind]}
                onPress={usingPlaceholders ? undefined : () => onSelectItem(item.id)}


            />
        ),
    }))

    return (
        <div>
            <AsyncContent
                isLoading={isLoading && items.length === 0}
                skeleton={<Grid items={tiles} columns={{ base: 1, sm: 2, lg: 3 }} gap={4} />}
                isEmpty={!isLoading && items.length === 0}
                emptyContent={{
                    title: hasCourses
                        ? "You haven't read any lessons or attempted any challenges yet."
                        : "You haven't joined any courses yet.",
                    description: hasCourses
                        ? "Start a lesson so it shows up here under \"Continue learning\"."
                        : undefined,
                    action: (
                        <Button
                            variant="primary"
                            size="sm"
                            label="Browse courses"
                            onPress={onBrowseCourses}

                        />
                    ),

                }}

            >
                <Grid items={tiles} columns={{ base: 1, sm: 2, lg: 3 }} gap={4} />
            </AsyncContent>
        </div>
    )
}

export { ContinueLearning }
