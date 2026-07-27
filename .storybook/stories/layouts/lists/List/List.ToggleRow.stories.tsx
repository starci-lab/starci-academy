import React, { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { List } from "@sb-components/layouts/lists/List/List"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE (teacher finalized 2026-07-25): `List.ToggleRow` is a ONE SETTINGS
 * ROW scaffold. What it produces: the on/off switch, with/without a description
 * line, locked (`isDisabled`), and the `isSkeleton` mirror of THIS row itself.
 * ARRANGING multiple rows into a list (section label, gap, CTA) belongs to
 * `List.Labeled` — NOT repeated here.
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
    { name: "Switch", tier: "primitive", role: "on/off switch, pinned right" },
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
                    reason="Generalizes the repeating settings toggle row (PrivacySettings): TitledText + Switch, gap-3, so every settings surface shares one row scaffold."
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
                <BlockAnatomy
                    name="List.ToggleRow"
                    tier="primitive"
                    leaf="Selected"
                    parts={ROW_PARTS}
                    code={`<List.ToggleRow
  label="Show projects"
  description="Allow visitors to see the Projects tab on your public profile"
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
                    note="description left blank → TitledText keeps only the title, still the same node."
                    code={"<List.ToggleRow label=\"Dark mode\" checked={checked} onCheckedChange={setChecked} />"}
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
                note="isDisabled only dims the row + locks the Switch, composition doesn't change."
                code={`<List.ToggleRow
  label="Show projects"
  description="Locked by profile lock mode"
  checked={false}
  isDisabled
/>`}
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
                note="isSkeleton → TitledText and Switch each swap to their own mirror, still the same 2 nodes."
                code={"<List.ToggleRow label=\"Show projects\" description=\"Allow visitors to see the Projects tab\" isSkeleton />"}
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
