import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/Input.Currency", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

/**
 * ATOM — `Input.Currency`: money-amount field (HeroUI NumberField + `formatOptions`
 * currency), bọc qua `FieldFrame` nội bộ (§12e).
 *
 * ⭐ KHÔNG có `annotate` (thầy chốt 2026-07-26 lần 2: "deps không có thì thôi").
 * Atom này bọc THẲNG HeroUI, không compose atom nào khác có story riêng —
 * `Label`/`Description`/`Error`/`Skeleton` chỉ là khe của chính `FieldFrame`
 * (không có story để nhảy tới), không phải deps.
 *
 * a11y: control COMPOUND (stepper + input) không nối `htmlFor` được → atom tự đổ
 * `label`/`ariaLabel` vào `aria-label` qua helper `fieldName` (§12e).
 */

/** Default — bare field; the atom renders the currency symbol and grouping itself. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(0)
            return (
                <BlockAnatomy
                    name="Input.Currency"
                    tier="atom"
                    leaf="Default"
                    note="Bare — no label, hint, or error. The atom owns the currency formatting."
                    code={"<Input.Currency value={v} onValueChange={setV} currency=\"VND\" />"}
                >
                    <div className="w-72">
                        <Input.Currency value={value} onValueChange={setValue} ariaLabel="Amount" showAnatomy />
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
            const [value, setValue] = useState(0)
            return (
                <BlockAnatomy
                    name="Input.Currency"
                    tier="atom"
                    leaf="WithLabel"
                    note="Label + hint."
                    code={"<Input.Currency label=\"Tuition\" hint=\"In VND\" value={v} onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Currency label="Tuition" hint="In VND" value={value} onValueChange={setValue} showAnatomy />
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
            const [value, setValue] = useState(0)
            return (
                <BlockAnatomy
                    name="Input.Currency"
                    tier="atom"
                    leaf="Required"
                    note="isRequired adds an asterisk after the label."
                    code={"<Input.Currency label=\"Tuition\" isRequired value={v} onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Currency label="Tuition" isRequired value={value} onValueChange={setValue} showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Filled — a real amount, formatted as currency automatically, alongside its label. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(1500000)
            return (
                <BlockAnatomy
                    name="Input.Currency"
                    tier="atom"
                    leaf="Filled"
                    note="value holds real data — the atom formats it as currency."
                    code={"<Input.Currency label=\"Tuition\" value={1500000} onValueChange={setV} currency=\"VND\" />"}
                >
                    <div className="w-72">
                        <Input.Currency label="Tuition" value={value} onValueChange={setValue} showAnatomy />
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
            const [value, setValue] = useState(1500000)
            return (
                <BlockAnatomy
                    name="Input.Currency"
                    tier="atom"
                    leaf="Disabled"
                    note="isDisabled locks the stepper and the input."
                    code={"<Input.Currency label=\"Tuition\" value={1500000} onValueChange={setV} isDisabled />"}
                >
                    <div className="w-72">
                        <Input.Currency label="Tuition" value={value} onValueChange={setValue} isDisabled showAnatomy />
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
            const [value, setValue] = useState(0)
            return (
                <BlockAnatomy
                    name="Input.Currency"
                    tier="atom"
                    leaf="Error"
                    note="label + errorMessage → label, red message, and border all together."
                    code={"<Input.Currency label=\"Tuition\" errorMessage=\"Tuition must be greater than 0\" value={0} onValueChange={setV} />"}
                >
                    <div className="w-72">
                        <Input.Currency label="Tuition" errorMessage="Tuition must be greater than 0" value={value} onValueChange={setValue} showAnatomy />
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
                name="Input.Currency"
                tier="atom"
                leaf="Loading"
                note="isSkeleton + label → the label mirrors above the box."
                code={"<Input.Currency label=\"Tuition\" isSkeleton />"}
            >
                <div className="w-72">
                    <Input.Currency label="Tuition" value={0} onValueChange={() => {}} isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
