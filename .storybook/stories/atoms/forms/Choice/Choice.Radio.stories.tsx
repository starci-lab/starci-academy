import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { RadioGroup as HeroRadioGroup } from "@heroui/react"
import { Choice } from "@sb-components/atoms/forms/Choice/Choice"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Choice/Choice.Radio", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

/**
 * ⚠️ PHẠM VI STATE (thầy chốt 2026-07-25): `Choice.Radio` là MỘT hàng option — nó
 * KHÔNG sống độc lập. Mô tả phụ (`hint`) · lỗi (`errorMessage`) · bắt buộc
 * (`isRequired`) là chuyện của NHÓM nên các state đó có nhà ở story
 * `Choice.RadioGroup` — KHÔNG lặp lại ở đây. Story này chỉ giữ state SINH RA TỪ
 * chính hàng option: Default · Selected · Disabled · Loading.
 *
 * ⚠️ HARNESS: `Choice.RadioGroup` chỉ nhận `options` DỮ LIỆU (không children), nên
 * để soi MỘT hàng option ta bọc bằng HeroUI `RadioGroup` trần — đây là giàn giáo
 * của story để có radio-context, KHÔNG phải cách dùng trong app.
 */
const CONTROL: AnatomyNode = { name: "Control", tier: "atom", role: "dot (HeroUI Radio.Control + Indicator)" }
const LABEL: AnatomyNode = { name: "Label", tier: "atom", role: "nhãn cạnh dot (Radio.Content)" }
const SKELETON_PARTS: Array<AnatomyNode> = [{ name: "Skeleton", tier: "atom", role: "control-shaped skeleton (dot + nhãn bar)" }]
const PARTS: Array<AnatomyNode> = [CONTROL, LABEL]

/** Default — một option chưa chọn (bọc trong radio-context để chạy). */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy name="Choice.Radio" tier="atom" leaf="Default" parts={PARTS} note="Radio phải nằm trong một radio-context (app dùng Choice.RadioGroup options)." code={`<Choice.Radio value="option-a" label="Gói cơ bản" />`}>
                    <div className="w-72">
                        <HeroRadioGroup aria-label="Lựa chọn" value={value} onChange={setValue} className="flex flex-col gap-2">
                            <Choice.Radio value="option-a" label="Gói cơ bản" showAnatomy />
                        </HeroRadioGroup>
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Selected — option đã chọn (value của nhóm khớp `value` của hàng). */
export const Selected: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("option-a")
            return (
                <BlockAnatomy name="Choice.Radio" tier="atom" leaf="Selected" parts={PARTS} note="value của nhóm khớp → dot đầy (hàng option KHÔNG tự giữ state chọn)." code={`<Choice.Radio value="option-a" label="Gói cơ bản" />`}>
                    <div className="w-72">
                        <HeroRadioGroup aria-label="Lựa chọn" value={value} onChange={setValue} className="flex flex-col gap-2">
                            <Choice.Radio value="option-a" label="Gói cơ bản" showAnatomy />
                        </HeroRadioGroup>
                    </div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Disabled — khoá RIÊNG hàng option này (khoá cả nhóm là state của RadioGroup). */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="Choice.Radio" tier="atom" leaf="Disabled" parts={PARTS} note="isDisabled → khoá + nhạt đúng MỘT hàng." code={`<Choice.Radio value="option-a" label="Gói cơ bản" isDisabled />`}>
                <div className="w-72">
                    <HeroRadioGroup aria-label="Lựa chọn" value="option-a" onChange={() => {}} className="flex flex-col gap-2">
                        <Choice.Radio value="option-a" label="Gói cơ bản" isDisabled showAnatomy />
                    </HeroRadioGroup>
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Loading — control-shaped skeleton (dot + nhãn bar); không cần radio-context. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="Choice.Radio" tier="atom" leaf="Loading" parts={SKELETON_PARTS} code={`<Choice.Radio value="" label="" isSkeleton />`}>
                <div className="w-72"><Choice.Radio value="" label="" isSkeleton showAnatomy /></div>
            </BlockAnatomy>
        </div>
    ),
}
