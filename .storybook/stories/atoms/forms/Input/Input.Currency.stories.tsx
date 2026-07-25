import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/Input.Currency", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

// FieldFrame parts (§11a) — atom TỰ mang nhãn/mô tả/lỗi, không tách Field primitive.
const FIELD: AnatomyNode = { name: "Field", tier: "atom", role: "ô tiền: số + stepper, tự format ₫ (HeroUI NumberField)" }
const LABEL: AnatomyNode = { name: "Label", tier: "atom", role: "nhãn field (HeroUI Label)" }
const DESC: AnatomyNode = { name: "Description", tier: "atom", role: "mô tả dưới nhãn (text-muted)" }
const ERROR: AnatomyNode = { name: "Error", tier: "atom", role: "dòng lỗi (text-danger)" }
const SKELETON: AnatomyNode = { name: "Skeleton", tier: "atom", role: "field-box skeleton (hybrid C)" }

/** Default — ô TRẦN số tiền 0, atom tự render ký hiệu tiền tệ + phân nhóm. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(0)
            return (
                <BlockAnatomy name="Input.Currency" tier="atom" leaf="Default" parts={[FIELD]} note="trần — không label/hint/error." code={`<Input.Currency value={v} onValueChange={setV} currency="VND" />`}>
                    <div className="w-72"><Input.Currency value={value} onValueChange={setValue} ariaLabel="Số tiền" showAnatomy /></div>
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
            const [value, setValue] = useState(0)
            return (
                <BlockAnatomy name="Input.Currency" tier="atom" leaf="WithLabel" parts={[LABEL, DESC, FIELD]} note="label + hint." code={`<Input.Currency label="Học phí" hint="Đơn vị VND" value={v} onValueChange={setV} />`}>
                    <div className="w-72"><Input.Currency label="Học phí" hint="Đơn vị VND" value={value} onValueChange={setValue} showAnatomy /></div>
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
            const [value, setValue] = useState(0)
            return (
                <BlockAnatomy name="Input.Currency" tier="atom" leaf="Required" parts={[LABEL, FIELD]} note="isRequired → dấu * sau nhãn." code={`<Input.Currency label="Học phí" isRequired value={v} onValueChange={setV} />`}>
                    <div className="w-72"><Input.Currency label="Học phí" isRequired value={value} onValueChange={setValue} showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Filled — có giá trị, hiển thị định dạng tiền tệ VND + nhãn. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(1500000)
            return (
                <BlockAnatomy name="Input.Currency" tier="atom" leaf="Filled" parts={[LABEL, FIELD]} note="value có dữ liệu → format ₫." code={`<Input.Currency label="Học phí" value={1500000} onValueChange={setV} currency="VND" />`}>
                    <div className="w-72"><Input.Currency label="Học phí" value={value} onValueChange={setValue} showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Disabled — khoá stepper + input + nhãn nhạt. */
export const Disabled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(1500000)
            return (
                <BlockAnatomy name="Input.Currency" tier="atom" leaf="Disabled" parts={[LABEL, FIELD]} note="isDisabled → khoá stepper + input." code={`<Input.Currency label="Học phí" value={1500000} onValueChange={setV} isDisabled />`}>
                    <div className="w-72"><Input.Currency label="Học phí" value={value} onValueChange={setValue} isDisabled showAnatomy /></div>
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
            const [value, setValue] = useState(0)
            return (
                <BlockAnatomy name="Input.Currency" tier="atom" leaf="Error" parts={[LABEL, FIELD, ERROR]} note="label + errorMessage → nhãn + dòng đỏ + viền." code={`<Input.Currency label="Học phí" errorMessage="Học phí phải lớn hơn 0" value={0} onValueChange={setV} />`}>
                    <div className="w-72"><Input.Currency label="Học phí" errorMessage="Học phí phải lớn hơn 0" value={value} onValueChange={setValue} showAnatomy /></div>
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
            <BlockAnatomy name="Input.Currency" tier="atom" leaf="Loading" parts={[LABEL, SKELETON]} note="isSkeleton + label → mirror nhãn trên hộp." code={`<Input.Currency label="Học phí" isSkeleton />`}>
                <div className="w-72"><Input.Currency label="Học phí" value={0} onValueChange={() => {}} isSkeleton showAnatomy /></div>
            </BlockAnatomy>
        </div>
    ),
}
