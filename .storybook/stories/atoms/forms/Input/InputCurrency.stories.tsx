import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { InputCurrency } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/InputCurrency", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

/**
 * ATOM — `InputCurrency`: money-amount field (HeroUI NumberField + `formatOptions`
 * currency), wrapped internally through `FieldFrame` (§12e).
 *
 * No component here has its own story ⇒ `annotate` carries no `storyId` — but the
 * heroui `NumberField.Group` along with `FieldFrame`'s own `Label`/`Skeleton` still
 * need the `heroui` tier so the two-rule panel doesn't silently miss them
 * (2026-07-28).
 *
 * a11y: the control is COMPOUND (stepper + input), so it can't wire an `htmlFor` —
 * the atom feeds `label`/`ariaLabel` into `aria-label` itself via the `fieldName`
 * helper (§12e).
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "NumberField.Group": { tier: "heroui", role: "currency stepper group" },
    "Label": { tier: "heroui", role: "field label line" },
    "Skeleton": { tier: "heroui", role: "loading placeholder" },
}

/** Default — bare field; the atom renders the currency symbol and grouping itself. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(0)
            return (
                <BlockAnatomy
                    name="InputCurrency"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Default"
                    states={[
                        {
                            name: "value = 0, no label",
                            why: "The field renders as a bare stepper-and-input box with no label, hint, or error text around it. The atom formats the amount as currency itself, so nothing on screen is a raw unformatted number.",
                            code: "<InputCurrency value={v} onValueChange={setV} currency=\"VND\" />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <InputCurrency value={value} onValueChange={setValue} ariaLabel="Amount" showAnatomy />
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

/** WithLabel — label above the field, hint below the label. */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(0)
            return (
                <BlockAnatomy
                    name="InputCurrency"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="WithLabel"
                    states={[
                        {
                            name: "label and hint set",
                            why: "A label appears above the stepper box and a hint line appears beneath it, telling the payer what the amount is for before they touch the field. The stepper and formatting stay exactly as in Default.",
                            code: "<InputCurrency label=\"Tuition\" hint=\"In VND\" value={v} onValueChange={setV} />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <InputCurrency label="Tuition" hint="In VND" value={value} onValueChange={setValue} showAnatomy />
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

/** Required — label with the required asterisk. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(0)
            return (
                <BlockAnatomy
                    name="InputCurrency"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Required"
                    states={[
                        {
                            name: "isRequired = true",
                            why: "The label gains a trailing asterisk mark while every other part of the field stays the same as the plain labelled case. The mark is the only signal that this amount cannot be left unset.",
                            code: "<InputCurrency label=\"Tuition\" isRequired value={v} onValueChange={setV} />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <InputCurrency label="Tuition" isRequired value={value} onValueChange={setValue} showAnatomy />
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

/** Filled — a real amount, formatted as currency automatically, alongside its label. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(1500000)
            return (
                <BlockAnatomy
                    name="InputCurrency"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Filled"
                    states={[
                        {
                            name: "value = 1500000",
                            why: "The box shows the real amount grouped and prefixed with the currency symbol instead of a bare stepper at zero. This is the field's steady resting look once a real tuition figure has landed in it.",
                            code: "<InputCurrency label=\"Tuition\" value={1500000} onValueChange={setV} currency=\"VND\" />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <InputCurrency label="Tuition" value={value} onValueChange={setValue} showAnatomy />
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

/** Disabled — stepper and input locked, label faded. */
export const Disabled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(1500000)
            return (
                <BlockAnatomy
                    name="InputCurrency"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Disabled"
                    states={[
                        {
                            name: "isDisabled = true, value set",
                            why: "Both the increment/decrement stepper and the input lock against further changes, and the label fades to the disabled tone. The field still shows the amount, it simply refuses new input.",
                            code: "<InputCurrency label=\"Tuition\" value={1500000} onValueChange={setV} isDisabled />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <InputCurrency label="Tuition" value={value} onValueChange={setValue} isDisabled showAnatomy />
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

/** Error — label + errorMessage → label, red message, and invalid border all show. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(0)
            return (
                <BlockAnatomy
                    name="InputCurrency"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Error"
                    states={[
                        {
                            name: "errorMessage set",
                            why: "A red message line appears under the field and its border turns red at the same time, both driven by the same `errorMessage` string. The label above stays neutral, so only the amount field itself reports the problem.",
                            code: "<InputCurrency label=\"Tuition\" errorMessage=\"Tuition must be greater than 0\" value={0} onValueChange={setV} />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <InputCurrency label="Tuition" errorMessage="Tuition must be greater than 0" value={value} onValueChange={setValue} showAnatomy />
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

/** Loading — label skeleton mirrors above the field-box skeleton. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="InputCurrency"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Loading"
                states={[
                    {
                        name: "isSkeleton = true, label set",
                        why: "The label mirrors into a shimmer bar sitting above a shimmer box the same size as the real stepper field. Nothing about the eventual label or field size shifts the layout once the real amount arrives.",
                        code: "<InputCurrency label=\"Tuition\" isSkeleton />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <InputCurrency label="Tuition" value={0} onValueChange={() => {}} isSkeleton showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
