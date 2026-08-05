import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Time } from "@internationalized/date"
import type { TimeValue } from "react-aria-components"
import { InputTime } from "@sb-components/atoms/forms"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/InputTime", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

/**
 * `InputTime` does not compose any atom with its own story — the DOM emits HeroUI's
 * `TimeField.Group` (wrapping `TimeField` directly) plus the internal `FieldFrame`'s
 * `Label`/`Skeleton`. There is no `storyId` to point at, but these three HeroUI parts get
 * tier `heroui` so the two-law panel doesn't silently skip them.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "TimeField.Group": { tier: "heroui", role: "time segment input group" },
    "Label": { tier: "heroui", role: "field label line" },
    "Skeleton": { tier: "heroui", role: "loading placeholder" },
}

/** BARE leaf — no label/hint/error yet, just hour:minute segments, nothing picked. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<TimeValue | null>(null)
            return (
                <BlockAnatomy
                    name="InputTime"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Default"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "label, hint, errorMessage all unset",
                            why: "The field renders only its bare hour/minute segments — no `Label`, `Description`, or `Error` node appears above or below it. This is the baseline every other leaf below adds exactly one thing to.",
                            code: "<InputTime value={value} onValueChange={setValue} />",
                            render: <InputTime value={value} onValueChange={setValue} ariaLabel="Start time" />,
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
            const [value, setValue] = useState<TimeValue | null>(null)
            return (
                <BlockAnatomy
                    name="InputTime"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Props `label` + `hint`"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "label and hint set",
                            why: "A `Label` node grows above the control and a muted `Description` line grows below it. Both exist so the field carries its own timezone caveat, here the GMT+7 note, without a caller placing a separate line nearby.",
                            code: "<InputTime label=\"Start time\" hint=\"Vietnam time (GMT+7)\" value={value} onValueChange={setValue} />",
                            render: <InputTime label="Start time" hint="Vietnam time (GMT+7)" value={value} onValueChange={setValue} />,
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
            const [value, setValue] = useState<TimeValue | null>(null)
            return (
                <BlockAnatomy
                    name="InputTime"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `isRequired`"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "isRequired = true",
                            why: "A `*` mark is appended right after the label text — no separate node, no extra colour. It exists purely so the reader can scan a form and see which fields are mandatory without opening each one.",
                            code: "<InputTime label=\"Start time\" isRequired value={value} onValueChange={setValue} />",
                            render: <InputTime label="Start time" isRequired value={value} onValueChange={setValue} />,
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf prop `value` filled — 09:30 (`new Time(9, 30)`) instead of `null`. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<TimeValue | null>(new Time(9, 30))
            return (
                <BlockAnatomy
                    name="InputTime"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `value` (filled)"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "value = a real TimeValue (not null)",
                            why: "The hour and minute segments print the picked time instead of standing empty. Nothing else in the tree changes — this only proves the control reads a real controlled value the same way it reads `null`.",
                            code: "<InputTime label=\"Start time\" value={new Time(9, 30)} onValueChange={setValue} />",
                            render: <InputTime label="Start time" value={value} onValueChange={setValue} />,
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isDisabled` — locks the hour/minute segments, dims the label. */
export const Disabled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<TimeValue | null>(new Time(9, 30))
            return (
                <BlockAnatomy
                    name="InputTime"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `isDisabled`"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "isDisabled = true",
                            why: "The hour and minute segments both lock against input and the label dims. This is the resting state for a time the caller already decided is fixed for now, so the reader is not tempted to try editing it.",
                            code: "<InputTime label=\"Start time\" value={new Time(9, 30)} onValueChange={setValue} isDisabled />",
                            render: <InputTime label="Start time" value={value} onValueChange={setValue} isDisabled />,
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf prop `errorMessage` — together with `label` → red line + error border. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<TimeValue | null>(null)
            return (
                <BlockAnatomy
                    name="InputTime"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `errorMessage`"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "errorMessage set",
                            why: "An `Error` line grows below the control in the danger colour and the control border switches to its invalid state. Both changes fire together off the same prop, so a caller can never show one without the other.",
                            code: "<InputTime label=\"Start time\" errorMessage=\"Please choose a time\" value={value} onValueChange={setValue} />",
                            render: <InputTime label="Start time" errorMessage="Please choose a time" value={value} onValueChange={setValue} />,
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isSkeleton` — label mirrored above the field-box skeleton. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="InputTime"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                renderClassName="w-72"
                states={[
                    {
                        name: "isSkeleton = true, label set",
                        why: "The label still renders as real text, but the control area collapses into a shimmer box — no hour/minute segments. The label stays real so the reader keeps their place in the form while the value itself is still loading.",
                        code: "<InputTime label=\"Start time\" isSkeleton />",
                        render: <InputTime label="Start time" value={null} onValueChange={() => {}} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
