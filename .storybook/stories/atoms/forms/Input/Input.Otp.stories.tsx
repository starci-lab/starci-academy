import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/Input.Otp", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

/**
 * ATOM — `Input.Otp`: one-time-code cells (HeroUI InputOTP), `length` slots, bọc
 * qua `FieldFrame` nội bộ (§12e).
 *
 * ⭐ KHÔNG có `annotate` (thầy chốt 2026-07-26 lần 2: "deps không có thì thôi").
 * Atom này bọc THẲNG HeroUI, không compose atom nào khác có story riêng —
 * `Label`/`Description`/`Error`/`Skeleton` chỉ là khe của chính `FieldFrame`
 * (không có story để nhảy tới), không phải deps.
 *
 * a11y: control COMPOUND (dãy ô, không phải một `<input>` đơn) không nối `htmlFor`
 * được → atom tự đổ `label`/`ariaLabel` vào `aria-label` qua helper `fieldName`
 * (§12e) — bắt buộc, vì mất kết nối này thì screen reader không đọc được tên field.
 */

/** Default — six empty cells, no label yet. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Input.Otp"
                    tier="atom"
                    leaf="Default"
                    note="Bare — no label, hint, or error."
                    code={"<Input.Otp value={v} onValueChange={setV} length={6} />"}
                >
                    <div className="w-80">
                        <Input.Otp value={value} onValueChange={setValue} length={6} ariaLabel="Verification code" showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** WithLabel — label above the cells, hint below the label. */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Input.Otp"
                    tier="atom"
                    leaf="WithLabel"
                    note="Label + hint."
                    code={"<Input.Otp label=\"Verification code\" hint=\"Sent to your email\" value={v} onValueChange={setV} length={6} />"}
                >
                    <div className="w-80">
                        <Input.Otp label="Verification code" hint="Sent to your email" value={value} onValueChange={setValue} length={6} showAnatomy />
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
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Input.Otp"
                    tier="atom"
                    leaf="Required"
                    note="isRequired adds an asterisk after the label."
                    code={"<Input.Otp label=\"Verification code\" isRequired value={v} onValueChange={setV} length={6} />"}
                >
                    <div className="w-80">
                        <Input.Otp label="Verification code" isRequired value={value} onValueChange={setValue} length={6} showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Filled — some cells already carry digits, alongside the label. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("1234")
            return (
                <BlockAnatomy
                    name="Input.Otp"
                    tier="atom"
                    leaf="Filled"
                    note="value already holds part of the code."
                    code={"<Input.Otp label=\"Verification code\" value=\"1234\" onValueChange={setV} length={6} />"}
                >
                    <div className="w-80">
                        <Input.Otp label="Verification code" value={value} onValueChange={setValue} length={6} showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Disabled — cells locked, label faded (code already present). */
export const Disabled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("1234")
            return (
                <BlockAnatomy
                    name="Input.Otp"
                    tier="atom"
                    leaf="Disabled"
                    note="isDisabled locks and fades the row of cells."
                    code={"<Input.Otp label=\"Verification code\" isDisabled value=\"1234\" length={6} />"}
                >
                    <div className="w-80">
                        <Input.Otp label="Verification code" value={value} onValueChange={setValue} length={6} isDisabled showAnatomy />
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
            const [value, setValue] = useState("123")
            return (
                <BlockAnatomy
                    name="Input.Otp"
                    tier="atom"
                    leaf="Error"
                    note="label + errorMessage → label, red message, and border all together."
                    code={"<Input.Otp label=\"Verification code\" errorMessage=\"Incorrect code\" value=\"123\" length={6} />"}
                >
                    <div className="w-80">
                        <Input.Otp label="Verification code" errorMessage="Incorrect code" value={value} onValueChange={setValue} length={6} showAnatomy />
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Loading — label skeleton mirrors above a row of cell skeletons matching length. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Input.Otp"
                tier="atom"
                leaf="Loading"
                note="isSkeleton + label → the label mirrors above the row of cells."
                code={"<Input.Otp label=\"Verification code\" isSkeleton length={6} />"}
            >
                <div className="w-80">
                    <Input.Otp label="Verification code" value="" onValueChange={() => {}} length={6} isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
