import type { Meta, StoryObj } from "@storybook/nextjs"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Breadcrumbs.Base` wraps HeroUI `Breadcrumbs` directly, composing no
 * other atom with its own story (`Crumb`/`Ellipsis`/`Back`/`Skeleton` are just
 * internal SLOTS of this atom itself). Per canon §12g: a leaf atom wrapping
 * HeroUI directly ⇒ NO deps ⇒ DROP the `annotate` prop entirely on every leaf
 * below (teacher's call 2026-07-26).
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

/** Default — full trail; the last crumb is the current page (no `onPress`). */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Breadcrumbs.Base"
                tier="atom"
                leaf="Default"
                reason="The one breadcrumb atom, wrapping HeroUI's Breadcrumbs. Truncation is a leaf of the maxItems prop, not a separate component."
                code={"<Breadcrumbs.Base items={[{ key: \"home\", label: \"Home\", onPress: fn }, …, { key: \"current\", label: \"Lesson 3\" }]} />"}
            >
                <Breadcrumbs.Base
                    items={[
                        { key: "home", label: "Home", onPress: () => {} },
                        { key: "course", label: "Advanced React", onPress: () => {} },
                        { key: "current", label: "Lesson 3: Hooks" },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>
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
                leaf="Truncated"
                note="maxItems=3 with a 5-crumb trail shows the first crumb, an '…', then the last two. Deeper ancestors are already reachable from top nav."
                code={"<Breadcrumbs.Base maxItems={3} items={[/* 5 crumbs */]} />"}
            >
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
            </BlockAnatomy>
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
                leaf="CollapsedLongTrail"
                note="collapseFrom=4 with a 4-crumb trail swaps the whole Breadcrumbs for the back link — a long trail wraps and eats vertical space, and deeper ancestors are already reachable from top nav."
                code={"<Breadcrumbs.Base collapseFrom={4} backLabel=\"Back\" items={[/* 4 crumbs */]} />"}
            >
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
            </BlockAnatomy>
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
                leaf="CollapsedOnMobile"
                note="collapseOnMobile swaps a narrow column for the back link below @app-sm and shows the trail from @app-sm up. The fixed 375px container IS the mobile signal here (container queries — the viewport addon has no effect)."
                code={"<Breadcrumbs.Base collapseOnMobile backLabel=\"Back\" items={[…]} />"}
            >
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
            </BlockAnatomy>
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
                leaf="Prop `isSkeleton`"
                note="isSkeleton's shape follows collapseFrom/collapseOnMobile + trail depth — bar-row, back-link, or both (responsive) — the same way the loaded trail would resolve, so the layout doesn't jump once data lands."
                code={`<Breadcrumbs.Base isSkeleton items={[…3 crumbs]} />
<Breadcrumbs.Base isSkeleton collapseFrom={3} items={[…3 crumbs]} />
<Breadcrumbs.Base isSkeleton collapseOnMobile items={[…3 crumbs]} />`}
            >
                <div className="flex flex-col items-start gap-6">
                    <Breadcrumbs.Base
                        isSkeleton
                        items={[
                            { key: "home", label: "Home" },
                            { key: "course", label: "React" },
                            { key: "current", label: "Lesson 3" },
                        ]}
                        showAnatomy
                    />
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
                </div>
            </BlockAnatomy>
        </div>
    ),
}
