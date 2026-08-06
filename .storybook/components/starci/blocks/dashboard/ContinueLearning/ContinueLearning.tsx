import React from "react"
import { ContinueCardItem } from "@sb-components/starci/blocks/learn/ContinueCard/ContinueCard"
import { AsyncContent } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { Grid, type GridItem } from "@sb-components/frames/Grid/Grid"
import { Button } from "@sb-components/atoms/buttons/Button/Button"

/**
 * `ContinueLearning` (dashboard) — the "Continue learning" slot: up to 3 resume
 * targets (lessons lead, at most one in-progress challenge as a nudge), or an
 * onboarding CTA when there is nothing to resume. Three leaves: `Content`
 * (1–3 tiles in a `Grid`), `Empty` (`AsyncContentEmpty`, wording forks on
 * `hasCourses`), and `Loading` (a 3-tile skeleton grid).
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
        content: () => (
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
                skeleton={() => <Grid items={tiles} columns={{ base: 1, sm: 2, lg: 3 }} principle="content-row"
                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                />}
                isEmpty={!isLoading && items.length === 0}
                emptyContent={{
                    title: hasCourses
                        ? "You haven't read any lessons or attempted any challenges yet."
                        : "You haven't joined any courses yet.",
                    description: hasCourses
                        ? "Start a lesson so it shows up here under \"Continue learning\"."
                        : undefined,
                    action: () => (
                        <Button
                            variant="primary"
                            size="sm"
                            label="Browse courses"
                            onPress={onBrowseCourses}

                        />
                    ),

                }}
                content={() => <Grid items={tiles} columns={{ base: 1, sm: 2, lg: 3 }} principle="content-row"
                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                />}
            />
        </div>
    )
}

export { ContinueLearning }
