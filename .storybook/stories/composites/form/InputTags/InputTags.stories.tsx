import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { InputTags } from "@sb-components/composites/form/InputTags/InputTags"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Composites/Form/InputTags", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

/**
 * `InputTags` — a tag-input field where each token is a removable `Chip` (`<Chip onRemove … />`),
 * rebuilt one per tag. Wraps `FieldFrame`, whose `Label`/`Skeleton` are real heroui components.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Chip": { tier: "atom", role: "each tag renders as a removable Chip", storyId: "atoms-chips-chip-chip--removable" },
    "Label": { tier: "heroui", role: "field label line" },
    "Skeleton": { tier: "heroui", role: "loading placeholder" },
}

/** BARE leaf — empty, type + Enter to add a tag. No token yet, so no Chip deps yet. Migrated to `states` 2026-07-27. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>([])
            return (
                <BlockAnatomy
                    name="InputTags"
                    tier="composite"
                    annotate={ANNOTATE}
                    leaf="Default"
                    states={[
                        {
                            name: "value = [] (no tags yet)",
                            why: "The field renders as an empty bordered box holding just the draft text input, with no `Chip` tokens and no label or hint above it. Typing a token and pressing Enter is how the first tag gets added, so this bare box is the field's true resting state before any data exists.",
                            code: "<InputTags value={value} onValueChange={setValue} placeholder=\"Add a tag…\" />",
                            render: (
                                <div data-tier="fixture" className="w-80">
                                    <InputTags value={value} onValueChange={setValue} placeholder="Add a tag…" ariaLabel="Tags" />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf for props `label` + `hint` — the label on top, description below the label. Migrated to `states` 2026-07-27. */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>([])
            return (
                <BlockAnatomy
                    name="InputTags"
                    tier="composite"
                    annotate={ANNOTATE}
                    leaf="Props `label` + `hint`"
                    states={[
                        {
                            name: "label + hint set, value = []",
                            why: "A `label` line appears above the box and a `hint` line appears beneath it, while the tag box itself stays exactly as empty as the Default state. The hint spells out the Enter-to-add gesture that the bare box alone can't communicate.",
                            code: "<InputTags label=\"Skills\" hint=\"Press Enter to add\" value={value} onValueChange={setValue} />",
                            render: (
                                <div data-tier="fixture" className="w-80">
                                    <InputTags label="Skills" hint="Press Enter to add" value={value} onValueChange={setValue} placeholder="Add a tag…" />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf for prop `isRequired` — a `*` mark after the label. Migrated to `states` 2026-07-27. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>([])
            return (
                <BlockAnatomy
                    name="InputTags"
                    tier="composite"
                    annotate={ANNOTATE}
                    leaf="Prop `isRequired`"
                    states={[
                        {
                            name: "isRequired = true",
                            why: "A `*` mark attaches to the end of the label; nothing else about the box or its tokens changes. Some tag fields aren't optional, so the asterisk has to appear before the caller ever tries to submit the surrounding form.",
                            code: "<InputTags label=\"Skills\" isRequired value={value} onValueChange={setValue} />",
                            render: (
                                <div data-tier="fixture" className="w-80">
                                    <InputTags label="Skills" isRequired value={value} onValueChange={setValue} placeholder="Add a tag…" />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf for prop `value` filled — a few tokens, each one a `Chip` (a real dep). Migrated to `states` 2026-07-27. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>(["React", "TypeScript", "GraphQL"])
            return (
                <BlockAnatomy
                    name="InputTags"
                    tier="composite"
                    leaf="Prop `value` (filled)"
                    annotate={ANNOTATE}
                    states={[
                        {
                            name: "value = [\"React\", \"TypeScript\", \"GraphQL\"]",
                            why: "Each string in `value` mounts as its own removable `Chip` inside the box, which is the one real dependency this composite rebuilds. Rendering tags as chips instead of plain comma-joined text is what makes each one individually removable.",
                            code: "<InputTags label=\"Skills\" value={[\"React\", \"TypeScript\", \"GraphQL\"]} onValueChange={setValue} />",
                            render: (
                                <div data-tier="fixture" className="w-80">
                                    <InputTags label="Skills" value={value} onValueChange={setValue} placeholder="Add a tag…" removeLabel="Remove tag" />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf for prop `isDisabled` — locks the box, dims the label; Chips still show but can't be removed. Migrated to `states` 2026-07-27. */
export const Disabled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>(["React", "TypeScript"])
            return (
                <BlockAnatomy
                    name="InputTags"
                    tier="composite"
                    leaf="Prop `isDisabled`"
                    annotate={ANNOTATE}
                    states={[
                        {
                            name: "isDisabled = true, value = [\"React\", \"TypeScript\"]",
                            why: "The chips stay visible and the label dims, but the × on each chip stops responding and the draft input can no longer take focus. The tags must still read even though editing is locked, for example while a field the tags depend on is still loading.",
                            code: "<InputTags label=\"Skills\" isDisabled value={[\"React\", \"TypeScript\"]} onValueChange={setValue} />",
                            render: (
                                <div data-tier="fixture" className="w-80">
                                    <InputTags label="Skills" value={value} onValueChange={setValue} placeholder="Add a tag…" removeLabel="Remove tag" isDisabled />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf for prop `errorMessage` — together with `label` → a red line + error border. Migrated to `states` 2026-07-27. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>(["React"])
            return (
                <BlockAnatomy
                    name="InputTags"
                    tier="composite"
                    leaf="Prop `errorMessage`"
                    annotate={ANNOTATE}
                    states={[
                        {
                            name: "errorMessage set, value = [\"React\"]",
                            why: "A red line appears under the box and the border switches to the danger tone, while the existing chip keeps rendering unchanged. The message has to sit right at the field that failed validation, not float somewhere else on the form.",
                            code: "<InputTags label=\"Skills\" errorMessage=\"Add at least 3 tags\" value={[\"React\"]} onValueChange={setValue} />",
                            render: (
                                <div data-tier="fixture" className="w-80">
                                    <InputTags label="Skills" errorMessage="Add at least 3 tags" value={value} onValueChange={setValue} placeholder="Add a tag…" removeLabel="Remove tag" />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf for prop `isSkeleton` — the label mirrors onto the field-box skeleton. Migrated to `states` 2026-07-27. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="InputTags"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                states={[
                    {
                        name: "isSkeleton = true, label set",
                        why: "The label text still renders above a shimmer bar that stands in for the whole box — chips, draft input, and all. The composite draws no bar of its own here (COMPOSITE-10) — it hands `isSkeleton` to the same field-box mirror the other `Input.*` atoms use.",
                        code: "<InputTags label=\"Skills\" isSkeleton />",
                        render: (
                            <div data-tier="fixture" className="w-80">
                                <InputTags label="Skills" value={[]} onValueChange={() => {}} isSkeleton />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
