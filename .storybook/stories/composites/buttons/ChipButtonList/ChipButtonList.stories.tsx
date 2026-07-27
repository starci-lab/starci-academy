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
 *
 * 2026-07-27: di trú toàn bộ leaf sang API `states[]` (§8/§4a); `role` viết lại
 * TIẾNG ANH theo luật B.
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

/** Canvas padding only. Bề ngang của chủ thể đi qua `renderClassName` của từng leaf. */
const frame = (node: React.ReactNode) => <div className="p-8">{node}</div>

const WRAP_ICON_ITEMS = [
    { label: "Tóm tắt bài học này", icon: <SparkleIcon aria-hidden focusable="false" /> },
    { label: "Tìm ví dụ minh hoạ", icon: <MagnifyingGlassIcon aria-hidden focusable="false" /> },
    { label: "Đâu là phần khó nhất?", icon: <BookOpenIcon aria-hidden focusable="false" /> },
]

const WRAP_PLAIN_ITEMS = [
    { label: "Tóm tắt bài học này giúp tôi" },
    { label: "Cho tôi một ví dụ code cụ thể" },
    { label: "Phần nào của bài học này khó nhất?" },
]

const COLUMN_ITEMS = [
    { label: "Tìm bài học liên quan", icon: <BookOpenIcon aria-hidden focusable="false" /> },
    { label: "Tìm flashcard liên quan", icon: <CardsIcon aria-hidden focusable="false" /> },
    { label: "Tìm kết quả liên quan (mọi loại)", icon: <ListMagnifyingGlassIcon aria-hidden focusable="false" /> },
]

const DISABLED_ITEMS = [
    { label: "Tóm tắt bài học này", icon: <SparkleIcon aria-hidden focusable="false" /> },
    { label: "Giải thích chuyên sâu (sắp ra mắt)", icon: <MagnifyingGlassIcon aria-hidden focusable="false" />, isDisabled: true },
    { label: "Đâu là phần khó nhất?", icon: <BookOpenIcon aria-hidden focusable="false" /> },
]

const ONE_ITEM = [{ label: "Tóm tắt bài học này", icon: <SparkleIcon aria-hidden focusable="false" /> }]

// wrap + icon: mỗi Button lặp ×N, mỗi Button có 1 icon con dẫn nhãn.
// Real item rows compose the base Button — the `_legacy` design (§0: ChipButtonList
// itself was ported before the atom split, kept as-is here since this is a deps
// declaration, not a rewrite of the component). Its own story lives under `Legacy`.
const WRAP_ICON_PARTS: Array<AnatomyNode> = [
    {
        name: "Button",
        tier: "composite",
        role: "A suggestion chip (variant secondary, size sm), repeated once per item.",
        storyId: "legacy-primitives-buttons-button--variants",
        children: [{ name: "icon", tier: "composite", role: "The leading icon (size-4 shrink-0, muted); ChipButtonList forces this size itself." }],
    },
]

// wrap không icon: chip chỉ còn Button + nhãn trần (children trực tiếp, không Typography — giống base Button).
const WRAP_PLAIN_PARTS: Array<AnatomyNode> = [
    { name: "Button", tier: "composite", role: "A suggestion chip (variant secondary, size sm), repeated once per item, with no icon.", storyId: "legacy-primitives-buttons-button--variants" },
]

// column/ghost: mỗi Button là 1 hàng full-width, con gồm icon + Typography (label qua Typography, không className tay).
const COLUMN_PARTS: Array<AnatomyNode> = [
    {
        name: "Button",
        tier: "composite",
        role: "A full-width skill-menu row (variant ghost), repeated once per item.",
        storyId: "legacy-primitives-buttons-button--variants",
        children: [
            { name: "icon", tier: "composite", role: "The leading icon (size-4 shrink-0, muted)." },
            { name: "Typography", tier: "atom", role: "The skill label (weight medium, truncate).", storyId: "atoms-text-typography-typography-base--plain" },
        ],
    },
]

// disabled: cùng composition với wrap+icon, 1 Button mang state isDisabled (item.isDisabled → Button.isDisabled).
const DISABLED_PARTS: Array<AnatomyNode> = [
    {
        name: "Button",
        tier: "composite",
        role: "A suggestion chip, repeated once per item; one item's isDisabled still renders it, only interaction is blocked.",
        state: "1 item isDisabled",
        storyId: "legacy-primitives-buttons-button--variants",
        children: [{ name: "icon", tier: "composite", role: "The leading icon." }],
    },
]

// skeleton: mirror shape wrap (Button.Base isSkeleton pill ×N, container tự vẽ khi isSkeleton — không dựng Button thật).
// The skeleton mirror (wrap direction) reaches straight for the atom `Button.Base`
// isSkeleton leaf instead — a different component from the real-row Button above.
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "atom", role: "A shimmer pill repeated N times (atom Button.Base isSkeleton), mirroring the suggestion-chip shape.", state: "skeleton", storyId: "atoms-buttons-button-button-base--skeleton" },
]

// single: cùng composition với wrap+icon, chỉ 1 item — container không ép tối thiểu N chip.
const SINGLE_PARTS: Array<AnatomyNode> = [
    { name: "Button", tier: "composite", role: "A suggestion chip; only one item is passed.", storyId: "legacy-primitives-buttons-button--variants" },
    { name: "icon", tier: "composite", role: "The leading icon." },
]

/** WRAP + ICON — cụm chip gợi ý có icon dẫn nhãn (retrieval-skill chips). */
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
                        code: "<ChipButtonList items={[{ label: \"Summarize this lesson\", icon: <SparkleIcon /> }]} direction=\"wrap\" />",
                        render: <ChipButtonList items={WRAP_ICON_ITEMS} direction="wrap" showAnatomy />,
                    },
                ]}
            />,
        ),
}

/** WRAP KHÔNG ICON — cụm chip gợi ý thuần văn bản (empty-state suggestion chips). */
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
                        render: <ChipButtonList items={WRAP_PLAIN_ITEMS} direction="wrap" showAnatomy />,
                    },
                ]}
            />,
        ),
}

/** COLUMN/GHOST — danh sách dọc kiểu menu kỹ năng (⌥ composer button mở ra). */
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
                        code: "<ChipButtonList items={[{ label: \"Find related lesson\", icon: <BookOpenIcon /> }]} direction=\"column\" />",
                        render: (
                            <div className="rounded-2xl border border-default-200 bg-surface p-1">
                                <ChipButtonList items={COLUMN_ITEMS} direction="column" showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />,
        ),
}

/** DISABLED — 1 item khoá (sắp ra mắt): vẫn hiện, không tương tác. */
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
                        code: "<ChipButtonList items={[{ label: \"Coming soon\", icon: <MagnifyingGlassIcon />, isDisabled: true }]} direction=\"wrap\" />",
                        render: <ChipButtonList items={DISABLED_ITEMS} direction="wrap" showAnatomy />,
                    },
                ]}
            />,
        ),
}

/** SKELETON — `isSkeleton` tự vẽ N pill mirror (Skeleton.Button), không dựng Button thật. */
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
                        render: <ChipButtonList items={[]} direction="wrap" isSkeleton skeletonCount={3} showAnatomy />,
                    },
                ]}
            />,
        ),
}

/** MỘT ITEM (biên) — container không ép tối thiểu N chip. */
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
                        code: "<ChipButtonList items={[{ label: \"Summarize this lesson\", icon: <SparkleIcon /> }]} direction=\"wrap\" />",
                        render: <ChipButtonList items={ONE_ITEM} direction="wrap" showAnatomy />,
                    },
                ]}
            />,
        ),
}
