import React, { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { ListToggleRow } from "@sb-components/composites/lists/List/List"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ STATE SCOPE (teacher finalized 2026-07-25): `ListToggleRow` is a ONE SETTINGS
 * ROW scaffold. What it produces: the on/off switch, with/without a description
 * line, locked (`isDisabled`), and the `isSkeleton` mirror of THIS row itself.
 * ARRANGING multiple rows into a list (section label, gap, CTA) belongs to
 * `ListLabeled` — NOT repeated here.
 */
const meta: Meta<typeof ListToggleRow> = {
    title: "Composites/Lists/List/ListToggleRow",
    component: ListToggleRow,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ListToggleRow>

/**
 * ANATOMY IS PER-LEAF: every story below wraps its render in its OWN BlockAnatomy
 * axis. `ListToggleRow` composes `TitledText` (label + optional muted
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
 * `isSkeleton` renders a DIFFERENT trailing node than the real row: `ChoiceSwitch`
 * (our own atom, with its own `isSkeleton` mirror) instead of the raw HeroUI `Switch` —
 * so the Loading leaf gets its own annotate table naming what's actually in that DOM.
 */
const LOADING_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "TitledText": { tier: "composite", role: "the label with an optional muted description, mirrored as shimmer bars" },
    "ChoiceSwitch": {
        tier: "atom",
        role: "the switch's own shimmer mirror while isSkeleton",
        storyId: "atoms-forms-choice-choiceswitch--default",
    },
}

/** Default: label + description, unchecked. */
export const Default: Story = {
    render: function Render() {
        const [checked, setChecked] = useState(false)
        return (
            <div data-tier="fixture" className="p-8">
                <BlockAnatomy
                    name="ListToggleRow"
                    tier="composite"
                    leaf="Default"
                    annotate={ROW_ANNOTATE}
                    reason="Generalizes the repeating settings toggle row seen in PrivacySettings: a TitledText paired with a Switch at gap-3, so every settings surface shares one row scaffold instead of hand-rolling its own."
                    states={[
                        {
                            name: "checked = false, description set",
                            why: "The row shows a label with a muted description line beneath it and the switch sits off. This is the row's resting shape before the learner has touched the toggle.",
                            code: `<ListToggleRow
  label="Show projects"
  description="Allow visitors to see the Projects tab on your public profile"
  checked={checked}
  onCheckedChange={setChecked}
/>`,
                            render: (
                                <ListToggleRow
                                    label="Show projects"
                                    description="Allow visitors to see the Projects tab on your public profile"
                                    checked={checked}
                                    onCheckedChange={setChecked}
                                   
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
            <div data-tier="fixture" className="p-8">
                <BlockAnatomy
                    name="ListToggleRow"
                    tier="composite"
                    leaf="Selected"
                    annotate={ROW_ANNOTATE}
                    states={[
                        {
                            name: "checked = true",
                            why: "Only the switch's thumb and track flip to the on position, while the label and description stay exactly as in Default. No node appears or disappears, the toggle simply reports the other boolean.",
                            code: `<ListToggleRow
  label="Show projects"
  description="Allow visitors to see the Projects tab on your public profile"
  checked={checked}
  onCheckedChange={setChecked}
/>`,
                            render: (
                                <ListToggleRow
                                    label="Show projects"
                                    description="Allow visitors to see the Projects tab on your public profile"
                                    checked={checked}
                                    onCheckedChange={setChecked}
                                   
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
            <div data-tier="fixture" className="p-8">
                <BlockAnatomy
                    name="ListToggleRow"
                    tier="composite"
                    leaf="NoDescription"
                    annotate={ROW_ANNOTATE}
                    states={[
                        {
                            name: "description = undefined",
                            why: "TitledText keeps only the title line and the description line drops out entirely, yet the row still stays vertically centred against the switch. The node is still the same TitledText, it simply renders one line instead of two.",
                            code: "<ListToggleRow label=\"Dark mode\" checked={checked} onCheckedChange={setChecked} />",
                            render: (
                                <ListToggleRow label="Dark mode" checked={checked} onCheckedChange={setChecked} />
                            ),
                        },
                    ]}
                />
            </div>
        )
    },
}

/**
 * Disabled: grounded in the hand-roll's "Lock profile" override — when the
 * profile lock is on, every per-section visibility row dims + stops
 * accepting input.
 */
export const Disabled: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ListToggleRow"
                tier="composite"
                leaf="Disabled"
                annotate={ROW_ANNOTATE}
                states={[
                    {
                        name: "isDisabled = true, checked = false",
                        why: "The whole row dims to half opacity and the switch stops accepting clicks, while the composition stays the same TitledText plus Switch pair. This is the shape a per-section row takes when a parent lock overrides it.",
                        code: `<ListToggleRow
  label="Show projects"
  description="Locked by profile lock mode"
  checked={false}
  isDisabled
/>`,
                        render: (
                            <ListToggleRow
                                label="Show projects"
                                description="Locked by profile lock mode"
                                checked={false}
                                onCheckedChange={() => {}}
                                isDisabled
                               
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
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ListToggleRow"
                tier="composite"
                leaf="Loading"
                annotate={LOADING_ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "TitledText and Switch each swap to their own shimmer mirror at the same size the real label, description, and switch would occupy. The row stays the same two nodes, so nothing shifts once the real settings arrive.",
                        code: "<ListToggleRow label=\"Show projects\" description=\"Allow visitors to see the Projects tab\" isSkeleton />",
                        render: (
                            <ListToggleRow
                                label="Show projects"
                                description="Allow visitors to see the Projects tab on your public profile"
                                checked={false}
                                onCheckedChange={() => {}}
                                isSkeleton
                               
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
