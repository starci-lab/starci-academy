import React, { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { List } from "@sb-components/composites/lists/List/List"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE (teacher finalized 2026-07-25): `List.ToggleRow` is a ONE SETTINGS
 * ROW scaffold. What it produces: the on/off switch, with/without a description
 * line, locked (`isDisabled`), and the `isSkeleton` mirror of THIS row itself.
 * ARRANGING multiple rows into a list (section label, gap, CTA) belongs to
 * `List.Labeled` — NOT repeated here.
 */
const meta: Meta<typeof List.ToggleRow> = {
    title: "Composites/Lists/List/List.ToggleRow",
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
 *
 * ⭐ 2026-07-27 — `Switch` renders straight from `@heroui/react` (no port of ours
 * wraps it), so it needs the `heroui` tier to show up in the tree at all: a `heroui`
 * node needs no `storyId`, the tier alone is what keeps the panel from hiding it.
 */
const ROW_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "TitledText": { tier: "composite", role: "the label with an optional muted description, stacked as one node" },
    "Switch": { tier: "heroui", role: "the on/off switch, pinned to the right edge of the row" },
}

/**
 * `isSkeleton` renders a DIFFERENT trailing node than the real row: `Choice.Switch`
 * (our own atom, with its own `isSkeleton` mirror) instead of the raw HeroUI `Switch` —
 * so the Loading leaf gets its own annotate table naming what's actually in that DOM.
 */
const LOADING_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "TitledText": { tier: "composite", role: "the label with an optional muted description, mirrored as shimmer bars" },
    "Choice.Switch": {
        tier: "atom",
        role: "the switch's own shimmer mirror while isSkeleton",
        storyId: "atoms-forms-choice-choice-switch--default",
    },
}

/** Default: label + description, unchecked. */
export const Default: Story = {
    render: function Render() {
        const [checked, setChecked] = useState(false)
        return (
            <div className="p-8">
                <BlockAnatomy
                    name="List.ToggleRow"
                    tier="composite"
                    leaf="Default"
                    annotate={ROW_ANNOTATE}
                    reason="Generalizes the repeating settings toggle row seen in PrivacySettings: a TitledText paired with a Switch at gap-3, so every settings surface shares one row scaffold instead of hand-rolling its own."
                    states={[
                        {
                            name: "checked = false, description set",
                            why: "The row shows a label with a muted description line beneath it and the switch sits off. This is the row's resting shape before the learner has touched the toggle.",
                            code: `<List.ToggleRow
  label="Hiển thị dự án"
  description="Cho phép khách xem tab Dự án trên hồ sơ công khai của bạn"
  checked={checked}
  onCheckedChange={setChecked}
/>`,
                            render: (
                                <List.ToggleRow
                                    label="Hiển thị dự án"
                                    description="Cho phép khách xem tab Dự án trên hồ sơ công khai của bạn"
                                    checked={checked}
                                    onCheckedChange={setChecked}
                                    showAnatomy
                                />
                            ),
                        },
                    ]}
                />
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
                    tier="composite"
                    leaf="Selected"
                    annotate={ROW_ANNOTATE}
                    states={[
                        {
                            name: "checked = true",
                            why: "Only the switch's thumb and track flip to the on position, while the label and description stay exactly as in Default. No node appears or disappears, the toggle simply reports the other boolean.",
                            code: `<List.ToggleRow
  label="Show projects"
  description="Allow visitors to see the Projects tab on your public profile"
  checked={checked}
  onCheckedChange={setChecked}
/>`,
                            render: (
                                <List.ToggleRow
                                    label="Hiển thị dự án"
                                    description="Cho phép khách xem tab Dự án trên hồ sơ công khai của bạn"
                                    checked={checked}
                                    onCheckedChange={setChecked}
                                    showAnatomy
                                />
                            ),
                        },
                    ]}
                />
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
                    tier="composite"
                    leaf="NoDescription"
                    annotate={ROW_ANNOTATE}
                    states={[
                        {
                            name: "description = undefined",
                            why: "TitledText keeps only the title line and the description line drops out entirely, yet the row still stays vertically centred against the switch. The node is still the same TitledText, it simply renders one line instead of two.",
                            code: "<List.ToggleRow label=\"Dark mode\" checked={checked} onCheckedChange={setChecked} />",
                            render: (
                                <List.ToggleRow label="Chế độ tối" checked={checked} onCheckedChange={setChecked} showAnatomy />
                            ),
                        },
                    ]}
                />
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
                tier="composite"
                leaf="Disabled"
                annotate={ROW_ANNOTATE}
                states={[
                    {
                        name: "isDisabled = true, checked = false",
                        why: "The whole row dims to half opacity and the switch stops accepting clicks, while the composition stays the same TitledText plus Switch pair. This is the shape a per-section row takes when a parent lock overrides it.",
                        code: `<List.ToggleRow
  label="Show projects"
  description="Locked by profile lock mode"
  checked={false}
  isDisabled
/>`,
                        render: (
                            <List.ToggleRow
                                label="Hiển thị dự án"
                                description="Đang bị khoá bởi chế độ khoá hồ sơ"
                                checked={false}
                                onCheckedChange={() => {}}
                                isDisabled
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Loading: `isSkeleton` mirrors label + description bars and the switch pill, so the row never jumps when data arrives. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="List.ToggleRow"
                tier="composite"
                leaf="Loading"
                annotate={LOADING_ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "TitledText and Switch each swap to their own shimmer mirror at the same size the real label, description, and switch would occupy. The row stays the same two nodes, so nothing shifts once the real settings arrive.",
                        code: "<List.ToggleRow label=\"Show projects\" description=\"Allow visitors to see the Projects tab\" isSkeleton />",
                        render: (
                            <List.ToggleRow
                                label="Hiển thị dự án"
                                description="Cho phép khách xem tab Dự án trên hồ sơ công khai của bạn"
                                checked={false}
                                onCheckedChange={() => {}}
                                isSkeleton
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
