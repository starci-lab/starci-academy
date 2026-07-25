import React, { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { List } from "@sb-components/blocks/lists/List/List"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): `List.ToggleRow` là khung MỘT HÀNG CÀI ĐẶT.
 * Thứ nó đẻ ra: công tắc tắt/bật, có/không dòng mô tả, khoá (`isDisabled`), và mirror
 * `isSkeleton` của CHÍNH hàng. Việc XẾP nhiều hàng thành danh sách (nhãn phần, gap, CTA)
 * là tài sản của `List.Labeled` — KHÔNG lặp ở đây.
 */
const meta: Meta<typeof List.ToggleRow> = {
    title: "Layouts/Lists/List/List.ToggleRow",
    component: List.ToggleRow,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof List.ToggleRow>

/**
 * ANATOMY IS PER-LEAF: every story below wraps its render in its OWN BlockAnatomy
 * axis. `List.ToggleRow` composes `TitledText` (label + optional muted
 * description, one stacked node) and a trailing `Switch` — same two nodes across
 * every leaf, including `isSkeleton` (each swaps to its own mirror, same names).
 */
const ROW_PARTS: Array<AnatomyNode> = [
    { name: "TitledText", tier: "primitive", role: "label + description muted, stacked" },
    { name: "Switch", tier: "primitive", role: "công tắc bật/tắt, pinned phải" },
]

/** Default: label + description, unchecked. */
export const Default: Story = {
    render: function Render() {
        const [checked, setChecked] = useState(false)
        return (
            <div className="p-8">
                <BlockAnatomy
                    name="List.ToggleRow"
                    tier="primitive"
                    leaf="Default"
                    parts={ROW_PARTS}
                    reason="Tổng quát hoá row toggle cài đặt lặp lại (PrivacySettings): TitledText + Switch, gap-3, để mọi surface settings dùng chung 1 khung hàng."
                    code={`<List.ToggleRow
  label="Hiển thị dự án"
  description="Cho phép khách xem tab Dự án trên hồ sơ công khai của bạn"
  checked={checked}
  onCheckedChange={setChecked}
/>`}
                >
                    <List.ToggleRow
                        label="Hiển thị dự án"
                        description="Cho phép khách xem tab Dự án trên hồ sơ công khai của bạn"
                        checked={checked}
                        onCheckedChange={setChecked}
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        )
    },
}

/** Selected: the switch is on. */
export const Selected: Story = {
    render: function Render() {
        const [checked, setChecked] = useState(true)
        return (
            <div className="p-8">
                <BlockAnatomy name="List.ToggleRow" tier="primitive" leaf="Selected" parts={ROW_PARTS}>
                    <List.ToggleRow
                        label="Hiển thị dự án"
                        description="Cho phép khách xem tab Dự án trên hồ sơ công khai của bạn"
                        checked={checked}
                        onCheckedChange={setChecked}
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        )
    },
}

/** NoDescription: `description` is optional — the row still aligns without the second line. */
export const NoDescription: Story = {
    render: function Render() {
        const [checked, setChecked] = useState(true)
        return (
            <div className="p-8">
                <BlockAnatomy
                    name="List.ToggleRow"
                    tier="primitive"
                    leaf="NoDescription"
                    parts={ROW_PARTS}
                    note="description bỏ trống → TitledText chỉ còn title, vẫn cùng 1 node."
                >
                    <List.ToggleRow label="Chế độ tối" checked={checked} onCheckedChange={setChecked} showAnatomy />
                </BlockAnatomy>
            </div>
        )
    },
}

/**
 * Disabled: grounded in the hand-roll's "Khoá hồ sơ" override — when the
 * profile lock is on, every per-section visibility row dims + stops
 * accepting input.
 */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.ToggleRow"
                tier="primitive"
                leaf="Disabled"
                parts={ROW_PARTS}
                note="isDisabled chỉ dim row + khoá Switch, composition không đổi."
            >
                <List.ToggleRow
                    label="Hiển thị dự án"
                    description="Đang bị khoá bởi chế độ khoá hồ sơ"
                    checked={false}
                    onCheckedChange={() => {}}
                    isDisabled
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Loading: `isSkeleton` mirrors label + description bars and the switch pill, so the row never jumps when data arrives. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.ToggleRow"
                tier="primitive"
                leaf="Loading"
                parts={ROW_PARTS}
                note="isSkeleton → TitledText và Switch tự swap sang mirror riêng, vẫn cùng 2 node."
            >
                <List.ToggleRow
                    label="Hiển thị dự án"
                    description="Cho phép khách xem tab Dự án trên hồ sơ công khai của bạn"
                    checked={false}
                    onCheckedChange={() => {}}
                    isSkeleton
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}
