import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/Input.Password", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

// FieldFrame parts (§11a) — atom TỰ mang nhãn/mô tả/lỗi, không tách Field primitive.
const FIELD: AnatomyNode = { name: "Field", tier: "atom", role: "ô mật khẩu (HeroUI Input type=password)" }
const TOGGLE: AnatomyNode = { name: "Toggle", tier: "atom", role: "nút hiện/ẩn (gravity Eye/EyeSlash)" }
const LABEL: AnatomyNode = { name: "Label", tier: "atom", role: "nhãn field (HeroUI Label)" }
const DESC: AnatomyNode = { name: "Description", tier: "atom", role: "mô tả dưới nhãn (text-muted)" }
const ERROR: AnatomyNode = { name: "Error", tier: "atom", role: "dòng lỗi (text-danger)" }
const SKELETON: AnatomyNode = { name: "Skeleton", tier: "atom", role: "field-box skeleton (hybrid C)" }

/** Default — ô TRẦN ẩn mật khẩu + nút con mắt hiện/ẩn. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("matkhau123")
            return (
                <BlockAnatomy name="Input.Password" tier="atom" leaf="Default" parts={[FIELD, TOGGLE]} note="trần — không label/hint/error." code={`<Input.Password value={v} onValueChange={setV} placeholder="Mật khẩu" />`}>
                    <div className="w-72"><Input.Password value={value} onValueChange={setValue} placeholder="Mật khẩu" ariaLabel="Mật khẩu" showAnatomy /></div>
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
                <BlockAnatomy name="Input.Password" tier="atom" leaf="WithLabel" parts={[LABEL, DESC, FIELD, TOGGLE]} note="label + hint." code={`<Input.Password label="Mật khẩu" hint="Tối thiểu 8 ký tự" value={v} onValueChange={setV} />`}>
                    <div className="w-72"><Input.Password label="Mật khẩu" hint="Tối thiểu 8 ký tự" value={value} onValueChange={setValue} placeholder="Mật khẩu" showAnatomy /></div>
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
                <BlockAnatomy name="Input.Password" tier="atom" leaf="Required" parts={[LABEL, FIELD, TOGGLE]} note="isRequired → dấu * sau nhãn." code={`<Input.Password label="Mật khẩu" isRequired value={v} onValueChange={setV} />`}>
                    <div className="w-72"><Input.Password label="Mật khẩu" isRequired value={value} onValueChange={setValue} placeholder="Mật khẩu" showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Filled — có value thật (ẩn thành ●) + nhãn. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("SieuBaoMat!2026")
            return (
                <BlockAnatomy name="Input.Password" tier="atom" leaf="Filled" parts={[LABEL, FIELD, TOGGLE]} note="value có chữ (ẩn thành ●)." code={`<Input.Password label="Mật khẩu" value="SieuBaoMat!2026" onValueChange={setV} />`}>
                    <div className="w-72"><Input.Password label="Mật khẩu" value={value} onValueChange={setValue} showAnatomy /></div>
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
            const [value, setValue] = useState("SieuBaoMat!2026")
            return (
                <BlockAnatomy name="Input.Password" tier="atom" leaf="Disabled" parts={[LABEL, FIELD, TOGGLE]} note="isDisabled → khoá + nhạt." code={`<Input.Password label="Mật khẩu" value="SieuBaoMat!2026" isDisabled onValueChange={setV} />`}>
                    <div className="w-72"><Input.Password label="Mật khẩu" value={value} onValueChange={setValue} isDisabled showAnatomy /></div>
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
            const [value, setValue] = useState("123")
            return (
                <BlockAnatomy name="Input.Password" tier="atom" leaf="Error" parts={[LABEL, FIELD, TOGGLE, ERROR]} note="label + errorMessage → nhãn + dòng đỏ + viền." code={`<Input.Password label="Mật khẩu" errorMessage="Mật khẩu quá ngắn" value={v} onValueChange={setV} />`}>
                    <div className="w-72"><Input.Password label="Mật khẩu" errorMessage="Mật khẩu quá ngắn" value={value} onValueChange={setValue} placeholder="Mật khẩu" showAnatomy /></div>
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
            <BlockAnatomy name="Input.Password" tier="atom" leaf="Loading" parts={[LABEL, SKELETON]} note="isSkeleton + label → mirror nhãn trên hộp." code={`<Input.Password label="Mật khẩu" isSkeleton />`}>
                <div className="w-72"><Input.Password label="Mật khẩu" value="" onValueChange={() => {}} isSkeleton showAnatomy /></div>
            </BlockAnatomy>
        </div>
    ),
}
