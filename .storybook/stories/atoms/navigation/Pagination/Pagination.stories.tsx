import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Pagination } from "@sb-components/atoms/navigation/Pagination/Pagination"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Pagination` wraps HeroUI `Pagination` directly (`Pagination.Previous`/
 * `Pagination.Link`/`Pagination.Ellipsis`/`Pagination.Next` are all sub-parts of
 * the HeroUI compound, not atoms of our own system with their own story).
 * 2026-07-27: the heroui tier was added to canon — each of those sub-parts is
 * still a REAL import, so they still get declared `tier: "heroui"` in `ANNOTATE`
 * below, the name matching the import identifier EXACTLY (no `storyId` needed,
 * there is no story OF OURS to jump to).
 *
 * Leaf `Skeleton` was renamed from `Loading` (2026-07-27, per the ruling: a leaf
 * takes the PROP'S NAME — the prop that produces this leaf is `isSkeleton`).
 * §12g requires Skeleton to render every step WITH A KNOWN SHAPE — but the
 * "windowing" axis (Default = every page shown in full, ManyPages = the far
 * pages collapsed into '…') depends DIRECTLY on `totalPages`, which is exactly
 * the number NOT YET AVAILABLE while loading (the very reason it's skeleton in
 * the first place). Unlike `Button`'s `size` or `Breadcrumbs`'s `collapseFrom`
 * (known ahead of time by the caller, independent of data), windowing here
 * CANNOT be known ahead of time ⇒ one representative shape (a row of squares)
 * is enough, not a missed step.
 *
 * MIGRATED TO `states` (2026-07-27): each leaf below still renders exactly one
 * shape, so each carries a single `states[]` entry.
 */

const meta: Meta<typeof Pagination> = {
    title: "Atoms/Navigation/Pagination/Pagination",
    component: Pagination,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Pagination>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Pagination.Previous": { tier: "heroui", role: "steps back one page, disabled on page 1" },
    "Pagination.Link": { tier: "heroui", role: "one concrete page number, filled when it's the active page" },
    "Pagination.Ellipsis": { tier: "heroui", role: "collapses a run of distant pages between the visible ones" },
    "Pagination.Next": { tier: "heroui", role: "steps forward one page, disabled on the last page" },
    "Skeleton": { tier: "heroui", role: "shimmer square standing in for a page link before totalPages is known" },
}

/** Default — few pages → every page shown in full, no '…'. Migrated to `states` 2026-07-27. */
export const Default: Story = {
    render: () => {
        const [page, setPage] = useState(2)
        return (
            <div data-tier="fixture" className="p-8">
                <BlockAnatomy
                    name="Pagination"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Default"
                    reason="The one page-nav atom wrapping HeroUI Pagination — windowing and the '…' ellipsis are a leaf (prop-driven) for large page counts, not a separate component."
                    states={[
                        {
                            name: "totalPages = 5 (under the collapse threshold)",
                            why: "Every page link from 1 to 5 renders in a row, with no `Ellipsis` node anywhere in it. Below the collapse threshold there is nothing worth hiding, so showing every page keeps the whole range one glance away.",
                            code: "<Pagination currentPage={page} totalPages={5} onPageChange={setPage} />",
                            render: <Pagination currentPage={page} totalPages={5} onPageChange={setPage} showAnatomy />,
                        },
                    ]}
                />
            </div>
        )
    },
}

/** ManyPages — many pages → distant pages collapse into '…' (first · … · current±1 · … · last). Migrated to `states` 2026-07-27. */
export const ManyPages: Story = {
    render: () => {
        const [page, setPage] = useState(12)
        return (
            <div data-tier="fixture" className="p-8">
                <BlockAnatomy
                    name="Pagination"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="ManyPages"
                    states={[
                        {
                            name: "totalPages = 24, currentPage = 12 (over the collapse threshold)",
                            why: "Two `Ellipsis` nodes appear, collapsing the run between page 1 and page 11, and between page 13 and page 24, into `1 · … · 11 12 13 · … · 24`. Listing all 24 links would make the current page hard to find, so only the first, last, and immediate neighbours of the current page stay visible.",
                            code: "<Pagination currentPage={12} totalPages={24} onPageChange={setPage} />",
                            render: <Pagination currentPage={page} totalPages={24} onPageChange={setPage} showAnatomy />,
                        },
                    ]}
                />
            </div>
        )
    },
}

/** Skeleton — the atom draws its own leaf skeleton (a row of squares); no Skeleton.* used. Migrated to `states` 2026-07-27. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Pagination"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The whole page-link row is replaced by a row of shimmer squares owned by this atom, instead of any real `Previous`/`Link`/`Next` node. Windowing can't be previewed here because `totalPages` is exactly the number that hasn't loaded yet, so a single representative shape is all a caller can show.",
                        code: "<Pagination isSkeleton currentPage={1} totalPages={5} onPageChange={fn} />",
                        render: <Pagination isSkeleton currentPage={1} totalPages={5} onPageChange={() => {}} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}
