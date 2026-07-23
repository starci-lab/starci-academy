import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { EmptyContent } from "./EmptyContent"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — the standard empty state for an async data region: a thin layer over
 * the `EmptyState` primitive that adds a default TrayIcon and folds
 * `onRetry`/`retryLabel` into EmptyState's `action` slot.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof EmptyContent> = {
    title: "Design/Async/EmptyContent",
    component: EmptyContent,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof EmptyContent>

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// EmptyContent is a thin layer that composes the EmptyState primitive. The real
// DOM under EmptyState (size="default") is a centered stack: an icon span, the
// title Typography, an optional description Typography, and an optional action.
// Each leaf mirrors exactly the slots IT fills, so the shapes diverge.

// BASIC — title only: icon + title Typography (no description, no action).
const BASE_PARTS: Array<AnatomyNode> = [
    {
        name: "EmptyState",
        tier: "primitive",
        role: "khung icon + tiêu đề + mô tả + action, canh giữa",
        children: [
            { name: "TrayIcon", tier: "primitive", role: "icon khay mặc định trong slot icon" },
            { name: "Typography", tier: "primitive", role: "tiêu đề — dòng chính" },
        ],
    },
]

// WITH DESCRIPTION — icon + title + a second description Typography.
const DESC_PARTS: Array<AnatomyNode> = [
    {
        name: "EmptyState",
        tier: "primitive",
        role: "khung icon + tiêu đề + mô tả + action, canh giữa",
        children: [
            { name: "TrayIcon", tier: "primitive", role: "icon khay mặc định trong slot icon" },
            { name: "Typography", tier: "primitive", role: "tiêu đề — dòng chính" },
            { name: "Typography", tier: "primitive", role: "mô tả — dòng phụ dưới tiêu đề" },
        ],
    },
]

// WITH RETRY — icon + title + description + a Button folded into the action slot.
const RETRY_PARTS: Array<AnatomyNode> = [
    {
        name: "EmptyState",
        tier: "primitive",
        role: "khung icon + tiêu đề + mô tả + action, canh giữa",
        children: [
            { name: "TrayIcon", tier: "primitive", role: "icon khay mặc định trong slot icon" },
            { name: "Typography", tier: "primitive", role: "tiêu đề — dòng chính" },
            { name: "Typography", tier: "primitive", role: "mô tả — dòng phụ dưới tiêu đề" },
            { name: "Button", tier: "primitive", role: "nút thử lại đặt vào slot action", state: "secondary" },
        ],
    },
]

// CUSTOM ICON — same shape as WithDescription but the icon slot is overridden.
const CUSTOM_ICON_PARTS: Array<AnatomyNode> = [
    {
        name: "EmptyState",
        tier: "primitive",
        role: "khung icon + tiêu đề + mô tả + action, canh giữa",
        children: [
            { name: "MagnifyingGlassIcon", tier: "primitive", role: "icon tuỳ biến truyền vào slot icon" },
            { name: "Typography", tier: "primitive", role: "tiêu đề — dòng chính" },
            { name: "Typography", tier: "primitive", role: "mô tả — dòng phụ dưới tiêu đề" },
        ],
    },
]

/** BASIC — title only; the leanest shape (icon + title). */
export const Basic: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="EmptyContent"
                tier="design"
                leaf="Chỉ tiêu đề"
                parts={BASE_PARTS}
                reason="Trạng thái rỗng của một vùng dữ liệu async cần đúng anatomy của EmptyState (icon + tiêu đề + mô tả + action canh giữa). EmptyContent chỉ thêm icon TrayIcon mặc định và gói onRetry/retryLabel thành nút trong slot action — nên nó là một lớp mỏng trên EmptyState, không nên tự vẽ lại."
            >
                <EmptyContent title="Chưa có dữ liệu" />
            </BlockAnatomy>,
        ),
}

/** WITH DESCRIPTION — title + supporting line; adds a second description Typography over Basic. */
export const WithDescription: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="EmptyContent"
                tier="design"
                leaf="Có mô tả"
                parts={DESC_PARTS}
                note="Thêm một Typography mô tả dưới tiêu đề — khác leaf 'Chỉ tiêu đề' (leaf đó không có dòng mô tả)."
            >
                <EmptyContent
                    title="Danh sách trống"
                    description="Bạn chưa lưu mục nào vào danh sách này."
                />
            </BlockAnatomy>,
        ),
}

/** WITH RETRY — onRetry + retryLabel add a Button into EmptyState's action slot. */
export const WithRetry: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="EmptyContent"
                tier="design"
                leaf="Có nút thử lại"
                parts={RETRY_PARTS}
                note="onRetry + retryLabel → thêm Button vào slot action của EmptyState (composition khác các leaf không nút)."
            >
                <EmptyContent
                    title="Không tìm thấy kết quả"
                    description="Thử đổi bộ lọc hoặc tải lại để xem thêm."
                    onRetry={() => {}}
                    retryLabel="Tải lại"
                />
            </BlockAnatomy>,
        ),
}

/** CUSTOM ICON — icon slot overridden (MagnifyingGlassIcon); same shape as WithDescription. */
export const CustomIcon: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="EmptyContent"
                tier="design"
                leaf="Icon tuỳ biến"
                parts={CUSTOM_ICON_PARTS}
                note="Ghi đè icon mặc định (TrayIcon → MagnifyingGlassIcon); các slot còn lại cùng shape với leaf 'Có mô tả'."
            >
                <EmptyContent
                    icon={<MagnifyingGlassIcon aria-hidden focusable="false" weight="duotone" className="size-8 text-foreground" />}
                    title="Không có kết quả khớp"
                    description="Không có mục nào khớp với từ khoá bạn nhập."
                />
            </BlockAnatomy>,
        ),
}
