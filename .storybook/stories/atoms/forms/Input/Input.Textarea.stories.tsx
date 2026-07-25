import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/Input.Textarea", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

// FieldFrame parts (§11a) — atom TỰ mang nhãn/mô tả/lỗi, không tách Field primitive.
const FIELD: AnatomyNode = { name: "Field", tier: "atom", role: "ô nhập nhiều dòng (HeroUI TextArea)" }
const LABEL: AnatomyNode = { name: "Label", tier: "atom", role: "nhãn field (HeroUI Label)" }
const DESC: AnatomyNode = { name: "Description", tier: "atom", role: "mô tả dưới nhãn (text-muted)" }
const ERROR: AnatomyNode = { name: "Error", tier: "atom", role: "dòng lỗi (text-danger)" }
const SKELETON: AnatomyNode = { name: "Skeleton", tier: "atom", role: "field-box skeleton cao (hybrid C)" }

/** Default — ô TRẦN nhiều dòng (rows=3), không nhãn. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy name="Input.Textarea" tier="atom" leaf="Default" parts={[FIELD]} note="trần — không label/hint/error." code={"<Input.Textarea value={v} onValueChange={setV} rows={3} placeholder=\"Ghi chú…\" />"}>
                    <div className="w-72"><Input.Textarea value={value} onValueChange={setValue} rows={3} placeholder="Ghi chú bài học…" ariaLabel="Ghi chú" showAnatomy /></div>
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
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy name="Input.Textarea" tier="atom" leaf="WithLabel" parts={[LABEL, DESC, FIELD]} note="label + hint." code={"<Input.Textarea label=\"Ghi chú\" hint=\"Riêng bạn thấy\" value={v} onValueChange={setV} rows={3} />"}>
                    <div className="w-72"><Input.Textarea label="Ghi chú" hint="Chỉ riêng bạn thấy" value={value} onValueChange={setValue} rows={3} placeholder="Ghi chú bài học…" showAnatomy /></div>
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
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy name="Input.Textarea" tier="atom" leaf="Required" parts={[LABEL, FIELD]} note="isRequired → dấu * sau nhãn." code={"<Input.Textarea label=\"Ghi chú\" isRequired value={v} onValueChange={setV} rows={3} />"}>
                    <div className="w-72"><Input.Textarea label="Ghi chú" isRequired value={value} onValueChange={setValue} rows={3} placeholder="Ghi chú bài học…" showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Filled — có nội dung nhiều dòng + nhãn. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("Buổi này ôn lại vòng lặp và mảng; nhớ làm bài tập cuối chương.")
            return (
                <BlockAnatomy name="Input.Textarea" tier="atom" leaf="Filled" parts={[LABEL, FIELD]} note="value có nội dung nhiều dòng." code={"<Input.Textarea label=\"Ghi chú\" value=\"Buổi này ôn lại…\" onValueChange={setV} rows={3} />"}>
                    <div className="w-72"><Input.Textarea label="Ghi chú" value={value} onValueChange={setValue} rows={3} showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Disabled — khoá control + nhãn nhạt. */
export const Disabled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("Buổi này ôn lại vòng lặp và mảng.")
            return (
                <BlockAnatomy name="Input.Textarea" tier="atom" leaf="Disabled" parts={[LABEL, FIELD]} note="isDisabled → khoá + nhạt." code={"<Input.Textarea label=\"Ghi chú\" value=\"Buổi này…\" isDisabled onValueChange={setV} rows={3} />"}>
                    <div className="w-72"><Input.Textarea label="Ghi chú" value={value} onValueChange={setValue} rows={3} isDisabled showAnatomy /></div>
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
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy name="Input.Textarea" tier="atom" leaf="Error" parts={[LABEL, FIELD, ERROR]} note="label + errorMessage → nhãn + dòng đỏ + viền." code={"<Input.Textarea label=\"Ghi chú\" errorMessage=\"Ghi chú không được để trống\" value={v} onValueChange={setV} rows={3} />"}>
                    <div className="w-72"><Input.Textarea label="Ghi chú" errorMessage="Ghi chú không được để trống" value={value} onValueChange={setValue} rows={3} placeholder="Ghi chú bài học…" showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Loading — nhãn skeleton (mirror) trên field-box skeleton cao. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="Input.Textarea" tier="atom" leaf="Loading" parts={[LABEL, SKELETON]} note="isSkeleton + label → mirror nhãn trên hộp cao." code={"<Input.Textarea label=\"Ghi chú\" isSkeleton />"}>
                <div className="w-72"><Input.Textarea label="Ghi chú" value="" onValueChange={() => {}} isSkeleton showAnatomy /></div>
            </BlockAnatomy>
        </div>
    ),
}
