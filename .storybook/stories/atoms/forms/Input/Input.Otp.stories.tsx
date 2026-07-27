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
                    states={[
                        {
                            name: "no label, value = \"\"",
                            why: "Six empty cells render with no Label above them. This is the bare shape for a code entry the caller hasn't named yet, relying on the surrounding page to carry the context.",
                            code: "<Input.Otp value={v} onValueChange={setV} length={6} />",
                            render: (
                                <div className="w-80">
                                    <Input.Otp value={value} onValueChange={setValue} length={6} ariaLabel="Verification code" showAnatomy />
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
                    states={[
                        {
                            name: "label and hint passed",
                            why: "FieldFrame grows a Label above the row of cells and a Description line under the label. This is for a code field the caller wants to introduce and explain in the same spot, such as naming where the code was sent.",
                            code: "<Input.Otp label=\"Verification code\" hint=\"Sent to your email\" value={v} onValueChange={setV} length={6} />",
                            render: (
                                <div className="w-80">
                                    <Input.Otp label="Verification code" hint="Sent to your email" value={value} onValueChange={setValue} length={6} showAnatomy />
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
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="Input.Otp"
                    tier="atom"
                    leaf="Required"
                    states={[
                        {
                            name: "isRequired = true",
                            why: "An asterisk is appended right after the Label text, nothing else changes. This tells the learner the code cannot be left blank before they even start typing.",
                            code: "<Input.Otp label=\"Verification code\" isRequired value={v} onValueChange={setV} length={6} />",
                            render: (
                                <div className="w-80">
                                    <Input.Otp label="Verification code" isRequired value={value} onValueChange={setValue} length={6} showAnatomy />
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
                    states={[
                        {
                            name: "value = \"1234\" (length 6)",
                            why: "The first four cells carry their digits while the last two stay empty, same DOM shape as the empty row. This is the mid-typing shape of the same control, not a separate structure.",
                            code: "<Input.Otp label=\"Verification code\" value=\"1234\" onValueChange={setV} length={6} />",
                            render: (
                                <div className="w-80">
                                    <Input.Otp label="Verification code" value={value} onValueChange={setValue} length={6} showAnatomy />
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
                    states={[
                        {
                            name: "isDisabled = true, value = \"1234\"",
                            why: "The whole row of cells locks and fades, along with the Label above it. This is for a code the caller has already resolved or blocked from editing, without hiding what was entered.",
                            code: "<Input.Otp label=\"Verification code\" isDisabled value=\"1234\" length={6} />",
                            render: (
                                <div className="w-80">
                                    <Input.Otp label="Verification code" value={value} onValueChange={setValue} length={6} isDisabled showAnatomy />
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
            const [value, setValue] = useState("123")
            return (
                <BlockAnatomy
                    name="Input.Otp"
                    tier="atom"
                    leaf="Error"
                    states={[
                        {
                            name: "errorMessage set, value = \"123\"",
                            why: "The Label, a red error line, and an invalid border on the cells all appear together, added by `errorMessage` alone. This is the full validation-failed shape after a wrong code is submitted, giving the learner the reason alongside the visual cue.",
                            code: "<Input.Otp label=\"Verification code\" errorMessage=\"Incorrect code\" value=\"123\" length={6} />",
                            render: (
                                <div className="w-80">
                                    <Input.Otp label="Verification code" errorMessage="Incorrect code" value={value} onValueChange={setValue} length={6} showAnatomy />
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

/** Loading — label skeleton mirrors above a row of cell skeletons matching length. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Input.Otp"
                tier="atom"
                leaf="Loading"
                states={[
                    {
                        name: "isSkeleton = true, label passed",
                        why: "A label-shaped bar renders above a row of cell-shaped bars matching the real `length`. This mirrors the exact box the real label and cells will occupy, so the field doesn't jump in size once it's ready.",
                        code: "<Input.Otp label=\"Verification code\" isSkeleton length={6} />",
                        render: (
                            <div className="w-80">
                                <Input.Otp label="Verification code" value="" onValueChange={() => {}} length={6} isSkeleton showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
