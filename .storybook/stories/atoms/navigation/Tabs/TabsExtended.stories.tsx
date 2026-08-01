import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Tabs as HeroTabs } from "@heroui/react"
import { HouseIcon, CompassIcon, GraduationCapIcon } from "@phosphor-icons/react"
import { TabsExtended } from "@sb-components/atoms/navigation/Tabs/Tabs"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"
/**
 * ATOM — `TabsExtended`: the StarCi tab strip, wrapping the HeroUI `Tabs` root.
 * Moved into the `Tabs.*` namespace 2026-07-26 (previously stood alone as
 * `ExtendedTabs.Base` — see the `TabsExtended.tsx` header for why it was merged,
 * and why `children` here is a valid EXCEPTION rather than debt).
 *
 * 📐 **1 PROP THAT PRODUCES A SHAPE = 1 LEAF** (§12g — the ATOM-tier rule, unlike
 * §14d.2 for the tier above). Leaf set = `Default` (bare) + one leaf per prop
 * THAT PRODUCES A SHAPE: `variant` · `size`. `selectedKey`/`onSelectionChange` is
 * the mandatory controlled mechanism (not a value to compare, so it has NO leaf
 * of its own), `className` is an escape hatch (NO leaf, same reason `Chip`
 * excludes `className`).
 *
 * `children` is a NAMED EXCEPTION under §12b (atom-WRAPPER) — re-examined
 * 2026-07-26 and the original conclusion STANDS. A mid-stream note once called
 * this "real debt" on the grounds that `Tabs` gets by with `items`; that's wrong,
 * because it ignores the consumer: `Toolbar` attaches an `accent`/`muted` class to
 * each tab and hides responsive labels — something a data-only `TabItem` can't
 * carry. See the `TabsExtended.tsx` header. Per §12g.2, a prop of the "builds N
 * children" kind (here `children` instead of `items`) DOES have a leaf, and that
 * leaf IS `Default` — no separate `Children` leaf is spawned.
 *
 * The leaf set was CARRIED OVER AS-IS from `ExtendedTabs.Base.stories.tsx`
 * (audited in a prior pass, NOT re-audited in this merge pass) — only the
 * import/display name changed to `TabsExtended`:
 *
 * ⚠️ MERGED 2026-07-26 (leaves, before the namespace merge): the previous version
 * split 5 leaves by STRUCTURE (`InputWFit` / `FullWidthTruncate` / `PrimaryLarge` /
 * `Secondary` / `SecondaryWithIcons`) — correct under §14d.2 (structure) rather
 * than §12g (prop) for the atom tier. Result: the `variant` prop had nowhere
 * rendering its full union in ONE leaf, and `size` was torn across two leaves not
 * named after the prop. Merged: `InputWFit`+`FullWidthTruncate` → leaf `Size`
 * (these really are the two VALUES of `size`, which turns out to match the
 * "truncates (w-full) or sizes to label (w-fit)" comment in `TabsExtended.tsx`);
 * `PrimaryLarge`+`Secondary` → leaf `Variant`. `SecondaryWithIcons` wasn't a new
 * value of any prop (the icon lives in `children`, not a prop of this atom) — its
 * content moved into the `secondary` example inside the `Variant` leaf instead of
 * standing as its own named leaf.
 *
 * `annotate` (2026-07-27, heroui tier added to canon): the atom wraps HeroUI
 * `Tabs` directly (not through the system's own `Tabs` atom, aliased `HeroTabs`),
 * and the only DOM node it OWNS is the root `<Tabs>` — the
 * `Tabs.ListContainer > Tabs.List > Tabs.Tab` tree below it belongs to the STORY
 * that builds it (i.e. `children`), so ONLY the root `<Tabs>` is tagged (`"Tabs"`,
 * heroui tier, matching the import identifier). Previously `showAnatomy`/
 * `data-anat-part` were dropped entirely — a genuine case of "the tree lies by
 * omission" (the Popover opens fine but the tree shows nothing): this atom
 * renders a REAL `HeroTabs` that no tree node ever saw.
 *
 * 🔎 NOTE (not fixed here — out of scope for a leaf audit, see the component
 * header for the full account): the component's own header describes it as a
 * "full port of `@/components/blocks/navigation/ExtendedTabs`" — an old block
 * carried straight into an atom, never redesigned as one. It doesn't use the
 * system's own `Tabs` atom (imports HeroUI `Tabs` directly), so it overlaps in
 * surface with `Tabs`; compared to `Tabs` (takes `items`, builds its own DOM,
 * choose-1-of-N — the shape of a proper self-contained atom), `TabsExtended`
 * takes raw `children` and doesn't constrain the tab count or each tab's
 * structure on its own — closer to a bare slot `frame` than a content atom.
 *
 * 2026-07-27: migrated to the `states` API (§8) — `Variant`/`Size` now render their
 * union as `states[]` tabs instead of a stacked column under one shared `note`.
 */
