import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { BookOpenIcon, CardsIcon, ListMagnifyingGlassIcon, MagnifyingGlassIcon, SparkleIcon } from "@phosphor-icons/react"
import { ChipButtonList } from "./ChipButtonList"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

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
    title: "Primitives/Buttons/ChipButtonList",
    component: ChipButtonList,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ChipButtonList>

/** Frame each leaf with breathing room + a bounded width (chips/menu never span full viewport). */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-md p-8">{node}</div>

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
const WRAP_ICON_PARTS: Array<AnatomyNode> = [
    {
        name: "Button",
        tier: "primitive",
        role: "chip gợi ý (variant secondary, size sm, lặp ×N)",
        children: [{ name: "icon", tier: "primitive", role: "icon dẫn nhãn (size-4 shrink-0, muted) — ChipButtonList tự ép" }],
    },
]

// wrap không icon: chip chỉ còn Button + nhãn trần (children trực tiếp, không Typography — giống base Button).
const WRAP_PLAIN_PARTS: Array<AnatomyNode> = [
    { name: "Button", tier: "primitive", role: "chip gợi ý (variant secondary, size sm, lặp ×N), không icon" },
]

// column/ghost: mỗi Button là 1 hàng full-width, con gồm icon + Typography (label qua Typography, không className tay).
const COLUMN_PARTS: Array<AnatomyNode> = [
    {
        name: "Button",
        tier: "primitive",
        role: "hàng menu kỹ năng (variant ghost, full-width, lặp ×N)",
        children: [
            { name: "icon", tier: "primitive", role: "icon dẫn nhãn (size-4 shrink-0, muted)" },
            { name: "Typography", tier: "primitive", role: "nhãn kỹ năng (weight medium, truncate)" },
        ],
    },
]

// disabled: cùng composition với wrap+icon, 1 Button mang state isDisabled (item.isDisabled → Button.isDisabled).
const DISABLED_PARTS: Array<AnatomyNode> = [
    {
        name: "Button",
        tier: "primitive",
        role: "chip gợi ý (lặp ×N) — 1 item isDisabled vẫn hiện, không tương tác được",
        state: "1 item isDisabled",
        children: [{ name: "icon", tier: "primitive", role: "icon dẫn nhãn" }],
    },
]

// skeleton: mirror shape wrap (Skeleton.Button pill ×N, container tự vẽ khi isSkeleton — không dựng Button thật).
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton.Button", tier: "primitive", role: "pill giả ×N (mirror chip gợi ý)", state: "skeleton" },
]

// single: cùng composition với wrap+icon, chỉ 1 item — container không ép tối thiểu N chip.
const SINGLE_PARTS: Array<AnatomyNode> = [
    { name: "Button", tier: "primitive", role: "chip gợi ý — chỉ 1 item" },
    { name: "icon", tier: "primitive", role: "icon dẫn nhãn" },
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
                reason="4 nơi trong ContentAiChat (gợi ý rỗng-state, kỹ năng truy hồi, quick-ask khi bôi đen, menu kỹ năng) đều hand-roll MỘT danh sách secondary/ghost Button giống hệt nhau (leading icon trần + nhãn, justify-start text-start). Gom vào một primitive dùng chung để icon-size + layout sống ở một nơi, không lặp lại 4 lần."
            >
                <ChipButtonList items={WRAP_ICON_ITEMS} direction="wrap" showAnatomy />
            </BlockAnatomy>,
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
                note="items không truyền `icon` → mỗi Button chỉ còn nhãn trần (children trực tiếp), không Typography — giống cách base Button tự hiện nhãn của nó."
            >
                <ChipButtonList items={WRAP_PLAIN_ITEMS} direction="wrap" showAnatomy />
            </BlockAnatomy>,
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
                note={"direction=\"column\" → variant mặc định đổi sang ghost, mỗi hàng full-width; nhãn qua Typography (weight medium, truncate) thay vì className text-sm font-medium text-foreground tay ở bản gốc."}
            >
                <div className="rounded-2xl border border-default-200 bg-surface p-1">
                    <ChipButtonList items={COLUMN_ITEMS} direction="column" showAnatomy />
                </div>
            </BlockAnatomy>,
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
                note="`item.isDisabled` forward xuống Button.isDisabled — chip vẫn HIỆN (không ẩn), chỉ khoá tương tác, giữ nguyên vị trí trong cụm."
            >
                <ChipButtonList items={DISABLED_ITEMS} direction="wrap" showAnatomy />
            </BlockAnatomy>,
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
                note="Bật `isSkeleton` (không cần `items`) → container tự vẽ `skeletonCount` pill Skeleton.Button, đúng gap/layout của cụm chip thật."
            >
                <ChipButtonList items={[]} direction="wrap" isSkeleton skeletonCount={3} showAnatomy />
            </BlockAnatomy>,
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
                note="`items` chỉ 1 phần tử vẫn render đúng — không có ràng buộc tối thiểu về số lượng."
            >
                <ChipButtonList items={ONE_ITEM} direction="wrap" showAnatomy />
            </BlockAnatomy>,
        ),
}
