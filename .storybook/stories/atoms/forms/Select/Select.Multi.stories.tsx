import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Select } from "@sb-components/atoms/forms/Select/Select"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Select/Select.Multi", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

const TRIGGER: AnatomyNode = { name: "Trigger", tier: "atom", role: "nút mở dropdown (HeroUI Select.Trigger)" }
const FIELD: AnatomyNode = { name: "Field", tier: "atom", role: "tóm tắt số/nhãn đã chọn" }
const LABEL: AnatomyNode = { name: "Label", tier: "atom", role: "nhãn trên control (FieldFrame)" }
const DESC: AnatomyNode = { name: "Description", tier: "atom", role: "mô tả dưới nhãn (FieldFrame)" }
const ERROR: AnatomyNode = { name: "Error", tier: "atom", role: "dòng lỗi dưới control (FieldFrame)" }
const SKELETON: AnatomyNode = { name: "Skeleton", tier: "atom", role: "trigger-box skeleton (hybrid C)" }

const OPTIONS = [
    { value: "js", label: "JavaScript" },
    { value: "ts", label: "TypeScript" },
    { value: "go", label: "Go" },
    { value: "rs", label: "Rust" },
]

/** Default — TRẦN (không label): chưa chọn gì, hiện placeholder. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<Array<string>>([])
            return (
                <BlockAnatomy name="Select.Multi" tier="atom" leaf="Default" parts={[TRIGGER, FIELD]} code={"<Select.Multi value={v} onValueChange={setV} options={OPTIONS} placeholder=\"Chọn ngôn ngữ\" />"}>
                    <div className="w-72"><Select.Multi value={value} onValueChange={setValue} options={OPTIONS} placeholder="Chọn ngôn ngữ" ariaLabel="Ngôn ngữ" showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** WithLabel — nhãn + mô tả (FieldFrame Label/Description). */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<Array<string>>([])
            return (
                <BlockAnatomy name="Select.Multi" tier="atom" leaf="WithLabel" parts={[LABEL, DESC, TRIGGER, FIELD]} code={"<Select.Multi label=\"Ngôn ngữ\" hint=\"Chọn tất cả ngôn ngữ bạn dùng.\" ... />"}>
                    <div className="w-72"><Select.Multi value={value} onValueChange={setValue} options={OPTIONS} placeholder="Chọn ngôn ngữ" label="Ngôn ngữ" hint="Chọn tất cả ngôn ngữ bạn dùng." showAnatomy /></div>
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
            const [value, setValue] = useState<Array<string>>([])
            return (
                <BlockAnatomy name="Select.Multi" tier="atom" leaf="Required" parts={[LABEL, TRIGGER, FIELD]} code={"<Select.Multi label=\"Ngôn ngữ\" isRequired ... />"} note="isRequired → dấu * sau nhãn.">
                    <div className="w-72"><Select.Multi value={value} onValueChange={setValue} options={OPTIONS} placeholder="Chọn ngôn ngữ" label="Ngôn ngữ" isRequired showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/**
 * Labeled — có nhãn, không mô tả. Ba STATE nằm CHUNG một leaf (§14d.2: cùng cây DOM,
 * chỉ khác nội dung ⇒ state, không tách story): chưa chọn · đã chọn (≥2 → "Đã chọn n") ·
 * khoá.
 */
export const Labeled: Story = {
    render: () => {
        const Demo = () => {
            const [empty, setEmpty] = useState<Array<string>>([])
            const [filled, setFilled] = useState<Array<string>>(["ts", "go"])
            return (
                <BlockAnatomy name="Select.Multi" tier="atom" leaf="Labeled" parts={[LABEL, TRIGGER, FIELD]} code={"<Select.Multi label=\"Ngôn ngữ\" value={v} onValueChange={setV} options={OPTIONS} />"} note="Ba state cùng cấu trúc: chưa chọn · đã chọn (≥2 → 'Đã chọn n') · isDisabled.">
                    <div className="flex flex-col gap-4">
                        <div className="w-72"><Select.Multi value={empty} onValueChange={setEmpty} options={OPTIONS} placeholder="Chọn ngôn ngữ" label="Ngôn ngữ" showAnatomy /></div>
                        <div className="w-72"><Select.Multi value={filled} onValueChange={setFilled} options={OPTIONS} placeholder="Chọn ngôn ngữ" label="Ngôn ngữ" /></div>
                        <div className="w-72"><Select.Multi value={["js"]} onValueChange={() => {}} options={OPTIONS} placeholder="Chọn ngôn ngữ" label="Ngôn ngữ" isDisabled /></div>
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Error — nhãn + dòng lỗi đỏ + viền lỗi (errorMessage bật cả message lẫn viền). */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<Array<string>>([])
            return (
                <BlockAnatomy name="Select.Multi" tier="atom" leaf="Error" parts={[LABEL, TRIGGER, FIELD, ERROR]} code={"<Select.Multi label=\"Ngôn ngữ\" errorMessage=\"Chọn ít nhất một ngôn ngữ.\" ... />"} note="errorMessage → NHÃN + dòng đỏ + viền.">
                    <div className="w-72"><Select.Multi value={value} onValueChange={setValue} options={OPTIONS} placeholder="Chọn ngôn ngữ" label="Ngôn ngữ" errorMessage="Chọn ít nhất một ngôn ngữ." showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Loading — nhãn skeleton trên trigger-box skeleton (mirror đúng cột). */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="Select.Multi" tier="atom" leaf="Loading" parts={[LABEL, SKELETON]} code={"<Select.Multi label=\"Ngôn ngữ\" isSkeleton />"} note="isSkeleton → label-skeleton + trigger-box skeleton.">
                <div className="w-72"><Select.Multi value={[]} onValueChange={() => {}} options={OPTIONS} label="Ngôn ngữ" isSkeleton showAnatomy /></div>
            </BlockAnatomy>
        </div>
    ),
}
