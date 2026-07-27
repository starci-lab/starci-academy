import type { Meta, StoryObj } from "@storybook/nextjs"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Breadcrumbs.Base` wraps HeroUI `Breadcrumbs` directly, composing no
 * other atom of the SYSTEM with its own story. 2026-07-27 (heroui tier added to
 * canon): every sub-part is still a REAL import from `@heroui/react`, so each one
 * is declared `tier: "heroui"` in `ANNOTATE` below, named after the identifier it
 * actually renders — `Breadcrumbs` (the trail) · `Breadcrumbs.Item` (one crumb, a
 * real destination or the "…" placeholder) · `Link` (the collapsed back
 * affordance) · `Skeleton` (a shimmer bar). No `storyId` — there's no story of
 * ours to jump to for a library component. Renamed from the old role-shaped names
 * `Crumb`/`Ellipsis`/`Back`/`SkeletonBack`, which pretended to be four different
 * components when they're really the SAME two HeroUI imports wearing different
 * hats (§ two-rule pass, 2026-07-27).
 *
 * Leaf `Skeleton` renamed from `Loading` (2026-07-27, teacher's call: a leaf
 * carries the PROP'S NAME — the prop that produces this leaf is `isSkeleton`).
 * §12g: ONE `isSkeleton` leaf must render EVERY shape-bearing state that prop
 * itself produces when known in advance (not waiting on data) — here that's
 * `collapseFrom`/`collapseOnMobile`: plain trail bars · back-link (the real
 * trail is about to collapse) · both responsive variants. Before the fix
 * (2026-07-27) the component ALWAYS emitted one bar strip regardless of these
 * two props — a real bug, the same shape as the `Button.Base` skeleton anchor
 * hard-locking `w-24` for every size (§12g). Fixed `Breadcrumbs.tsx`: the
 * `isSkeleton` branch now computes `collapseAlways`/`collapseMobile` (using
 * `items.length` instead of `onPress` — a skeleton item usually has no
 * `onPress` yet) and then picks the right shape. `maxItems` (Truncated) needs
 * NO separate state — the bar count depends on the REAL ITEM COUNT (unknown
 * while loading), not a different structural shape like collapse.
 */

const meta: Meta<typeof Breadcrumbs.Base> = {
    title: "Atoms/Navigation/Breadcrumbs/Breadcrumbs.Base",
    component: Breadcrumbs.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Breadcrumbs.Base>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Breadcrumbs: { tier: "heroui", role: "the trail root — lays out every crumb in order" },
    "Breadcrumbs.Item": { tier: "heroui", role: "one crumb — a real destination, or the '…' placeholder when the trail is truncated" },
    Link: { tier: "heroui", role: "the collapsed back affordance, shown once the trail gives way to a single back link" },
    Skeleton: { tier: "heroui", role: "shimmer bar standing in for a crumb or the back link's glyph/label" },
}

/** Default — full trail; the last crumb is the current page (no `onPress`). */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Breadcrumbs.Base"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Default"
                reason="The one breadcrumb atom, wrapping HeroUI's Breadcrumbs. Truncation is a leaf of the maxItems prop, not a separate component."
                states={[
                    {
                        name: "3-crumb trail, no maxItems/collapseFrom/collapseOnMobile",
                        why: "The full trail renders as plain crumbs; the last one carries no `onPress` so it reads as the current page rather than a link. This is the bare atom, the shape every other leaf below narrows down from.",
                        code: "<Breadcrumbs.Base items={[{ key: \"home\", label: \"Home\", onPress: fn }, …, { key: \"current\", label: \"Lesson 3\" }]} />",
                        render: (
                            <Breadcrumbs.Base
                                items={[
                                    { key: "home", label: "Home", onPress: () => {} },
                                    { key: "course", label: "Advanced React", onPress: () => {} },
                                    { key: "current", label: "Lesson 3: Hooks" },
                                ]}
                                showAnatomy
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
        <div className="p-8">
            <BlockAnatomy
                name="Breadcrumbs.Base"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Truncated"
                states={[
                    {
                        name: "maxItems = 3, 5-crumb trail",
                        why: "The trail shrinks to the first crumb, an ellipsis, then the last two, instead of five crumbs wrapping onto a second line. Deeper ancestors are already reachable from top nav, so collapsing the middle loses no real navigation.",
                        code: "<Breadcrumbs.Base maxItems={3} items={[/* 5 crumbs */]} />",
                        render: (
                            <Breadcrumbs.Base
                                maxItems={3}
                                items={[
                                    { key: "home", label: "Home", onPress: () => {} },
                                    { key: "catalog", label: "Catalog", onPress: () => {} },
                                    { key: "course", label: "Advanced React", onPress: () => {} },
                                    { key: "module", label: "Chapter 2", onPress: () => {} },
                                    { key: "current", label: "Lesson 3: Hooks" },
                                ]}
                                showAnatomy
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
        <div className="p-8">
            <BlockAnatomy
                name="Breadcrumbs.Base"
                tier="atom"
                annotate={ANNOTATE}
                leaf="CollapsedLongTrail"
                states={[
                    {
                        name: "collapseFrom = 4, 4-crumb trail",
                        why: "The whole Breadcrumbs trail is replaced by a single back link, at every viewport width. A trail this long would wrap and eat vertical space, and deeper ancestors are already reachable from top nav, so a back link is the honest shape here.",
                        code: "<Breadcrumbs.Base collapseFrom={4} backLabel=\"Back\" items={[/* 4 crumbs */]} />",
                        render: (
                            <Breadcrumbs.Base
                                collapseFrom={4}
                                backLabel="Back"
                                items={[
                                    { key: "home", label: "Home", onPress: () => {} },
                                    { key: "catalog", label: "Catalog", onPress: () => {} },
                                    { key: "course", label: "Advanced React", onPress: () => {} },
                                    { key: "current", label: "Lesson 3: Hooks" },
                                ]}
                                showAnatomy
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
        <div className="p-8">
            <BlockAnatomy
                name="Breadcrumbs.Base"
                tier="atom"
                annotate={ANNOTATE}
                leaf="CollapsedOnMobile"
                states={[
                    {
                        name: "collapseOnMobile = true, container narrower than @app-sm",
                        why: "The trail swaps for a back link only while the CONTAINER is narrow, and shows the full trail from `@app-sm` up. The fixed 375px wrapper is the mobile signal here, since this reads a container query rather than the viewport addon.",
                        code: "<Breadcrumbs.Base collapseOnMobile backLabel=\"Back\" items={[…]} />",
                        render: (
                            <div className="@container w-[375px] max-w-full rounded-none border border-dashed border-accent p-3">
                                <Breadcrumbs.Base
                                    collapseOnMobile
                                    backLabel="Back"
                                    items={[
                                        { key: "home", label: "Home", onPress: () => {} },
                                        { key: "course", label: "Advanced React", onPress: () => {} },
                                        { key: "current", label: "Lesson 3: Hooks" },
                                    ]}
                                    showAnatomy
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
        <div className="p-8">
            <BlockAnatomy
                name="Breadcrumbs.Base"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                reason="The skeleton follows the exact shape the loaded trail would resolve to, computed from collapseFrom/collapseOnMobile and the trail depth, so the layout never jumps once real data lands."
                states={[
                    {
                        name: "isSkeleton = true, no collapseFrom/collapseOnMobile",
                        why: "A plain row of trail bars shimmers, one per item, mirroring the shape of `Default`. Nothing here is about to collapse, so the resting shape is the full trail.",
                        code: "<Breadcrumbs.Base isSkeleton items={[…3 crumbs]} />",
                        render: (
                            <Breadcrumbs.Base
                                isSkeleton
                                items={[
                                    { key: "home", label: "Home" },
                                    { key: "course", label: "React" },
                                    { key: "current", label: "Lesson 3" },
                                ]}
                                showAnatomy
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true, collapseFrom = 3 matching a 3-crumb trail",
                        why: "The bar strip is replaced by a single back-link shimmer, mirroring the shape of `CollapsedLongTrail`. `collapseFrom` matches the trail's own depth, so the loaded trail would collapse too, and the skeleton must match it or the layout would jump.",
                        code: "<Breadcrumbs.Base isSkeleton collapseFrom={3} items={[…3 crumbs]} />",
                        render: (
                            <Breadcrumbs.Base
                                isSkeleton
                                collapseFrom={3}
                                items={[
                                    { key: "home", label: "Home" },
                                    { key: "course", label: "React" },
                                    { key: "current", label: "Lesson 3" },
                                ]}
                                showAnatomy
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true, collapseOnMobile = true, narrow container",
                        why: "The narrow-container skeleton mirrors the back-link shape, matching `CollapsedOnMobile`'s real behaviour at the same width. The same container query drives both the loaded and the loading trail, so neither ever disagrees with the other.",
                        code: "<Breadcrumbs.Base isSkeleton collapseOnMobile items={[…3 crumbs]} />",
                        render: (
                            <div className="@container w-[375px] max-w-full rounded-none border border-dashed border-accent p-3">
                                <Breadcrumbs.Base
                                    isSkeleton
                                    collapseOnMobile
                                    items={[
                                        { key: "home", label: "Home" },
                                        { key: "course", label: "React" },
                                        { key: "current", label: "Lesson 3" },
                                    ]}
                                    showAnatomy
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
