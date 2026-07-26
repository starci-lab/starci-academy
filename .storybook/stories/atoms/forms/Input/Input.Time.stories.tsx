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
                    note="Bare — no label, hint, or error."
                    code={"<Input.Time value={value} onValueChange={setValue} />"}
                >
                    <div className="w-72">
                        <Input.Time value={value} onValueChange={setValue} ariaLabel="Start time" showAnatomy />
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
            const [value, setValue] = useState<TimeValue | null>(null)
            return (
                <BlockAnatomy
                    name="Input.Time"
                    tier="atom"
                    leaf="Props `label` + `hint`"
                    note="Label plus hint."
                    code={"<Input.Time label=\"Start time\" hint=\"Vietnam time (GMT+7)\" value={value} onValueChange={setValue} />"}
                >
                    <div className="w-72">
                        <Input.Time label="Start time" hint="Vietnam time (GMT+7)" value={value} onValueChange={setValue} showAnatomy />
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
            const [value, setValue] = useState<TimeValue | null>(null)
            return (
                <BlockAnatomy
                    name="Input.Time"
                    tier="atom"
                    leaf="Prop `isRequired`"
                    note="isRequired adds a * after the label."
                    code={"<Input.Time label=\"Start time\" isRequired value={value} onValueChange={setValue} />"}
                >
                    <div className="w-72">
                        <Input.Time label="Start time" isRequired value={value} onValueChange={setValue} showAnatomy />
                    </div>
                </BlockAnatomy>
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
                    note="value holds a real TimeValue."
                    code={"<Input.Time label=\"Start time\" value={new Time(9, 30)} onValueChange={setValue} />"}
                >
                    <div className="w-72">
                        <Input.Time label="Start time" value={value} onValueChange={setValue} showAnatomy />
                    </div>
                </BlockAnatomy>
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
                    note="isDisabled locks the hour and minute segments."
                    code={"<Input.Time label=\"Start time\" value={new Time(9, 30)} onValueChange={setValue} isDisabled />"}
                >
                    <div className="w-72">
                        <Input.Time label="Start time" value={value} onValueChange={setValue} isDisabled showAnatomy />
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
            const [value, setValue] = useState<TimeValue | null>(null)
            return (
                <BlockAnatomy
                    name="Input.Time"
                    tier="atom"
                    leaf="Prop `errorMessage`"
                    note="label plus errorMessage adds the red line and the invalid border."
                    code={"<Input.Time label=\"Start time\" errorMessage=\"Please choose a time\" value={value} onValueChange={setValue} />"}
                >
                    <div className="w-72">
                        <Input.Time label="Start time" errorMessage="Please choose a time" value={value} onValueChange={setValue} showAnatomy />
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
                name="Input.Time"
                tier="atom"
                leaf="Prop `isSkeleton`"
                note="isSkeleton with a label mirrors the label above the shimmer box."
                code={"<Input.Time label=\"Start time\" isSkeleton />"}
            >
                <div className="w-72">
                    <Input.Time label="Start time" value={null} onValueChange={() => {}} isSkeleton showAnatomy />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