const meta: Meta<typeof TabsExtended> = {
    title: "Atoms/Navigation/Tabs/TabsExtended",
    component: TabsExtended,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}
export default meta
type Story = StoryObj<typeof TabsExtended>
/** heroui TIER (2026-07-27) — the only DOM node this atom owns, the root `<Tabs>`. */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Tabs": { tier: "heroui", role: "the root strip; the Tabs.ListContainer > Tabs.List > Tabs.Tab tree inside is the CALLER's own children" },
}
/** Owns the selected-tab state since `TabsExtended` is fully controlled. */
const Controlled = ({
    defaultKey,
    variant,
    size,
    children,
}: {
    defaultKey: string
    variant?: "primary" | "secondary"
    size?: "sm" | "md"
    children: ReactNode
}) => {
    const [selectedKey, setSelectedKey] = useState(defaultKey)
    return (
        <TabsExtended selectedKey={selectedKey} onSelectionChange={setSelectedKey} variant={variant} size={size} showAnatomy>
            {children}
        </TabsExtended>
    )
}
/** Bare leaf — `variant="secondary"` default, `children` is a minimal example (§12g.2). */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TabsExtended"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Default"
                reason="The StarCi tab strip — a thin wrapper over the HeroUI Tabs root. `children` stays the caller's own `Tabs.ListContainer > Tabs.List > Tabs.Tab (+ Tabs.Indicator)` tree — a NAMED §12b exception (atom-wrapper), because each tab may carry chrome only the caller knows: accent/muted classes, a label hidden on mobile. Reach for `Tabs` (`items`) when the tabs are plain content."
                states={[
                    {
                        name: "variant and size both unset",
                        why: "`secondary` (the default variant) bakes in the underline look and hugs its own label width rather than stretching full-width. This is the bare rendering before either `variant` or `size` is touched — every leaf below only flips one of those two props on top of it.",
                        code: `<TabsExtended selectedKey="overview" onSelectionChange={setKey}>
    <HeroTabs.ListContainer>
        <HeroTabs.List aria-label="Content filter">
            <HeroTabs.Tab id="overview">Overview<HeroTabs.Indicator /></HeroTabs.Tab>
            <HeroTabs.Tab id="reviews">Reviews<HeroTabs.Indicator /></HeroTabs.Tab>
            <HeroTabs.Tab id="qna">Q&A<HeroTabs.Indicator /></HeroTabs.Tab>
        </HeroTabs.List>
    </HeroTabs.ListContainer>
</TabsExtended>`,
                        render: (
                            <Controlled defaultKey="overview">
                                <HeroTabs.ListContainer>
                                    <HeroTabs.List aria-label="Content filter">
                                        <HeroTabs.Tab id="overview" aria-controls="panel-overview">
                                            Overview
                                            <HeroTabs.Indicator />
                                        </HeroTabs.Tab>
                                        <HeroTabs.Tab id="reviews" aria-controls="panel-reviews">
                                            Reviews
                                            <HeroTabs.Indicator />
                                        </HeroTabs.Tab>
                                        <HeroTabs.Tab id="qna" aria-controls="panel-qna">
                                            Q&A
                                            <HeroTabs.Indicator />
                                        </HeroTabs.Tab>
                                    </HeroTabs.List>
                                </HeroTabs.ListContainer>
                            </Controlled>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/** Leaf prop `variant` — the FULL union `"primary" | "secondary"`, rendered in the SAME leaf. */
export const Variant: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TabsExtended"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `variant`"
                reason="`variant` decides whether the strip claims a full-width baseline row or hugs its own content — the underlying `Tabs.ListContainer > Tabs.List > Tabs.Tab` tree the caller supplies stays the same shape either way."
                states={[
                    {
                        name: "variant = \"primary\"",
                        why: "The strip renders HeroUI's own default Tabs look: a full-width segmented pill spanning the row. Pick this for a page-level FEATURE switch that swaps the entire panel below it, such as Overview/Explore/Courses.",
                        code: "<TabsExtended variant=\"primary\" selectedKey={key} onSelectionChange={setKey}>…</TabsExtended>",
                        render: (
                            <Controlled defaultKey="overview" variant="primary">
                                <HeroTabs.ListContainer>
                                    <HeroTabs.List aria-label="Dashboard navigation">
                                        <HeroTabs.Tab id="overview" aria-controls="panel-overview">
                                            <span className="flex items-center gap-2">
                                                <HouseIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                                <span>Overview</span>
                                            </span>
                                            <HeroTabs.Indicator />
                                        </HeroTabs.Tab>
                                        <HeroTabs.Tab id="explore" aria-controls="panel-explore">
                                            <span className="flex items-center gap-2">
                                                <CompassIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                                <span>Explore</span>
                                            </span>
                                            <HeroTabs.Indicator />
                                        </HeroTabs.Tab>
                                        <HeroTabs.Tab id="courses" aria-controls="panel-courses">
                                            <span className="flex items-center gap-2">
                                                <GraduationCapIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                                <span>Courses</span>
                                            </span>
                                            <HeroTabs.Indicator />
                                        </HeroTabs.Tab>
                                    </HeroTabs.List>
                                </HeroTabs.ListContainer>
                            </Controlled>
                        ),
                    },
                    {
                        name: "variant = \"secondary\"",
                        why: "The strip drops the built-in full-width baseline and hugs its content instead, with a responsive label hidden below `md`. Pick this for a content filter or language switcher riding alongside a reading column, one that shouldn't claim the full row.",
                        code: "<TabsExtended variant=\"secondary\" selectedKey={key} onSelectionChange={setKey}>…</TabsExtended>",
                        render: (
                            <Controlled defaultKey="courses" variant="secondary">
                                <HeroTabs.ListContainer>
                                    <HeroTabs.List aria-label="Learning categories">
                                        <HeroTabs.Tab id="courses" aria-controls="panel-courses">
                                            <span className="flex items-center gap-2">
                                                <GraduationCapIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                                <span className="hidden @app-md:inline">Courses</span>
                                            </span>
                                            <HeroTabs.Indicator />
                                        </HeroTabs.Tab>
                                        <HeroTabs.Tab id="explore" aria-controls="panel-explore">
                                            <span className="flex items-center gap-2">
                                                <CompassIcon aria-hidden focusable="false" className="size-5 shrink-0" />
                                                <span className="hidden @app-md:inline">Explore</span>
                                            </span>
                                            <HeroTabs.Indicator />
                                        </HeroTabs.Tab>
                                    </HeroTabs.List>
                                </HeroTabs.ListContainer>
                            </Controlled>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/** Leaf prop `size` — the FULL union `"sm" | "md"`, both set on `variant="primary"` since `size` has no effect on `secondary`. */
export const Size: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TabsExtended"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `size`"
                reason={"`size` only shows up on `variant=\"primary\"` — `secondary` is already hug-content via its own override, so `size` has no visible effect there, and both states below are demonstrated on `primary`."}
                states={[
                    {
                        name: "variant = \"primary\", size = \"sm\"",
                        why: "The strip shrinks to `w-fit` — segments size to their own label instead of splitting the row evenly. Reach for this in a compact choice that shouldn't claim the full row width, such as a setting nested in a modal.",
                        code: "<TabsExtended variant=\"primary\" size=\"sm\" selectedKey={key} onSelectionChange={setKey}>…</TabsExtended>",
                        render: (
                            <Controlled defaultKey="monthly" variant="primary" size="sm">
                                <HeroTabs.ListContainer>
                                    <HeroTabs.List aria-label="Billing cycle">
                                        <HeroTabs.Tab id="monthly" aria-controls="panel-monthly">
                                            Monthly
                                            <HeroTabs.Indicator />
                                        </HeroTabs.Tab>
                                        <HeroTabs.Tab id="yearly" aria-controls="panel-yearly">
                                            Yearly
                                            <HeroTabs.Indicator />
                                        </HeroTabs.Tab>
                                    </HeroTabs.List>
                                </HeroTabs.ListContainer>
                            </Controlled>
                        ),
                    },
                    {
                        name: "variant = \"primary\", size = \"md\"",
                        why: "The strip stretches to `w-full` and splits its segments evenly (the default). Inside a squeezed container a segment truncates its label instead of wrapping, since every `Tabs.Tab` is forced `whitespace-nowrap`.",
                        code: "<TabsExtended variant=\"primary\" size=\"md\" selectedKey={key} onSelectionChange={setKey}>…</TabsExtended>",
                        render: (
                            <div data-tier="fixture" className="w-64">
                                <Controlled defaultKey="grid" variant="primary" size="md">
                                    <HeroTabs.ListContainer>
                                        <HeroTabs.List aria-label="View mode">
                                            <HeroTabs.Tab id="grid" aria-controls="panel-grid" aria-label="Detailed grid view" className="min-w-0">
                                                <span className="block truncate">Detailed grid view</span>
                                                <HeroTabs.Indicator />
                                            </HeroTabs.Tab>
                                            <HeroTabs.Tab id="list" aria-controls="panel-list" aria-label="Compact list view" className="min-w-0">
                                                <span className="block truncate">Compact list view</span>
                                                <HeroTabs.Indicator />
                                            </HeroTabs.Tab>
                                        </HeroTabs.List>
                                    </HeroTabs.ListContainer>
                                </Controlled>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}