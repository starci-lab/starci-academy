import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/Input.Tags", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

// FieldFrame parts (§11a) — atom TỰ mang nhãn/mô tả/lỗi, không tách Field primitive.
const FIELD: AnatomyNode = { name: "Field", tier: "atom", role: "hộp token: chips + ô nhập (add=Enter, xoá=×/Backspace)" }
const CHIP: AnatomyNode = { name: "Chip", tier: "atom", role: "mỗi token là 1 Chip.Base removable" }
const LABEL: AnatomyNode = { name: "Label", tier: "atom", role: "nhãn field (HeroUI Label)" }
const DESC: AnatomyNode = { name: "Description", tier: "atom", role: "mô tả dưới nhãn (text-muted)" }
const ERROR: AnatomyNode = { name: "Error", tier: "atom", role: "dòng lỗi (text-danger)" }
const SKELETON: AnatomyNode = { name: "Skeleton", tier: "atom", role: "field-box skeleton (hybrid C)" }

/** Default — ô TRẦN trống, gõ + Enter để thêm thẻ. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>([])
            return (
                <BlockAnatomy name="Input.Tags" tier="atom" leaf="Default" parts={[FIELD]} note="trần — không label/hint/error." code={"<Input.Tags value={v} onValueChange={setV} placeholder=\"Thêm thẻ…\" />"}>
                    <div className="w-80"><Input.Tags value={value} onValueChange={setValue} placeholder="Thêm thẻ…" ariaLabel="Thẻ" showAnatomy /></div>
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
            const [value, setValue] = useState<string[]>([])
            return (
                <BlockAnatomy name="Input.Tags" tier="atom" leaf="WithLabel" parts={[LABEL, DESC, FIELD]} note="label + hint." code={"<Input.Tags label=\"Kỹ năng\" hint=\"Enter để thêm\" value={v} onValueChange={setV} />"}>
                    <div className="w-80"><Input.Tags label="Kỹ năng" hint="Enter để thêm thẻ" value={value} onValueChange={setValue} placeholder="Thêm thẻ…" showAnatomy /></div>
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
            const [value, setValue] = useState<string[]>([])
            return (
                <BlockAnatomy name="Input.Tags" tier="atom" leaf="Required" parts={[LABEL, FIELD]} note="isRequired → dấu * sau nhãn." code={"<Input.Tags label=\"Kỹ năng\" isRequired value={v} onValueChange={setV} />"}>
                    <div className="w-80"><Input.Tags label="Kỹ năng" isRequired value={value} onValueChange={setValue} placeholder="Thêm thẻ…" showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Filled — có sẵn vài token (mỗi cái xoá bằng ×) + nhãn. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>(["React", "TypeScript", "GraphQL"])
            return (
                <BlockAnatomy name="Input.Tags" tier="atom" leaf="Filled" parts={[LABEL, FIELD, CHIP]} note="value có token → mỗi cái là 1 Chip." code={"<Input.Tags label=\"Kỹ năng\" value={[\"React\", \"TypeScript\", \"GraphQL\"]} onValueChange={setV} />"}>
                    <div className="w-80"><Input.Tags label="Kỹ năng" value={value} onValueChange={setValue} placeholder="Thêm thẻ…" showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Disabled — khoá hộp token + nhãn nhạt (Chip không xoá được). */
export const Disabled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string[]>(["React", "TypeScript"])
            return (
                <BlockAnatomy name="Input.Tags" tier="atom" leaf="Disabled" parts={[LABEL, FIELD, CHIP]} note="isDisabled → khoá hộp + nhạt (Chip không xoá được)." code={"<Input.Tags label=\"Kỹ năng\" isDisabled value={[\"React\", \"TypeScript\"]} />"}>
                    <div className="w-80"><Input.Tags label="Kỹ năng" value={value} onValueChange={setValue} placeholder="Thêm thẻ…" isDisabled showAnatomy /></div>
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
            const [value, setValue] = useState<string[]>(["React"])
            return (
                <BlockAnatomy name="Input.Tags" tier="atom" leaf="Error" parts={[LABEL, FIELD, CHIP, ERROR]} note="label + errorMessage → nhãn + dòng đỏ + viền." code={"<Input.Tags label=\"Kỹ năng\" errorMessage=\"Cần ít nhất 3 thẻ\" value={[\"React\"]} onValueChange={setV} />"}>
                    <div className="w-80"><Input.Tags label="Kỹ năng" errorMessage="Cần ít nhất 3 thẻ" value={value} onValueChange={setValue} placeholder="Thêm thẻ…" showAnatomy /></div>
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
            <BlockAnatomy name="Input.Tags" tier="atom" leaf="Loading" parts={[LABEL, SKELETON]} note="isSkeleton + label → mirror nhãn trên hộp." code={"<Input.Tags label=\"Kỹ năng\" isSkeleton />"}>
                <div className="w-80"><Input.Tags label="Kỹ năng" value={[]} onValueChange={() => {}} isSkeleton showAnatomy /></div>
            </BlockAnatomy>
        </div>
    ),
}
