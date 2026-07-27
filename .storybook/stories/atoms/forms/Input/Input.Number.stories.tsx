import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/Input.Number", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

/**
 * ATOM — `Input.Number`: numeric field + stepper (HeroUI NumberField), bọc qua
 * `FieldFrame` nội bộ (§12e — form atom tự mang label/hint/errorMessage/required,
 * KHÔNG có tầng Field riêng).
 *
 * ⭐ KHÔNG có `annotate` (thầy chốt 2026-07-26 lần 2: "deps không có thì thôi").
 * Atom này bọc THẲNG HeroUI, không compose atom nào khác có story riêng —
 * `Label`/`Description`/`Error`/`Skeleton` chỉ là khe của chính `FieldFrame`
 * (không có story để nhảy tới), không phải deps.
 *
 * a11y: control COMPOUND (stepper + input) không nối `htmlFor` được → atom tự đổ
 * `label`/`ariaLabel` vào `aria-label` qua helper `fieldName` (§12e).
 */

/** Default — bare number field with a stepper (min/max/step), no label yet. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(1)
            return (
                <BlockAnatomy
                    name="Input.Number"
                    tier="atom"
                    leaf="Default"
                    states={[
                        {
                            name: "no label, hint, or error passed",
                            why: "Only the numeric field with its decrement/increment stepper renders, no label row above it and no hint or error line below it. This is the bare control, the shape every other leaf below adds one thing on top of.",
                            code: "<Input.Number value={v} onValueChange={setV} minValue={0} maxValue={10} step={1} />",
                            render: (
                                <div className="w-56">
                                    <Input.Number value={value} onValueChange={setValue} minValue={0} maxValue={10} step={1} ariaLabel="Quantity" showAnatomy />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** WithLabel — label above the field, hint below the label. */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(1)
            return (
                <BlockAnatomy
                    name="Input.Number"
                    tier="atom"
                    leaf="WithLabel"
                    states={[
                        {
                            name: "label and hint set",
                            why: "A label row grows above the field and a muted hint line grows below it, on top of the same bare field from `Default`. Naming the field and explaining its range are two separate slots a caller can add independently.",
                            code: "<Input.Number label=\"Quantity\" hint=\"0 to 10\" value={v} onValueChange={setV} minValue={0} maxValue={10} />",
                            render: (
                                <div className="w-56">
                                    <Input.Number label="Quantity" hint="0 to 10" value={value} onValueChange={setValue} minValue={0} maxValue={10} step={1} showAnatomy />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Required — label with the required asterisk. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(1)
            return (
                <BlockAnatomy
                    name="Input.Number"
                    tier="atom"
                    leaf="Required"
                    states={[
                        {
                            name: "isRequired = true",
                            why: "A `*` mark appears right after the label text, nothing else in the field changes. It's the one visual cue that tells the learner this quantity is not optional before they can move on.",
                            code: "<Input.Number label=\"Quantity\" isRequired value={v} onValueChange={setV} minValue={0} maxValue={10} />",
                            render: (
                                <div className="w-56">
                                    <Input.Number label="Quantity" isRequired value={value} onValueChange={setValue} minValue={0} maxValue={10} step={1} showAnatomy />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Filled — the field already holds a real value, alongside its label. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(5)
            return (
                <BlockAnatomy
                    name="Input.Number"
                    tier="atom"
                    leaf="Filled"
                    states={[
                        {
                            name: "value = 5",
                            why: "The stepper reads the same number the field holds, alongside the label from `WithLabel`. The tree doesn't change from an empty field, only the digit painted inside it does.",
                            code: "<Input.Number label=\"Quantity\" value={5} onValueChange={setV} minValue={0} maxValue={10} />",
                            render: (
                                <div className="w-56">
                                    <Input.Number label="Quantity" value={value} onValueChange={setValue} minValue={0} maxValue={10} step={1} showAnatomy />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Disabled — stepper and input locked, label faded. */
export const Disabled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(5)
            return (
                <BlockAnatomy
                    name="Input.Number"
                    tier="atom"
                    leaf="Disabled"
                    states={[
                        {
                            name: "isDisabled = true",
                            why: "The stepper buttons and the input both lock and the label fades along with them, no node is added or removed. This is the state a quantity field takes while whatever it controls can't be changed right now.",
                            code: "<Input.Number label=\"Quantity\" value={5} onValueChange={setV} isDisabled />",
                            render: (
                                <div className="w-56">
                                    <Input.Number label="Quantity" value={value} onValueChange={setValue} minValue={0} maxValue={10} step={1} isDisabled showAnatomy />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Error — label + errorMessage → label, red message, and invalid border all show. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(15)
            return (
                <BlockAnatomy
                    name="Input.Number"
                    tier="atom"
                    leaf="Error"
                    states={[
                        {
                            name: "errorMessage = \"Above the max of 10\"",
                            why: "The field's border turns red and a red message line grows below it carrying the actual text, on top of the label from `WithLabel`. Setting `errorMessage` implies the invalid border on its own, so a caller never has to pass a separate invalid flag too.",
                            code: "<Input.Number label=\"Quantity\" errorMessage=\"Above the max of 10\" value={15} onValueChange={setV} />",
                            render: (
                                <div className="w-56">
                                    <Input.Number label="Quantity" errorMessage="Above the max of 10" value={value} onValueChange={setValue} minValue={0} maxValue={10} step={1} showAnatomy />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Loading — label skeleton mirrors above the field-box skeleton. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Input.Number"
                tier="atom"
                leaf="Loading"
                states={[
                    {
                        name: "isSkeleton = true, label set",
                        why: "The field box and the label both switch to shimmer bars in the same layout the loaded control will occupy. Mirroring the label too, instead of only the box, keeps the row height from jumping once the real label text arrives.",
                        code: "<Input.Number label=\"Quantity\" isSkeleton />",
                        render: (
                            <div className="w-56">
                                <Input.Number label="Quantity" value={0} onValueChange={() => {}} isSkeleton showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
