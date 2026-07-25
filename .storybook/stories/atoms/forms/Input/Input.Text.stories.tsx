import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/Input.Text", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

// FieldFrame parts (§11a) — atom TỰ mang nhãn/mô tả/lỗi, không tách Field primitive.
const FIELD: AnatomyNode = { name: "Field", tier: "atom", role: "ô nhập text (HeroUI TextField+Input)" }
const LABEL: AnatomyNode = { name: "Label", tier: "atom", role: "nhãn field (HeroUI Label)" }
const DESC: AnatomyNode = { name: "Description", tier: "atom", role: "mô tả dưới nhãn (text-muted)" }
const ERROR: AnatomyNode = { name: "Error", tier: "atom", role: "dòng lỗi (text-danger)" }
const SKELETON: AnatomyNode = { name: "Skeleton", tier: "atom", role: "field-box skeleton (hybrid C)" }

/** Default — ô TRẦN, không nhãn (FieldFrame render thẳng control). */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy name="Input.Text" tier="atom" leaf="Default" parts={[FIELD]} note="trần — không label/hint/error." code={"<Input.Text value={v} onValueChange={setV} placeholder=\"Tên khoá học\" />"}>
                    <div className="w-72"><Input.Text value={value} onValueChange={setValue} placeholder="Tên khoá học" ariaLabel="Tên khoá học" showAnatomy /></div>
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
                <BlockAnatomy name="Input.Text" tier="atom" leaf="WithLabel" parts={[LABEL, DESC, FIELD]} note="label + hint." code={"<Input.Text label=\"Tên khoá học\" hint=\"Hiện trên thẻ khoá học\" value={v} onValueChange={setV} />"}>
                    <div className="w-72"><Input.Text label="Tên khoá học" hint="Hiện trên thẻ khoá học" value={value} onValueChange={setValue} placeholder="Tên khoá học" showAnatomy /></div>
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
                <BlockAnatomy name="Input.Text" tier="atom" leaf="Required" parts={[LABEL, FIELD]} note="isRequired → dấu * sau nhãn." code={"<Input.Text label=\"Tên khoá học\" isRequired value={v} onValueChange={setV} />"}>
                    <div className="w-72"><Input.Text label="Tên khoá học" isRequired value={value} onValueChange={setValue} placeholder="Tên khoá học" showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Filled — có value thật + nhãn. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("Fullstack Mastery")
            return (
                <BlockAnatomy name="Input.Text" tier="atom" leaf="Filled" parts={[LABEL, FIELD]} note="value có chữ." code={"<Input.Text label=\"Tên khoá học\" value=\"Fullstack Mastery\" onValueChange={setV} />"}>
                    <div className="w-72"><Input.Text label="Tên khoá học" value={value} onValueChange={setValue} showAnatomy /></div>
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
            const [value, setValue] = useState("Fullstack Mastery")
            return (
                <BlockAnatomy name="Input.Text" tier="atom" leaf="Disabled" parts={[LABEL, FIELD]} note="isDisabled → khoá + nhạt." code={"<Input.Text label=\"Tên khoá học\" value=\"Fullstack Mastery\" isDisabled onValueChange={setV} />"}>
                    <div className="w-72"><Input.Text label="Tên khoá học" value={value} onValueChange={setValue} isDisabled showAnatomy /></div>
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
                <BlockAnatomy name="Input.Text" tier="atom" leaf="Error" parts={[LABEL, FIELD, ERROR]} note="label + errorMessage → nhãn + dòng đỏ + viền." code={"<Input.Text label=\"Tên khoá học\" errorMessage=\"Tên không được để trống\" value={v} onValueChange={setV} />"}>
                    <div className="w-72"><Input.Text label="Tên khoá học" errorMessage="Tên không được để trống" value={value} onValueChange={setValue} placeholder="Tên khoá học" showAnatomy /></div>
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
            <BlockAnatomy name="Input.Text" tier="atom" leaf="Loading" parts={[LABEL, SKELETON]} note="isSkeleton + label → mirror nhãn trên hộp." code={"<Input.Text label=\"Tên khoá học\" isSkeleton />"}>
                <div className="w-72"><Input.Text label="Tên khoá học" value="" onValueChange={() => {}} isSkeleton showAnatomy /></div>
            </BlockAnatomy>
        </div>
    ),
}
