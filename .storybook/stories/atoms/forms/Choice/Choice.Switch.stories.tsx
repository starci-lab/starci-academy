import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Choice } from "@sb-components/atoms/forms/Choice/Choice"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Choice/Choice.Switch", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

const CONTROL: AnatomyNode = { name: "Control", tier: "atom", role: "track + thumb (HeroUI Switch compound)" }
const LABEL: AnatomyNode = { name: "Label", tier: "atom", role: "nhãn cạnh track (sibling Label)" }
const DESCRIPTION: AnatomyNode = { name: "Description", tier: "atom", role: "hint qua FieldFrame" }
const ERROR: AnatomyNode = { name: "Error", tier: "atom", role: "dòng lỗi qua FieldFrame (text-danger)" }
const SKELETON_PARTS: Array<AnatomyNode> = [{ name: "Skeleton", tier: "atom", role: "control-shaped skeleton (track pill + nhãn bar)" }]
const PARTS: Array<AnatomyNode> = [CONTROL, LABEL]

/** Default — tắt, nhãn cạnh track. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy name="Choice.Switch" tier="atom" leaf="Default" parts={PARTS} code={`<Choice.Switch isSelected={v} onValueChange={setV} label="Chế độ tối" />`}>
                    <div className="w-72"><Choice.Switch isSelected={value} onValueChange={setValue} label="Chế độ tối" showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Selected — bật. */
export const Selected: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(true)
            return (
                <BlockAnatomy name="Choice.Switch" tier="atom" leaf="Selected" parts={PARTS} note="isSelected → bật." code={`<Choice.Switch isSelected onValueChange={setV} label="…" />`}>
                    <div className="w-72"><Choice.Switch isSelected={value} onValueChange={setValue} label="Chế độ tối" showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** WithHint — nhãn inline + dòng mô tả phụ (hint qua FieldFrame). */
export const WithHint: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(true)
            return (
                <BlockAnatomy name="Choice.Switch" tier="atom" leaf="WithHint" parts={[CONTROL, LABEL, DESCRIPTION]} note="hint → FieldFrame." code={`<Choice.Switch … hint="Giảm mỏi mắt về đêm." />`}>
                    <div className="w-72"><Choice.Switch isSelected={value} onValueChange={setValue} label="Chế độ tối" hint="Giảm mỏi mắt khi dùng vào ban đêm." showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Required — nhãn inline kèm dấu `*` (isRequired). */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy name="Choice.Switch" tier="atom" leaf="Required" parts={PARTS} note="isRequired → dấu * cạnh nhãn inline." code={`<Choice.Switch … isRequired label="Bật xác thực 2 lớp" />`}>
                    <div className="w-72"><Choice.Switch isSelected={value} onValueChange={setValue} label="Bật xác thực 2 lớp" isRequired showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Disabled — khoá track. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="Choice.Switch" tier="atom" leaf="Disabled" parts={PARTS} note="isDisabled → khoá + nhạt." code={`<Choice.Switch isDisabled isSelected onValueChange={setV} label="…" />`}>
                <div className="w-72"><Choice.Switch isSelected onValueChange={() => {}} label="Tự động lưu" isDisabled showAnatomy /></div>
            </BlockAnatomy>
        </div>
    ),
}

/** Error — nhãn inline + track viền lỗi + dòng lỗi đỏ (errorMessage qua FieldFrame). */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy name="Choice.Switch" tier="atom" leaf="Error" parts={[CONTROL, LABEL, ERROR]} note="errorMessage → viền lỗi + dòng đỏ." code={`<Choice.Switch … errorMessage="Cần bật để nhận cảnh báo." />`}>
                    <div className="w-72"><Choice.Switch isSelected={value} onValueChange={setValue} label="Cảnh báo bảo mật" errorMessage="Cần bật để nhận cảnh báo bảo mật." showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Loading — control-shaped skeleton (track pill + nhãn bar). */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="Choice.Switch" tier="atom" leaf="Loading" parts={SKELETON_PARTS} code={`<Choice.Switch isSkeleton label="…" />`}>
                <div className="w-72"><Choice.Switch isSelected={false} onValueChange={() => {}} label="Chế độ tối" isSkeleton showAnatomy /></div>
            </BlockAnatomy>
        </div>
    ),
}
