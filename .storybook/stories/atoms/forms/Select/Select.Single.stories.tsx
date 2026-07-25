import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Select } from "@sb-components/atoms/forms/Select/Select"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Select/Select.Single", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

const TRIGGER: AnatomyNode = { name: "Trigger", tier: "atom", role: "nút mở dropdown (HeroUI Select.Trigger)" }
const FIELD: AnatomyNode = { name: "Field", tier: "atom", role: "vùng hiện value/placeholder (Select.Value)" }
const LABEL: AnatomyNode = { name: "Label", tier: "atom", role: "nhãn trên control (FieldFrame)" }
const DESC: AnatomyNode = { name: "Description", tier: "atom", role: "mô tả dưới nhãn (FieldFrame)" }
const ERROR: AnatomyNode = { name: "Error", tier: "atom", role: "dòng lỗi dưới control (FieldFrame)" }
const SKELETON: AnatomyNode = { name: "Skeleton", tier: "atom", role: "trigger-box skeleton (hybrid C)" }

const OPTIONS = [
    { value: "fs", label: "Fullstack Mastery" },
    { value: "sd", label: "System Design Mastery" },
    { value: "do", label: "DevOps Mastery" },
]

/** Default — TRẦN (không label): value rỗng, hiện placeholder. FieldFrame render thẳng trigger. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string | null>(null)
            return (
                <BlockAnatomy name="Select.Single" tier="atom" leaf="Default" parts={[TRIGGER, FIELD]} code={"<Select.Single value={v} onValueChange={setV} options={OPTIONS} placeholder=\"Chọn khoá học\" />"}>
                    <div className="w-72"><Select.Single value={value} onValueChange={setValue} options={OPTIONS} placeholder="Chọn khoá học" ariaLabel="Khoá học" showAnatomy /></div>
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
            const [value, setValue] = useState<string | null>(null)
            return (
                <BlockAnatomy name="Select.Single" tier="atom" leaf="WithLabel" parts={[LABEL, DESC, TRIGGER, FIELD]} code={"<Select.Single label=\"Khoá học\" hint=\"Chọn lộ trình bạn muốn theo.\" ... />"}>
                    <div className="w-72"><Select.Single value={value} onValueChange={setValue} options={OPTIONS} placeholder="Chọn khoá học" label="Khoá học" hint="Chọn lộ trình bạn muốn theo." showAnatomy /></div>
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
            const [value, setValue] = useState<string | null>(null)
            return (
                <BlockAnatomy name="Select.Single" tier="atom" leaf="Required" parts={[LABEL, TRIGGER, FIELD]} code={"<Select.Single label=\"Khoá học\" isRequired ... />"} note="isRequired → dấu * sau nhãn.">
                    <div className="w-72"><Select.Single value={value} onValueChange={setValue} options={OPTIONS} placeholder="Chọn khoá học" label="Khoá học" isRequired showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/**
 * Labeled — có nhãn, không mô tả. Ba STATE nằm CHUNG một leaf (§14d.2: cùng cây DOM,
 * chỉ khác nội dung ⇒ state, không tách story): chưa chọn · đã chọn · khoá.
 */
export const Labeled: Story = {
    render: () => {
        const Demo = () => {
            const [empty, setEmpty] = useState<string | null>(null)
            const [filled, setFilled] = useState<string | null>("sd")
            return (
                <BlockAnatomy name="Select.Single" tier="atom" leaf="Labeled" parts={[LABEL, TRIGGER, FIELD]} code={"<Select.Single label=\"Khoá học\" value={v} onValueChange={setV} options={OPTIONS} />"} note="Ba state cùng cấu trúc: chưa chọn · đã chọn · isDisabled.">
                    <div className="flex flex-col gap-4">
                        <div className="w-72"><Select.Single value={empty} onValueChange={setEmpty} options={OPTIONS} placeholder="Chọn khoá học" label="Khoá học" showAnatomy /></div>
                        <div className="w-72"><Select.Single value={filled} onValueChange={setFilled} options={OPTIONS} placeholder="Chọn khoá học" label="Khoá học" /></div>
                        <div className="w-72"><Select.Single value="fs" onValueChange={() => {}} options={OPTIONS} placeholder="Chọn khoá học" label="Khoá học" isDisabled /></div>
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
            const [value, setValue] = useState<string | null>(null)
            return (
                <BlockAnatomy name="Select.Single" tier="atom" leaf="Error" parts={[LABEL, TRIGGER, FIELD, ERROR]} code={"<Select.Single label=\"Khoá học\" errorMessage=\"Vui lòng chọn một khoá.\" ... />"} note="errorMessage → NHÃN + dòng đỏ + viền.">
                    <div className="w-72"><Select.Single value={value} onValueChange={setValue} options={OPTIONS} placeholder="Chọn khoá học" label="Khoá học" errorMessage="Vui lòng chọn một khoá." showAnatomy /></div>
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
            <BlockAnatomy name="Select.Single" tier="atom" leaf="Loading" parts={[LABEL, SKELETON]} code={"<Select.Single label=\"Khoá học\" isSkeleton />"} note="isSkeleton → label-skeleton + trigger-box skeleton.">
                <div className="w-72"><Select.Single value={null} onValueChange={() => {}} options={OPTIONS} label="Khoá học" isSkeleton showAnatomy /></div>
            </BlockAnatomy>
        </div>
    ),
}
