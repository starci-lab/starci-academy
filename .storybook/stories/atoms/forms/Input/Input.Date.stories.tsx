import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { parseDate, type DateValue } from "@internationalized/date"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/Input.Date", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

/**
 * `Input.Date` KHÔNG có deps (2026-07-26): DOM chỉ phát `Field`/`Label`/
 * `Description`/`Error`/`Skeleton` — toàn bộ là RUỘT của `FieldFrame` (atom-
 * internal, không có story riêng) cộng HeroUI `DatePicker`/`Calendar` bọc thẳng.
 * Không component con nào có story để nhảy sang ⇒ BỎ HẲN prop `annotate` (đọc
 * `.storybook/components/atoms/forms/Input/Input.tsx`, `InputDate`).
 *
 * 2026-07-27: migrated to the `states` API (§8) — each leaf below is a single
 * `states` entry, since none of them stacks more than one rendering.
 */

/** Leaf TRẦN — chưa có label/hint/error, chỉ segments ngày + trigger lịch. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<DateValue | null>(null)
            return (
                <BlockAnatomy
                    name="Input.Date"
                    tier="atom"
                    leaf="Default"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "label, hint, errorMessage all unset",
                            why: "The field renders only its bare date segments and the calendar trigger — no `Label`, `Description`, or `Error` node appears above or below it. This is the baseline every other leaf below adds exactly one thing to.",
                            code: "<Input.Date value={value} onValueChange={setValue} />",
                            render: <Input.Date value={value} onValueChange={setValue} ariaLabel="Start date" showAnatomy />,
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
            const [value, setValue] = useState<DateValue | null>(null)
            return (
                <BlockAnatomy
                    name="Input.Date"
                    tier="atom"
                    leaf="Props `label` + `hint`"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "label and hint set",
                            why: "A `Label` node grows above the control and a muted `Description` line grows below it. Both exist so the field reads on its own, without a caller having to place a separate caption nearby.",
                            code: "<Input.Date label=\"Start date\" hint=\"Format: dd/mm/yyyy\" value={value} onValueChange={setValue} />",
                            render: <Input.Date label="Start date" hint="Format: dd/mm/yyyy" value={value} onValueChange={setValue} showAnatomy />,
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
            const [value, setValue] = useState<DateValue | null>(null)
            return (
                <BlockAnatomy
                    name="Input.Date"
                    tier="atom"
                    leaf="Prop `isRequired`"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "isRequired = true",
                            why: "A `*` mark is appended right after the label text — no separate node, no extra colour. It exists purely so the reader can scan a form and see which fields are mandatory without opening each one.",
                            code: "<Input.Date label=\"Start date\" isRequired value={value} onValueChange={setValue} />",
                            render: <Input.Date label="Start date" isRequired value={value} onValueChange={setValue} showAnatomy />,
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `value` filled — ngày thật (`parseDate`) thay vì `null`. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<DateValue | null>(parseDate("2026-07-25"))
            return (
                <BlockAnatomy
                    name="Input.Date"
                    tier="atom"
                    leaf="Prop `value` (filled)"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "value = a real DateValue (not null)",
                            why: "The date segments print the picked day/month/year instead of standing empty. Nothing else in the tree changes — this only proves the control reads a real controlled value the same way it reads `null`.",
                            code: "<Input.Date label=\"Start date\" value={parseDate(\"2026-07-25\")} onValueChange={setValue} />",
                            render: <Input.Date label="Start date" value={value} onValueChange={setValue} showAnatomy />,
                        },
                    ]}
                />
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Leaf prop `isDisabled` — khoá segments + trigger lịch, nhãn nhạt. */
export const Disabled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<DateValue | null>(parseDate("2026-07-25"))
            return (
                <BlockAnatomy
                    name="Input.Date"
                    tier="atom"
                    leaf="Prop `isDisabled`"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "isDisabled = true",
                            why: "The date segments and the calendar trigger both lock against input and the label dims. This is the resting state for a date the caller already decided is fixed for now, so the reader is not tempted to try editing it.",
                            code: "<Input.Date label=\"Start date\" value={parseDate(\"2026-07-25\")} onValueChange={setValue} isDisabled />",
                            render: <Input.Date label="Start date" value={value} onValueChange={setValue} isDisabled showAnatomy />,
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
            const [value, setValue] = useState<DateValue | null>(null)
            return (
                <BlockAnatomy
                    name="Input.Date"
                    tier="atom"
                    leaf="Prop `errorMessage`"
                    renderClassName="w-72"
                    states={[
                        {
                            name: "errorMessage set",
                            why: "An `Error` line grows below the control in the danger colour and the control border switches to its invalid state. Both changes fire together off the same prop, so a caller can never show one without the other.",
                            code: "<Input.Date label=\"Start date\" errorMessage=\"Please choose a date\" value={value} onValueChange={setValue} />",
                            render: <Input.Date label="Start date" errorMessage="Please choose a date" value={value} onValueChange={setValue} showAnatomy />,
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
                name="Input.Date"
                tier="atom"
                leaf="Prop `isSkeleton`"
                renderClassName="w-72"
                states={[
                    {
                        name: "isSkeleton = true, label set",
                        why: "The label still renders as real text, but the control area collapses into a shimmer box — no segments, no calendar trigger. The label stays real so the reader keeps their place in the form while the value itself is still loading.",
                        code: "<Input.Date label=\"Start date\" isSkeleton />",
                        render: <Input.Date label="Start date" value={null} onValueChange={() => {}} isSkeleton showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}
