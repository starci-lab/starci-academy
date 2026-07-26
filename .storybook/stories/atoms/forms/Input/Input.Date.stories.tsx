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
                    note="Bare — no label, hint, or error."
                    code={"<Input.Date value={value} onValueChange={setValue} />"}
                >
                    <div className="w-72">
                        <Input.Date value={value} onValueChange={setValue} ariaLabel="Start date" showAnatomy />
                    </div>
                </BlockAnatomy>
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
                    note="Label plus hint."
                    code={"<Input.Date label=\"Start date\" hint=\"Format: dd/mm/yyyy\" value={value} onValueChange={setValue} />"}
                >
                    <div className="w-72">
                        <Input.Date label="Start date" hint="Format: dd/mm/yyyy" value={value} onValueChange={setValue} showAnatomy />
                    </div>
                </BlockAnatomy>
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
                    note="isRequired adds a * after the label."
                    code={"<Input.Date label=\"Start date\" isRequired value={value} onValueChange={setValue} />"}
                >
                    <div className="w-72">
                        <Input.Date label="Start date" isRequired value={value} onValueChange={setValue} showAnatomy />
                    </div>
                </BlockAnatomy>
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
                    note="value holds a real DateValue."
                    code={"<Input.Date label=\"Start date\" value={parseDate(\"2026-07-25\")} onValueChange={setValue} />"}
                >
                    <div className="w-72">
                        <Input.Date label="Start date" value={value} onValueChange={setValue} showAnatomy />
                    </div>
                </BlockAnatomy>
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
                    note="isDisabled locks the segments and the calendar trigger."
                    code={"<Input.Date label=\"Start date\" value={parseDate(\"2026-07-25\")} onValueChange={setValue} isDisabled />"}
                >
                    <div className="w-72">
                        <Input.Date label="Start date" value={value} onValueChange={setValue} isDisabled showAnatomy />
                    </div>
                </BlockAnatomy>
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
                    note="label plus errorMessage adds the red line and the invalid border."
                    code={"<Input.Date label=\"Start date\" errorMessage=\"Please choose a date\" value={value} onValueChange={setValue} />"}
                >
                    <div className="w-72">
                        <Input.Date label="Start date" errorMessage="Please choose a date" value={value} onValueChange={setValue} showAnatomy />
                    </div>
                </BlockAnatomy>
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
                note="isSkeleton with a label mirrors the label above the shimmer box."
                code={"<Input.Date label=\"Start date\" isSkeleton />"}
            >
                <div className="w-72">
                    <Input.Date label="Start date" value={null} onValueChange={() => {}} isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
