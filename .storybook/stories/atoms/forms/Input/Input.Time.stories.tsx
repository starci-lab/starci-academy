import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Time } from "@internationalized/date"
import type { TimeValue } from "react-aria-components"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/Input.Time", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

/**
 * `Input.Time` KHÔNG có deps (2026-07-26): DOM chỉ phát `Field`/`Label`/
 * `Description`/`Error`/`Skeleton` — toàn bộ là RUỘT của `FieldFrame` (atom-
 * internal, không có story riêng) cộng HeroUI `TimeField` bọc thẳng. Không
 * component con nào có story để nhảy sang ⇒ BỎ HẲN prop `annotate` (đọc
 * `.storybook/components/atoms/forms/Input/Input.tsx`, `InputTime`).
 *
 * 2026-07-27: migrated to the `states` API (§8) — each leaf below is a single
 * `states` entry, since none of them stacks more than one rendering.
 */

/** Leaf TRẦN — chưa có label/hint/error, chỉ segments giờ:phút, chưa chọn. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<TimeValue | null>(null)
            return (
                <BlockAnatomy
                    name="Input.Time"
                    tier="atom"
                    leaf="Default"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "label, hint, errorMessage all unset",
                            why: "The field renders only its bare hour/minute segments — no `Label`, `Description`, or `Error` node appears above or below it. This is the baseline every other leaf below adds exactly one thing to.",
                            code: "<Input.Time value={value} onValueChange={setValue} />",
                            render: <Input.Time value={value} onValueChange={setValue} ariaLabel="Start time" showAnatomy />,
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf props `label` + `hint` — nhãn trên, mô tả dưới nhãn. */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<TimeValue | null>(null)
            return (
                <BlockAnatomy
                    name="Input.Time"
                    tier="atom"
                    leaf="Props `label` + `hint`"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "label and hint set",
                            why: "A `Label` node grows above the control and a muted `Description` line grows below it. Both exist so the field carries its own timezone caveat, here the GMT+7 note, without a caller placing a separate line nearby.",
                            code: "<Input.Time label=\"Start time\" hint=\"Vietnam time (GMT+7)\" value={value} onValueChange={setValue} />",
                            render: <Input.Time label="Start time" hint="Vietnam time (GMT+7)" value={value} onValueChange={setValue} showAnatomy />,
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isRequired` — dấu `*` sau nhãn. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<TimeValue | null>(null)
            return (
                <BlockAnatomy
                    name="Input.Time"
                    tier="atom"
                    leaf="Prop `isRequired`"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "isRequired = true",
                            why: "A `*` mark is appended right after the label text — no separate node, no extra colour. It exists purely so the reader can scan a form and see which fields are mandatory without opening each one.",
                            code: "<Input.Time label=\"Start time\" isRequired value={value} onValueChange={setValue} />",
                            render: <Input.Time label="Start time" isRequired value={value} onValueChange={setValue} showAnatomy />,
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `value` filled — 09:30 (`new Time(9, 30)`) thay vì `null`. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<TimeValue | null>(new Time(9, 30))
            return (
                <BlockAnatomy
                    name="Input.Time"
                    tier="atom"
                    leaf="Prop `value` (filled)"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "value = a real TimeValue (not null)",
                            why: "The hour and minute segments print the picked time instead of standing empty. Nothing else in the tree changes — this only proves the control reads a real controlled value the same way it reads `null`.",
                            code: "<Input.Time label=\"Start time\" value={new Time(9, 30)} onValueChange={setValue} />",
                            render: <Input.Time label="Start time" value={value} onValueChange={setValue} showAnatomy />,
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isDisabled` — khoá segments giờ/phút, nhãn nhạt. */
export const Disabled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<TimeValue | null>(new Time(9, 30))
            return (
                <BlockAnatomy
                    name="Input.Time"
                    tier="atom"
                    leaf="Prop `isDisabled`"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "isDisabled = true",
                            why: "The hour and minute segments both lock against input and the label dims. This is the resting state for a time the caller already decided is fixed for now, so the reader is not tempted to try editing it.",
                            code: "<Input.Time label=\"Start time\" value={new Time(9, 30)} onValueChange={setValue} isDisabled />",
                            render: <Input.Time label="Start time" value={value} onValueChange={setValue} isDisabled showAnatomy />,
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `errorMessage` — cùng `label` → dòng đỏ + viền lỗi. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<TimeValue | null>(null)
            return (
                <BlockAnatomy
                    name="Input.Time"
                    tier="atom"
                    leaf="Prop `errorMessage`"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "errorMessage set",
                            why: "An `Error` line grows below the control in the danger colour and the control border switches to its invalid state. Both changes fire together off the same prop, so a caller can never show one without the other.",
                            code: "<Input.Time label=\"Start time\" errorMessage=\"Please choose a time\" value={value} onValueChange={setValue} />",
                            render: <Input.Time label="Start time" errorMessage="Please choose a time" value={value} onValueChange={setValue} showAnatomy />,
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isSkeleton` — nhãn mirror trên field-box skeleton. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Input.Time"
                tier="atom"
                leaf="Prop `isSkeleton`"
                renderClassName="w-72"
                states={[
                    {
                        name: "isSkeleton = true, label set",
                        why: "The label still renders as real text, but the control area collapses into a shimmer box — no hour/minute segments. The label stays real so the reader keeps their place in the form while the value itself is still loading.",
                        code: "<Input.Time label=\"Start time\" isSkeleton />",
                        render: <Input.Time label="Start time" value={null} onValueChange={() => {}} isSkeleton showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}
