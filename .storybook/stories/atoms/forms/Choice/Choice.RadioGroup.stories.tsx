import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Choice } from "@sb-components/atoms/forms/Choice/Choice"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Choice/Choice.RadioGroup", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

// Group render một hàng Radio; part Control/Label lặp theo option (badge trên hàng đầu).
const CONTROL: AnatomyNode = { name: "Control", tier: "atom", role: "dot mỗi option (HeroUI Radio.Control + Indicator)" }
const LABEL: AnatomyNode = { name: "Label", tier: "atom", role: "nhãn heading nhóm (FieldFrame) + nhãn cạnh dot" }
const DESCRIPTION: AnatomyNode = { name: "Description", tier: "atom", role: "hint qua FieldFrame" }
const ERROR: AnatomyNode = { name: "Error", tier: "atom", role: "dòng lỗi qua FieldFrame (text-danger)" }
const SKELETON_PARTS: Array<AnatomyNode> = [{ name: "Skeleton", tier: "atom", role: "control-shaped skeleton (stack radio-row)" }]
const PARTS: Array<AnatomyNode> = [CONTROL, LABEL]

const OPTIONS = [
    { value: "beginner", label: "Người mới" },
    { value: "intermediate", label: "Trung cấp" },
    { value: "advanced", label: "Nâng cao" },
]

/** Default — nhóm 3 lựa chọn, chưa chọn cái nào (không heading). */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy name="Choice.RadioGroup" tier="atom" leaf="Default" parts={PARTS} code={`<Choice.RadioGroup value={v} onValueChange={setV} options={OPTIONS} />`}>
                    <div className="w-72"><Choice.RadioGroup value={value} onValueChange={setValue} options={OPTIONS} ariaLabel="Trình độ" showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Selected — đã chọn một option. */
export const Selected: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("intermediate")
            return (
                <BlockAnatomy name="Choice.RadioGroup" tier="atom" leaf="Selected" parts={PARTS} note="value → option được chọn." code={`<Choice.RadioGroup value="intermediate" onValueChange={setV} options={OPTIONS} />`}>
                    <div className="w-72"><Choice.RadioGroup value={value} onValueChange={setValue} options={OPTIONS} ariaLabel="Trình độ" showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** WithLabel — nhãn heading TRÊN nhóm (groupLabel → FieldFrame label). */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy name="Choice.RadioGroup" tier="atom" leaf="WithLabel" parts={PARTS} note="groupLabel → heading nhóm." code={`<Choice.RadioGroup … groupLabel="Trình độ hiện tại" />`}>
                    <div className="w-72"><Choice.RadioGroup value={value} onValueChange={setValue} options={OPTIONS} groupLabel="Trình độ hiện tại" showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** WithHint — heading + dòng mô tả phụ (groupLabel + hint qua FieldFrame). */
export const WithHint: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy name="Choice.RadioGroup" tier="atom" leaf="WithHint" parts={[CONTROL, LABEL, DESCRIPTION]} note="groupLabel + hint." code={`<Choice.RadioGroup … groupLabel="Trình độ" hint="Chọn để cá nhân hoá lộ trình." />`}>
                    <div className="w-72"><Choice.RadioGroup value={value} onValueChange={setValue} options={OPTIONS} groupLabel="Trình độ hiện tại" hint="Chọn để cá nhân hoá lộ trình học." showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Required — heading kèm dấu `*` (groupLabel + isRequired). */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy name="Choice.RadioGroup" tier="atom" leaf="Required" parts={PARTS} note="isRequired → dấu * cạnh heading." code={`<Choice.RadioGroup … groupLabel="Trình độ" isRequired />`}>
                    <div className="w-72"><Choice.RadioGroup value={value} onValueChange={setValue} options={OPTIONS} groupLabel="Trình độ hiện tại" isRequired showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Disabled — khoá cả nhóm. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="Choice.RadioGroup" tier="atom" leaf="Disabled" parts={PARTS} note="isDisabled → khoá mọi option." code={`<Choice.RadioGroup isDisabled value="beginner" onValueChange={setV} options={OPTIONS} />`}>
                <div className="w-72"><Choice.RadioGroup value="beginner" onValueChange={() => {}} options={OPTIONS} ariaLabel="Trình độ" isDisabled showAnatomy /></div>
            </BlockAnatomy>
        </div>
    ),
}

/** Error — heading + cả nhóm viền lỗi + dòng lỗi đỏ (groupLabel + errorMessage). */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy name="Choice.RadioGroup" tier="atom" leaf="Error" parts={[CONTROL, LABEL, ERROR]} note="errorMessage → viền lỗi + dòng đỏ." code={`<Choice.RadioGroup … groupLabel="Trình độ" errorMessage="Vui lòng chọn trình độ." />`}>
                    <div className="w-72"><Choice.RadioGroup value={value} onValueChange={setValue} options={OPTIONS} groupLabel="Trình độ hiện tại" errorMessage="Vui lòng chọn trình độ của bạn." showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Loading — control-shaped skeleton (stack radio-row). */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="Choice.RadioGroup" tier="atom" leaf="Loading" parts={SKELETON_PARTS} code={`<Choice.RadioGroup value="" onValueChange={setV} options={OPTIONS} isSkeleton />`}>
                <div className="w-72"><Choice.RadioGroup value="" onValueChange={() => {}} options={OPTIONS} isSkeleton showAnatomy /></div>
            </BlockAnatomy>
        </div>
    ),
}
