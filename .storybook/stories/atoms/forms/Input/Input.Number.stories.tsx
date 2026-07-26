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
                    note="Bare — no label, hint, or error."
                    code={"<Input.Number value={v} onValueChange={setV} minValue={0} maxValue={10} step={1} />"}
                >
                    <div className="w-56">
                        <Input.Number value={value} onValueChange={setValue} minValue={0} maxValue={10} step={1} ariaLabel="Quantity" showAnatomy />
                    </div>
                </BlockAnatomy>
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
                    note="Label + hint."
                    code={"<Input.Number label=\"Quantity\" hint=\"0 to 10\" value={v} onValueChange={setV} minValue={0} maxValue={10} />"}
                >
                    <div className="w-56">
                        <Input.Number label="Quantity" hint="0 to 10" value={value} onValueChange={setValue} minValue={0} maxValue={10} step={1} showAnatomy />
                    </div>
                </BlockAnatomy>
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
                    note="isRequired adds an asterisk after the label."
                    code={"<Input.Number label=\"Quantity\" isRequired value={v} onValueChange={setV} minValue={0} maxValue={10} />"}
                >
                    <div className="w-56">
                        <Input.Number label="Quantity" isRequired value={value} onValueChange={setValue} minValue={0} maxValue={10} step={1} showAnatomy />
                    </div>
                </BlockAnatomy>
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
                    note="value already holds real data."
                    code={"<Input.Number label=\"Quantity\" value={5} onValueChange={setV} minValue={0} maxValue={10} />"}
                >
                    <div className="w-56">
                        <Input.Number label="Quantity" value={value} onValueChange={setValue} minValue={0} maxValue={10} step={1} showAnatomy />
                    </div>
                </BlockAnatomy>
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
                    note="isDisabled locks the stepper and the input."
                    code={"<Input.Number label=\"Quantity\" value={5} onValueChange={setV} isDisabled />"}
                >
                    <div className="w-56">
                        <Input.Number label="Quantity" value={value} onValueChange={setValue} minValue={0} maxValue={10} step={1} isDisabled showAnatomy />
                    </div>
                </BlockAnatomy>
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
                    note="label + errorMessage → label, red message, and border all together."
                    code={"<Input.Number label=\"Quantity\" errorMessage=\"Above the max of 10\" value={15} onValueChange={setV} />"}
                >
                    <div className="w-56">
                        <Input.Number label="Quantity" errorMessage="Above the max of 10" value={value} onValueChange={setValue} minValue={0} maxValue={10} step={1} showAnatomy />
                    </div>
                </BlockAnatomy>
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
                note="isSkeleton + label → the label mirrors above the box."
                code={"<Input.Number label=\"Quantity\" isSkeleton />"}
            >
                <div className="w-56">
                    <Input.Number label="Quantity" value={0} onValueChange={() => {}} isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
