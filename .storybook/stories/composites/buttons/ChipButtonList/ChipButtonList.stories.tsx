import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { BookOpenIcon, CardsIcon, ListMagnifyingGlassIcon, MagnifyingGlassIcon, SparkleIcon } from "@phosphor-icons/react"
import { ChipButtonList } from "@sb-components/composites/buttons/ChipButtonList/ChipButtonList"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — a row of secondary "suggestion" chips OR a vertical ghost "menu" list,
 * both composing the base `Button`. Ported from 4 call-sites in `ContentAiChat`
 * that hand-rolled the same shape (leading bare icon + label, `justify-start
 * text-start`).
 *
 * ANATOMY IS PER-LEAF: each state below is its OWN leaf and carries its OWN
 * BlockAnatomy axis reflecting the parts THAT leaf composes.
 */
const meta: Meta<typeof ChipButtonList> = {
    title: "Composites/Buttons/ChipButtonList",
    component: ChipButtonList,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ChipButtonList>

/** Canvas padding only. The subject's own width goes through each leaf's `renderClassName`. */
const frame = (node: React.ReactNode) => <div data-tier="fixture" className="p-8">{node}</div>

const WRAP_ICON_ITEMS = [
    { label: "Summarize this lesson", icon: SparkleIcon },
    { label: "Find an illustrative example", icon: MagnifyingGlassIcon },
    { label: "What's the hardest part?", icon: BookOpenIcon },
]

const WRAP_PLAIN_ITEMS = [
    { label: "Summarize this lesson for me" },
    { label: "Give me a concrete code example" },
    { label: "Which part of this lesson is hardest?" },
]

const COLUMN_ITEMS = [
    { label: "Find related lessons", icon: BookOpenIcon },
    { label: "Find related flashcards", icon: CardsIcon },
    { label: "Find related results (any type)", icon: ListMagnifyingGlassIcon },
]

const DISABLED_ITEMS = [
    { label: "Summarize this lesson", icon: SparkleIcon },
    { label: "Deep-dive explanation (coming soon)", icon: MagnifyingGlassIcon, isDisabled: true },
    { label: "What's the hardest part?", icon: BookOpenIcon },
]

const ONE_ITEM = [{ label: "Summarize this lesson", icon: SparkleIcon }]

// wrap + icon: each Button repeats ×N, each Button carries one leading icon before its label.
// Real item rows compose the base Button — the `_legacy` design (§0: ChipButtonList
// itself was ported before the atom split, kept as-is here since this is a deps
// declaration, not a rewrite of the component). Its own story lives under `Legacy`.
const WRAP_ICON_PARTS: Array<AnatomyNode> = [
    {
        name: "Button",
        tier: "composite",
        role: "A suggestion chip (variant secondary, size sm), repeated once per item. Its leading icon is the caller's own component reference (item.icon) — ChipButtonList calls it and forces its size (size-4 shrink-0, muted), so the icon itself carries no badge of its own.",
        storyId: "legacy-primitives-buttons-button--variants",
    },
]

// wrap, no icon: the chip is just Button + a bare label (direct children, not Typography — same as the base Button).
const WRAP_PLAIN_PARTS: Array<AnatomyNode> = [
    { name: "Button", tier: "composite", role: "A suggestion chip (variant secondary, size sm), repeated once per item, with no icon.", storyId: "legacy-primitives-buttons-button--variants" },
]

// column/ghost: each Button is a full-width row, its children are the icon + Typography (label via Typography, no hand-typed className).
const COLUMN_PARTS: Array<AnatomyNode> = [
    {
        name: "Button",
        tier: "composite",
        role: "A full-width skill-menu row (variant ghost), repeated once per item. Its leading icon is the caller's own component reference, sized by ChipButtonList but not badged separately.",
        storyId: "legacy-primitives-buttons-button--variants",
        children: [
            { name: "Typography", tier: "atom", role: "The skill label (weight medium, truncate).", storyId: "atoms-text-typography-typography--plain" },
        ],
    },
]

// disabled: same composition as wrap+icon, one Button carries isDisabled (item.isDisabled → Button.isDisabled).
const DISABLED_PARTS: Array<AnatomyNode> = [
    {
        name: "Button",
        tier: "composite",
        role: "A suggestion chip, repeated once per item; one item's isDisabled still renders it, only interaction is blocked. Its leading icon is the caller's own component reference.",
        state: "1 item isDisabled",
        storyId: "legacy-primitives-buttons-button--variants",
    },
]

// skeleton: mirrors the wrap shape (Button isSkeleton pill ×N; the container draws itself while isSkeleton — no real Button built).
// The skeleton mirror (wrap direction) reaches straight for the atom `Button`
// isSkeleton leaf instead — a different component from the real-row Button above.
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "atom", role: "A shimmer pill repeated N times (atom Button isSkeleton), mirroring the suggestion-chip shape.", state: "skeleton", storyId: "atoms-buttons-button-button--skeleton" },
]

// single: same composition as wrap+icon, only 1 item — the container enforces no minimum chip count.
const SINGLE_PARTS: Array<AnatomyNode> = [
    { name: "Button", tier: "composite", role: "A suggestion chip; only one item is passed. Its leading icon is the caller's own component reference.", storyId: "legacy-primitives-buttons-button--variants" },
]

