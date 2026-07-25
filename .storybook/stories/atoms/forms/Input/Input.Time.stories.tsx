import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Time } from "@internationalized/date"
import type { TimeValue } from "react-aria-components"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/Input.Time", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

// FieldFrame parts (§11a) — atom TỰ mang nhãn/mô tả/lỗi, không tách Field primitive.
const FIELD: AnatomyNode = { name: "Field", tier: "atom", role: "ô giờ: segments giờ/phút (HeroUI TimeField)" }
const LABEL: AnatomyNode = { name: "Label", tier: "atom", role: "nhãn field (HeroUI Label)" }
const DESC: AnatomyNode = { name: "Description", tier: "atom", role: "mô tả dưới nhãn (text-muted)" }
const ERROR: AnatomyNode = { name: "Error", tier: "atom", role: "dòng lỗi (text-danger)" }
const SKELETON: AnatomyNode = { name: "Skeleton", tier: "atom", role: "field-box skeleton (hybrid C)" }

/** Default — ô TRẦN segments giờ:phút, chưa chọn. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<TimeValue | null>(null)
            return (
                <BlockAnatomy name="Input.Time" tier="atom" leaf="Default" parts={[FIELD]} note="trần — không label/hint/error." code={`<Input.Time value={v} onValueChange={setV} />`}>
                    <div className="w-72"><Input.Time value={value} onValueChange={setValue} ariaLabel="Giờ bắt đầu" showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** WithLabel — nhãn trên + mô tả (hint) dưới nhãn. */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<TimeValue | null>(null)
            return (
                <BlockAnatomy name="Input.Time" tier="atom" leaf="WithLabel" parts={[LABEL, DESC, FIELD]} note="label + hint." code={`<Input.Time label="Giờ bắt đầu" hint="Giờ Việt Nam (GMT+7)" value={v} onValueChange={setV} />`}>
                    <div className="w-72"><Input.Time label="Giờ bắt đầu" hint="Giờ Việt Nam (GMT+7)" value={value} onValueChange={setValue} showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Required — nhãn + dấu `*` bắt buộc. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<TimeValue | null>(null)
            return (
                <BlockAnatomy name="Input.Time" tier="atom" leaf="Required" parts={[LABEL, FIELD]} note="isRequired → dấu * sau nhãn." code={`<Input.Time label="Giờ bắt đầu" isRequired value={v} onValueChange={setV} />`}>
                    <div className="w-72"><Input.Time label="Giờ bắt đầu" isRequired value={value} onValueChange={setValue} showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Filled — có giá trị 09:30 (`new Time(9, 30)`) + nhãn. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<TimeValue | null>(new Time(9, 30))
            return (
                <BlockAnatomy name="Input.Time" tier="atom" leaf="Filled" parts={[LABEL, FIELD]} note="value có dữ liệu thật (TimeValue)." code={`<Input.Time label="Giờ bắt đầu" value={new Time(9, 30)} onValueChange={setV} />`}>
                    <div className="w-72"><Input.Time label="Giờ bắt đầu" value={value} onValueChange={setValue} showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Disabled — khoá segments giờ/phút + nhãn nhạt. */
export const Disabled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<TimeValue | null>(new Time(9, 30))
            return (
                <BlockAnatomy name="Input.Time" tier="atom" leaf="Disabled" parts={[LABEL, FIELD]} note="isDisabled → khoá segments giờ/phút." code={`<Input.Time label="Giờ bắt đầu" value={new Time(9, 30)} onValueChange={setV} isDisabled />`}>
                    <div className="w-72"><Input.Time label="Giờ bắt đầu" value={value} onValueChange={setValue} isDisabled showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Error — nhãn + errorMessage → hiện NHÃN + dòng đỏ + viền lỗi. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<TimeValue | null>(null)
            return (
                <BlockAnatomy name="Input.Time" tier="atom" leaf="Error" parts={[LABEL, FIELD, ERROR]} note="label + errorMessage → nhãn + dòng đỏ + viền." code={`<Input.Time label="Giờ bắt đầu" errorMessage="Vui lòng chọn giờ" value={v} onValueChange={setV} />`}>
                    <div className="w-72"><Input.Time label="Giờ bắt đầu" errorMessage="Vui lòng chọn giờ" value={value} onValueChange={setValue} showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Loading — nhãn skeleton (mirror) trên field-box skeleton. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="Input.Time" tier="atom" leaf="Loading" parts={[LABEL, SKELETON]} note="isSkeleton + label → mirror nhãn trên hộp." code={`<Input.Time label="Giờ bắt đầu" isSkeleton />`}>
                <div className="w-72"><Input.Time label="Giờ bắt đầu" value={null} onValueChange={() => {}} isSkeleton showAnatomy /></div>
            </BlockAnatomy>
        </div>
    ),
}
