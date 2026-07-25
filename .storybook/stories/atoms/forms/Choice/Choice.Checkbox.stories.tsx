import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Choice } from "@sb-components/atoms/forms/Choice/Choice"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Choice/Choice.Checkbox", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

const CONTROL: AnatomyNode = { name: "Control", tier: "atom", role: "ô tick (HeroUI Checkbox.Control + Indicator)" }
const LABEL: AnatomyNode = { name: "Label", tier: "atom", role: "nhãn cạnh ô (Checkbox.Content)" }
const DESCRIPTION: AnatomyNode = { name: "Description", tier: "atom", role: "hint qua FieldFrame" }
const ERROR: AnatomyNode = { name: "Error", tier: "atom", role: "dòng lỗi qua FieldFrame (text-danger)" }
const SKELETON_PARTS: Array<AnatomyNode> = [{ name: "Skeleton", tier: "atom", role: "control-shaped skeleton (ô + nhãn bar)" }]
const PARTS: Array<AnatomyNode> = [CONTROL, LABEL]

/** Default — bỏ tick, nhãn cạnh ô (chưa có hint/lỗi). */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy name="Choice.Checkbox" tier="atom" leaf="Default" parts={PARTS} code={`<Choice.Checkbox isSelected={v} onValueChange={setV} label="Nhận email" />`}>
                    <div className="w-72"><Choice.Checkbox isSelected={value} onValueChange={setValue} label="Nhận email thông báo" showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Checked — đã tick. */
export const Checked: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(true)
            return (
                <BlockAnatomy name="Choice.Checkbox" tier="atom" leaf="Checked" parts={PARTS} note="isSelected → ô tick." code={`<Choice.Checkbox isSelected onValueChange={setV} label="…" />`}>
                    <div className="w-72"><Choice.Checkbox isSelected={value} onValueChange={setValue} label="Nhận email thông báo" showAnatomy /></div>
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
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy name="Choice.Checkbox" tier="atom" leaf="WithHint" parts={[CONTROL, LABEL, DESCRIPTION]} note="hint → FieldFrame." code={`<Choice.Checkbox … hint="Có thể tắt bất cứ lúc nào." />`}>
                    <div className="w-72"><Choice.Checkbox isSelected={value} onValueChange={setValue} label="Nhận email thông báo" hint="Có thể tắt bất cứ lúc nào trong Cài đặt." showAnatomy /></div>
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
                <BlockAnatomy name="Choice.Checkbox" tier="atom" leaf="Required" parts={PARTS} note="isRequired → dấu * cạnh nhãn inline." code={`<Choice.Checkbox … isRequired label="Đồng ý điều khoản" />`}>
                    <div className="w-72"><Choice.Checkbox isSelected={value} onValueChange={setValue} label="Đồng ý điều khoản" isRequired showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Disabled — khoá control. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="Choice.Checkbox" tier="atom" leaf="Disabled" parts={PARTS} note="isDisabled → khoá + nhạt." code={`<Choice.Checkbox isDisabled isSelected onValueChange={setV} label="…" />`}>
                <div className="w-72"><Choice.Checkbox isSelected onValueChange={() => {}} label="Đồng ý điều khoản" isDisabled showAnatomy /></div>
            </BlockAnatomy>
        </div>
    ),
}

/** Error — nhãn inline + viền lỗi + dòng lỗi đỏ (errorMessage qua FieldFrame). */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState(false)
            return (
                <BlockAnatomy name="Choice.Checkbox" tier="atom" leaf="Error" parts={[CONTROL, LABEL, ERROR]} note="errorMessage → viền lỗi + dòng đỏ." code={`<Choice.Checkbox … errorMessage="Bạn phải đồng ý để tiếp tục." />`}>
                    <div className="w-72"><Choice.Checkbox isSelected={value} onValueChange={setValue} label="Đồng ý điều khoản" errorMessage="Bạn phải đồng ý để tiếp tục." showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Loading — control-shaped skeleton (ô + nhãn bar). */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="Choice.Checkbox" tier="atom" leaf="Loading" parts={SKELETON_PARTS} code={`<Choice.Checkbox isSkeleton />`}>
                <div className="w-72"><Choice.Checkbox isSelected={false} onValueChange={() => {}} label="" isSkeleton showAnatomy /></div>
            </BlockAnatomy>
        </div>
    ),
}
