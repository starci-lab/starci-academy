import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { parseDate, type DateValue } from "@internationalized/date"
import { InputDate } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/InputDate", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

/**
 * `InputDate` composes NO atom with its own story — the DOM emits heroui's
 * `DateField.Group` (wrapping `DatePicker`/`Calendar` directly) plus the internal
 * `FieldFrame`'s own `Label`/`Skeleton`. There's no `storyId` to point at, but these
 * three heroui parts still need the `heroui` tier so the two-rule panel doesn't
 * silently drop them (2026-07-28; see `.storybook/components/atoms/forms/Input/Input.tsx`, `InputDate`).
 *
 * 2026-07-27: migrated to the `states` API (§8) — each leaf below is a single
 * `states` entry, since none of them stacks more than one rendering.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "DateField.Group": { tier: "heroui", role: "date segment input group" },
    "Label": { tier: "heroui", role: "field label line" },
    "Skeleton": { tier: "heroui", role: "loading placeholder" },
}

/** BARE leaf — no label/hint/error yet, just the date segments + calendar trigger. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<DateValue | null>(null)
            return (
                <BlockAnatomy
                    name="InputDate"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Default"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "label, hint, errorMessage all unset",
                            why: "The field renders only its bare date segments and the calendar trigger — no `Label`, `Description`, or `Error` node appears above or below it. This is the baseline every other leaf below adds exactly one thing to.",
                            code: "<InputDate value={value} onValueChange={setValue} />",
                            render: <InputDate value={value} onValueChange={setValue} ariaLabel="Start date" />,
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf props `label` + `hint` — label above, description below the label. */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<DateValue | null>(null)
            return (
                <BlockAnatomy
                    name="InputDate"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Props `label` + `hint`"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "label and hint set",
                            why: "A `Label` node grows above the control and a muted `Description` line grows below it. Both exist so the field reads on its own, without a caller having to place a separate caption nearby.",
                            code: "<InputDate label=\"Start date\" hint=\"Format: dd/mm/yyyy\" value={value} onValueChange={setValue} />",
                            render: <InputDate label="Start date" hint="Format: dd/mm/yyyy" value={value} onValueChange={setValue} />,
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isRequired` — a `*` mark after the label. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<DateValue | null>(null)
            return (
                <BlockAnatomy
                    name="InputDate"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `isRequired`"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "isRequired = true",
                            why: "A `*` mark is appended right after the label text — no separate node, no extra colour. It exists purely so the reader can scan a form and see which fields are mandatory without opening each one.",
                            code: "<InputDate label=\"Start date\" isRequired value={value} onValueChange={setValue} />",
                            render: <InputDate label="Start date" isRequired value={value} onValueChange={setValue} />,
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf prop `value` filled — a real date (`parseDate`) instead of `null`. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<DateValue | null>(parseDate("2026-07-25"))
            return (
                <BlockAnatomy
                    name="InputDate"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `value` (filled)"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "value = a real DateValue (not null)",
                            why: "The date segments print the picked day/month/year instead of standing empty. Nothing else in the tree changes — this only proves the control reads a real controlled value the same way it reads `null`.",
                            code: "<InputDate label=\"Start date\" value={parseDate(\"2026-07-25\")} onValueChange={setValue} />",
                            render: <InputDate label="Start date" value={value} onValueChange={setValue} />,
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isDisabled` — locks the segments + calendar trigger, label dims. */
export const Disabled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<DateValue | null>(parseDate("2026-07-25"))
            return (
                <BlockAnatomy
                    name="InputDate"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `isDisabled`"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "isDisabled = true",
                            why: "The date segments and the calendar trigger both lock against input and the label dims. This is the resting state for a date the caller already decided is fixed for now, so the reader is not tempted to try editing it.",
                            code: "<InputDate label=\"Start date\" value={parseDate(\"2026-07-25\")} onValueChange={setValue} isDisabled />",
                            render: <InputDate label="Start date" value={value} onValueChange={setValue} isDisabled />,
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf prop `errorMessage` — alongside `label` → a red line + invalid border. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<DateValue | null>(null)
            return (
                <BlockAnatomy
                    name="InputDate"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `errorMessage`"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "errorMessage set",
                            why: "An `Error` line grows below the control in the danger colour and the control border switches to its invalid state. Both changes fire together off the same prop, so a caller can never show one without the other.",
                            code: "<InputDate label=\"Start date\" errorMessage=\"Please choose a date\" value={value} onValueChange={setValue} />",
                            render: <InputDate label="Start date" errorMessage="Please choose a date" value={value} onValueChange={setValue} />,
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isSkeleton` — label mirrors above the field-box skeleton. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="InputDate"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                renderClassName="w-72"
                states={[
                    {
                        name: "isSkeleton = true, label set",
                        why: "The label still renders as real text, but the control area collapses into a shimmer box — no segments, no calendar trigger. The label stays real so the reader keeps their place in the form while the value itself is still loading.",
                        code: "<InputDate label=\"Start date\" isSkeleton />",
                        render: <InputDate label="Start date" value={null} onValueChange={() => {}} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