/** WRAP + ICON — a cluster of suggestion chips with a leading icon (retrieval-skill chips). */
export const WrapWithIcon: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChipButtonList"
                tier="block"
                leaf="WrapWithIcon"
                parts={WRAP_ICON_PARTS}
                renderClassName="mx-auto max-w-md"
                reason="Four spots inside ContentAiChat, empty-state suggestions, retrieval-skill chips, quick-ask on a highlighted selection, and the skill menu, used to hand-roll the exact same secondary or ghost Button row (a bare leading icon plus a label, justify-start text-start). Folding them into one composite keeps icon size and layout in one place instead of drifting four separate ways."
                states={[
                    {
                        name: "direction = \"wrap\", items[].icon set",
                        why: "Three suggestion chips wrap onto new lines as the row runs out of width, each one a repeated Button with a leading icon before its label. Wrapping keeps every suggestion visible at once instead of forcing the row to scroll sideways.",
                        code: "<ChipButtonList items={[{ label: \"Summarize this lesson\", icon: SparkleIcon }]} direction=\"wrap\" />",
                        render: <ChipButtonList items={WRAP_ICON_ITEMS} direction="wrap" />,
                    },
                ]}
            />,
        ),
}

/** WRAP, NO ICON — a cluster of plain-text suggestion chips (empty-state suggestion chips). */
export const WrapPlain: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChipButtonList"
                tier="block"
                leaf="WrapPlain"
                parts={WRAP_PLAIN_PARTS}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "direction = \"wrap\", items[].icon not set",
                        why: "Each chip renders as a bare label with no leading icon, using the same direct-children pattern the base Button already uses for a plain label. Omitting icon on every item is what drops the icon slot from the composition entirely, rather than leaving an empty gap where it would sit.",
                        code: "<ChipButtonList items={[{ label: \"Summarize this lesson for me\" }]} direction=\"wrap\" />",
                        render: <ChipButtonList items={WRAP_PLAIN_ITEMS} direction="wrap" />,
                    },
                ]}
            />,
        ),
}

/** COLUMN/GHOST — a vertical skill-menu list (⌥ opened by the composer button). */
export const ColumnMenu: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChipButtonList"
                tier="block"
                leaf="ColumnMenu"
                parts={COLUMN_PARTS}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "direction = \"column\"",
                        why: "The default variant switches to ghost and every row spans the full width of the menu, with the label going through Typography (weight medium, truncate) instead of a hand-typed className. Stacking full-width rows reads as a menu the composer button opens, rather than the wrapping chip row the other leaves show.",
                        code: "<ChipButtonList items={[{ label: \"Find related lesson\", icon: BookOpenIcon }]} direction=\"column\" />",
                        render: (
                            <div data-tier="fixture" className="rounded-2xl border border-default-200 bg-surface p-1">
                                <ChipButtonList items={COLUMN_ITEMS} direction="column" />
                            </div>
                        ),
                    },
                ]}
            />,
        ),
}

/** DISABLED — 1 item locked (coming soon): still shown, not interactive. */
export const WithDisabledItem: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChipButtonList"
                tier="block"
                leaf="WithDisabledItem"
                parts={DISABLED_PARTS}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "items[1].isDisabled = true",
                        why: "The middle chip stays visible in its normal position but stops responding to press, because item.isDisabled forwards straight to Button.isDisabled. A locked item never hides, since hiding it would make the reader wonder whether the feature exists at all.",
                        code: "<ChipButtonList items={[{ label: \"Coming soon\", icon: MagnifyingGlassIcon, isDisabled: true }]} direction=\"wrap\" />",
                        render: <ChipButtonList items={DISABLED_ITEMS} direction="wrap" />,
                    },
                ]}
            />,
        ),
}

/** SKELETON — `isSkeleton` draws its own N-pill mirror (Skeleton.Button), no real Button built. */
export const Loading: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChipButtonList"
                tier="block"
                leaf="Loading"
                parts={SKELETON_PARTS}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "isSkeleton = true, skeletonCount = 3, items = []",
                        why: "Three shimmer pills render in the same gap and layout the real chip row would use, without building any real Button. isSkeleton needs no items to work, the count comes from skeletonCount alone, so the loading shape never depends on data that has not arrived yet.",
                        code: "<ChipButtonList items={[]} direction=\"wrap\" isSkeleton skeletonCount={3} />",
                        render: <ChipButtonList items={[]} direction="wrap" isSkeleton skeletonCount={3} />,
                    },
                ]}
            />,
        ),
}

/** ONE ITEM (edge case) — the container enforces no minimum chip count. */
export const SingleItem: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChipButtonList"
                tier="block"
                leaf="SingleItem"
                parts={SINGLE_PARTS}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "items.length = 1",
                        why: "A single chip renders on its own, using the exact same Button-plus-icon composition as every other leaf. Nothing in the container enforces a minimum item count, so one entry is exactly as valid a shape as four.",
                        code: "<ChipButtonList items={[{ label: \"Summarize this lesson\", icon: SparkleIcon }]} direction=\"wrap\" />",
                        render: <ChipButtonList items={ONE_ITEM} direction="wrap" />,
                    },
                ]}
            />,
        ),
}
