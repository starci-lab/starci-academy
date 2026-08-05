import type { Meta, StoryObj } from "@storybook/nextjs"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Breadcrumbs` wraps HeroUI `Breadcrumbs` directly, composing no other atom with a
 * story. Every sub-part is a real `@heroui/react` import, so each declares `tier: "heroui"`
 * in `ANNOTATE`, named after the identifier it renders — `Breadcrumbs` (the trail) ·
 * `Breadcrumbs.Item` (one crumb or the "…" placeholder) · `Link` (the collapsed back
 * affordance) · `Skeleton` (a shimmer bar). No `storyId`.
 *
 * The `Skeleton` leaf carries the prop's name (`isSkeleton`) and renders every
 * shape-bearing state known before data: `collapseFrom`/`collapseOnMobile` — plain trail
 * bars · back-link (trail about to collapse) · both responsive variants. The `isSkeleton`
 * branch computes `collapseAlways`/`collapseMobile` from `items.length` and picks the right
 * shape. `maxItems` (Truncated) needs no separate state — the bar count depends on the real
 * item count, unknown while loading.
 */

const meta: Meta<typeof Breadcrumbs> = {
    title: "Atoms/Navigation/Breadcrumbs/Breadcrumbs",
    component: Breadcrumbs,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Breadcrumbs>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Breadcrumbs": { tier: "heroui", role: "the trail root — lays out every crumb in order" },
    "Breadcrumbs.Item": { tier: "heroui", role: "one crumb — a real destination, or the '…' placeholder when the trail is truncated" },
    "Link": { tier: "heroui", role: "the collapsed back affordance, shown once the trail gives way to a single back link" },
    "Skeleton": { tier: "heroui", role: "shimmer bar standing in for a crumb or the back link's glyph/label" },
}

/** Default — full trail; the last crumb is the current page (no `onPress`). */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Breadcrumbs"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Default"
                reason="The one breadcrumb atom, wrapping HeroUI's Breadcrumbs. Truncation is a leaf of the maxItems prop, not a separate component."
                states={[
                    {
                        name: "3-crumb trail, no maxItems/collapseFrom/collapseOnMobile",
                        why: "The full trail renders as plain crumbs; the last one carries no `onPress` so it reads as the current page rather than a link. This is the bare atom, the shape every other leaf below narrows down from.",
                        code: "<Breadcrumbs items={[{ key: \"home\", label: \"Home\", onPress: fn }, …, { key: \"current\", label: \"Lesson 3\" }]} />",
                        render: (
                            <Breadcrumbs
                                items={[
                                    { key: "home", label: "Home", onPress: () => {} },
                                    { key: "course", label: "Advanced React", onPress: () => {} },
                                    { key: "current", label: "Lesson 3: Hooks" },
                                ]}

                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Truncated — trail longer than `maxItems` → the middle collapses into '…' (first · … · last two). */
export const Truncated: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Breadcrumbs"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Truncated"
                states={[
                    {
                        name: "maxItems = 3, 5-crumb trail",
                        why: "The trail shrinks to the first crumb, an ellipsis, then the last two, instead of five crumbs wrapping onto a second line. Deeper ancestors are already reachable from top nav, so collapsing the middle loses no real navigation.",
                        code: "<Breadcrumbs maxItems={3} items={[/* 5 crumbs */]} />",
                        render: (
                            <Breadcrumbs
                                maxItems={3}
                                items={[
                                    { key: "home", label: "Home", onPress: () => {} },
                                    { key: "catalog", label: "Catalog", onPress: () => {} },
                                    { key: "course", label: "Advanced React", onPress: () => {} },
                                    { key: "module", label: "Chapter 2", onPress: () => {} },
                                    { key: "current", label: "Lesson 3: Hooks" },
                                ]}

                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** CollapsedLongTrail — `collapseFrom` → a long trail switches entirely to '← Back' at EVERY width. */
export const CollapsedLongTrail: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Breadcrumbs"
                tier="atom"
                annotate={ANNOTATE}
                leaf="CollapsedLongTrail"
                states={[
                    {
                        name: "collapseFrom = 4, 4-crumb trail",
                        why: "The whole Breadcrumbs trail is replaced by a single back link, at every viewport width. A trail this long would wrap and eat vertical space, and deeper ancestors are already reachable from top nav, so a back link is the honest shape here.",
                        code: "<Breadcrumbs collapseFrom={4} backLabel=\"Back\" items={[/* 4 crumbs */]} />",
                        render: (
                            <Breadcrumbs
                                collapseFrom={4}
                                backLabel="Back"
                                items={[
                                    { key: "home", label: "Home", onPress: () => {} },
                                    { key: "catalog", label: "Catalog", onPress: () => {} },
                                    { key: "course", label: "Advanced React", onPress: () => {} },
                                    { key: "current", label: "Lesson 3: Hooks" },
                                ]}

                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** CollapsedOnMobile — below `@app-sm` (375px container) the trail gives way to a back link. */
export const CollapsedOnMobile: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Breadcrumbs"
                tier="atom"
                annotate={ANNOTATE}
                leaf="CollapsedOnMobile"
                states={[
                    {
                        name: "collapseOnMobile = true, container narrower than @app-sm",
                        why: "The trail swaps for a back link only while the CONTAINER is narrow, and shows the full trail from `@app-sm` up. The fixed 375px wrapper is the mobile signal here, since this reads a container query rather than the viewport addon.",
                        code: "<Breadcrumbs collapseOnMobile backLabel=\"Back\" items={[…]} />",
                        render: (
                            <div data-tier="fixture" className="@container w-[375px] max-w-full rounded-none border border-dashed border-accent p-3">
                                <Breadcrumbs
                                    collapseOnMobile
                                    backLabel="Back"
                                    items={[
                                        { key: "home", label: "Home", onPress: () => {} },
                                        { key: "course", label: "Advanced React", onPress: () => {} },
                                        { key: "current", label: "Lesson 3: Hooks" },
                                    ]}

                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Skeleton — the atom draws its own skeleton leaf; doesn't use Skeleton.*.
 * Renders ALL THREE SHAPES (§12g): plain trail bars · back-link (when
 * `collapseFrom` matches the trail's depth) · both responsive variants (when
 * `collapseOnMobile`, same container-query technique as leaf
 * `CollapsedOnMobile`). Before the fix, all three shapes mounted as the SAME
 * ONE bar strip — the exact tell of "looks identical = ATOM BUG": the skeleton
 * branch RETURNED EARLY before computing `collapseAlways`/`collapseMobile`, so
 * a real trail about to become a back-link still got the wider bar-strip
 * skeleton → layout jumped once data landed. Fixed `Breadcrumbs.tsx`: collapse
 * is now computed RIGHT INSIDE the `isSkeleton` branch (using `items.length`
 * instead of `onPress`, since a skeleton item usually has no `onPress` yet).
 */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Breadcrumbs"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                reason="The skeleton follows the exact shape the loaded trail would resolve to, computed from collapseFrom/collapseOnMobile and the trail depth, so the layout never jumps once real data lands."
                states={[
                    {
                        name: "isSkeleton = true, no collapseFrom/collapseOnMobile",
                        why: "A plain row of trail bars shimmers, one per item, mirroring the shape of `Default`. Nothing here is about to collapse, so the resting shape is the full trail.",
                        code: "<Breadcrumbs isSkeleton items={[…3 crumbs]} />",
                        render: (
                            <Breadcrumbs
                                isSkeleton
                                items={[
                                    { key: "home", label: "Home" },
                                    { key: "course", label: "React" },
                                    { key: "current", label: "Lesson 3" },
                                ]}

                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true, collapseFrom = 3 matching a 3-crumb trail",
                        why: "The bar strip is replaced by a single back-link shimmer, mirroring the shape of `CollapsedLongTrail`. `collapseFrom` matches the trail's own depth, so the loaded trail would collapse too, and the skeleton must match it or the layout would jump.",
                        code: "<Breadcrumbs isSkeleton collapseFrom={3} items={[…3 crumbs]} />",
                        render: (
                            <Breadcrumbs
                                isSkeleton
                                collapseFrom={3}
                                items={[
                                    { key: "home", label: "Home" },
                                    { key: "course", label: "React" },
                                    { key: "current", label: "Lesson 3" },
                                ]}

                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true, collapseOnMobile = true, narrow container",
                        why: "The narrow-container skeleton mirrors the back-link shape, matching `CollapsedOnMobile`'s real behaviour at the same width. The same container query drives both the loaded and the loading trail, so neither ever disagrees with the other.",
                        code: "<Breadcrumbs isSkeleton collapseOnMobile items={[…3 crumbs]} />",
                        render: (
                            <div data-tier="fixture" className="@container w-[375px] max-w-full rounded-none border border-dashed border-accent p-3">
                                <Breadcrumbs
                                    isSkeleton
                                    collapseOnMobile
                                    items={[
                                        { key: "home", label: "Home" },
                                        { key: "course", label: "React" },
                                        { key: "current", label: "Lesson 3" },
                                    ]}

                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
