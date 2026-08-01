import type { Meta, StoryObj } from "@storybook/nextjs"
import { Accordion } from "@sb-components/atoms/navigation/Accordion/Accordion"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Accordion` wraps HeroUI `DisclosureGroup` + `Disclosure` directly; it
 * doesn't compose any atom OF OURS with its own story. BUT (2026-07-27, the heroui
 * tier added to canon): every one of those sub-parts is still a REAL import from
 * `@heroui/react`, so each node still declares `tier: "heroui"` in `ANNOTATE` below —
 * the name matches the import identifier EXACTLY (`DisclosureGroup`/`Disclosure`/
 * `Disclosure.Trigger`/`Disclosure.Indicator`/`Disclosure.Content`/`Skeleton`), with
 * NO `storyId` since there is no story OF OURS to jump to. Before 2026-07-27 these
 * nodes were dropped ENTIRELY (empty annotate) — the tree "lied by omission" even
 * though the HeroUI compound was still rendering for real.
 *
 * The leaf set = `Default` (bare, prop `items`) + `Single`/`Multiple` (prop
 * `allowsMultiple`, each cell uses `defaultExpandedKeys` to open a panel UP FRONT —
 * since `allowsMultiple` only changes BEHAVIOR on interaction, without seeding state
 * the two cells would mount looking identical) + `Skeleton` (prop `isSkeleton`). The
 * old `DefaultOpen` leaf has been MERGED into `Single` — same `defaultExpandedKeys`
 * mechanism opening one panel; splitting it out would just produce two cells with
 * the same shape (2026-07-26).
 *
 * `Skeleton` was renamed from `Loading` (2026-07-27, teacher's ruling: a leaf carries
 * the PROP'S name, not the name of the situation — the prop that produces this leaf
 * is `isSkeleton`). The atom has no other size/variant axis for the skeleton to hang
 * off of (only `items`/`allowsMultiple`, neither changes shape under `isSkeleton`), so
 * ONE rendering is enough per §12g — no rung was left out.
 */

const meta: Meta<typeof Accordion> = {
    title: "Atoms/Navigation/Accordion/Accordion",
    component: Accordion,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Accordion>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "DisclosureGroup": { tier: "heroui", role: "owns single-open vs multi-open expansion across every panel" },
    "Disclosure": { tier: "heroui", role: "one FAQ panel — trigger row plus its collapsible content" },
    "Disclosure.Trigger": { tier: "heroui", role: "the pressable row that opens/closes this panel" },
    "Disclosure.Indicator": { tier: "heroui", role: "the chevron that rotates when the panel opens" },
    "Disclosure.Content": { tier: "heroui", role: "the collapsible region holding this panel's body" },
    "Skeleton": { tier: "heroui", role: "shimmer bar standing in for a trigger row's title or chevron" },
}

const FAQ_ITEMS = [
    { key: "refund", title: "Refund policy?", content: "Full refund within the first 7 days if you haven't completed more than 20% of the content." },
    { key: "cert", title: "Do I get a certificate?", content: "You get a certificate of completion once you pass the final exam." },
    { key: "access", title: "How long do I have access?", content: "Lifetime, pay once and revisit whenever you want." },
]

/** The BARE leaf — only `items`, every panel closed. This is the leaf for prop `items` (§12g.2: a content prop → Default IS its leaf). */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Accordion"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `items`"
                reason="This is the one accordion atom in the system, wrapping HeroUI's DisclosureGroup and Disclosure directly with no other component composed inside it."
                states={[
                    {
                        name: "items = 3 FAQ entries, allowsMultiple unset",
                        why: "`items` renders one Disclosure per entry, giving three panels here, and all three sit collapsed because nothing has been toggled open yet. This bare leaf is the shape a caller reaches for with only the data prop set, before any open behavior is pinned in.",
                        code: "<Accordion items={FAQ_ITEMS} />",
                        render: <Accordion items={FAQ_ITEMS} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Single — `allowsMultiple=false` (the default): opening this panel closes any other
 * panel automatically. `allowsMultiple` only shows itself on INTERACTION, so this leaf
 * uses `defaultExpandedKeys` to open ONE panel up front — both to show a shape different
 * from `Default`, and to pair as a contrast against `Multiple`.
 */
export const Single: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Accordion"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Single"
                reason="Single and Multiple share the same items and the same defaultExpandedKeys mechanism; only how many panels the group lets stay open at once tells them apart."
                states={[
                    {
                        name: "allowsMultiple unset (defaults false), defaultExpandedKeys = [\"refund\"]",
                        why: "allowsMultiple defaults to false, so opening one panel closes any other automatically, and defaultExpandedKeys seeds one panel open so that mutually-exclusive behavior has a visible shape at mount. Without seeding a panel open here, this leaf would mount looking identical to Multiple, and the reader could never tell single-open from multi-open just by looking.",
                        code: "<Accordion defaultExpandedKeys={[\"refund\"]} items={FAQ_ITEMS} /> {/* allowsMultiple defaults to false */}",
                        render: <Accordion defaultExpandedKeys={["refund"]} items={FAQ_ITEMS} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Multiple — `allowsMultiple` turned on: several panels open independently at once.
 * `defaultExpandedKeys` opens TWO panels up front so this shape is genuinely different
 * from `Single` (one panel) right at mount.
 */
export const Multiple: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Accordion"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Multiple"
                states={[
                    {
                        name: "allowsMultiple = true, defaultExpandedKeys = [\"refund\", \"cert\"]",
                        why: "allowsMultiple lets panels expand independently, and two of the three start open together here, a count Single can never show at once. Same items, same defaultExpandedKeys mechanism as Single, only the number of panels open at mount differs.",
                        code: "<Accordion allowsMultiple defaultExpandedKeys={[\"refund\", \"cert\"]} items={FAQ_ITEMS} />",
                        render: <Accordion allowsMultiple defaultExpandedKeys={["refund", "cert"]} items={FAQ_ITEMS} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/** Skeleton — the atom draws its own skeleton leaf (closed trigger rows); it doesn't use `Skeleton.*`. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Accordion"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The atom swaps every panel row for its own shimmer bar instead of forwarding to a shared Skeleton component, so it draws exactly the closed-trigger shape it will hold once real data lands. This is what the FAQ list looks like while it hasn't loaded yet.",
                        code: "<Accordion isSkeleton items={FAQ_ITEMS} />",
                        render: <Accordion isSkeleton items={FAQ_ITEMS} showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}
