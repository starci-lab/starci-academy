import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Select } from "@sb-components/atoms/forms/Select/Select"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Select/Select.Combobox", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

const FIELD: AnatomyNode = { name: "Field", tier: "atom", role: "ô gõ lọc (HeroUI ComboBox Input)" }
const TRIGGER: AnatomyNode = { name: "Trigger", tier: "atom", role: "caret mở toàn danh sách" }
const LABEL: AnatomyNode = { name: "Label", tier: "atom", role: "nhãn trên control (FieldFrame)" }
const DESC: AnatomyNode = { name: "Description", tier: "atom", role: "mô tả dưới nhãn (FieldFrame)" }
const ERROR: AnatomyNode = { name: "Error", tier: "atom", role: "dòng lỗi dưới control (FieldFrame)" }
const SKELETON: AnatomyNode = { name: "Skeleton", tier: "atom", role: "trigger-box skeleton (hybrid C)" }

const OPTIONS = [
    { value: "hn", label: "Hà Nội" },
    { value: "hcm", label: "TP. Hồ Chí Minh" },
    { value: "dn", label: "Đà Nẵng" },
    { value: "ct", label: "Cần Thơ" },
    { value: "hp", label: "Hải Phòng" },
]

/** Default — TRẦN (không label): ô trống, gõ để lọc gợi ý. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string | null>(null)
            return (
                <BlockAnatomy name="Select.Combobox" tier="atom" leaf="Default" parts={[FIELD, TRIGGER]} code={"<Select.Combobox value={v} onValueChange={setV} options={OPTIONS} placeholder=\"Tìm tỉnh/thành\" />"} note="gõ → react-aria tự lọc options.">
                    <div className="w-72"><Select.Combobox value={value} onValueChange={setValue} options={OPTIONS} placeholder="Tìm tỉnh/thành" ariaLabel="Tỉnh/thành" showAnatomy /></div>
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
                <BlockAnatomy name="Select.Combobox" tier="atom" leaf="WithLabel" parts={[LABEL, DESC, FIELD, TRIGGER]} code={"<Select.Combobox label=\"Tỉnh/thành\" hint=\"Gõ để lọc nhanh.\" ... />"}>
                    <div className="w-72"><Select.Combobox value={value} onValueChange={setValue} options={OPTIONS} placeholder="Tìm tỉnh/thành" label="Tỉnh/thành" hint="Gõ để lọc nhanh." showAnatomy /></div>
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
                <BlockAnatomy name="Select.Combobox" tier="atom" leaf="Required" parts={[LABEL, FIELD, TRIGGER]} code={"<Select.Combobox label=\"Tỉnh/thành\" isRequired ... />"} note="isRequired → dấu * sau nhãn.">
                    <div className="w-72"><Select.Combobox value={value} onValueChange={setValue} options={OPTIONS} placeholder="Tìm tỉnh/thành" label="Tỉnh/thành" isRequired showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Filled — đã chọn 1 gợi ý + có nhãn (nhãn hiện trong ô). */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string | null>("dn")
            return (
                <BlockAnatomy name="Select.Combobox" tier="atom" leaf="Filled" parts={[LABEL, FIELD, TRIGGER]} code={"<Select.Combobox label=\"Tỉnh/thành\" value=\"dn\" options={OPTIONS} />"} note="value có sẵn.">
                    <div className="w-72"><Select.Combobox value={value} onValueChange={setValue} options={OPTIONS} placeholder="Tìm tỉnh/thành" label="Tỉnh/thành" showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Disabled — khoá ô gõ + caret + có nhãn (nhạt). */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="Select.Combobox" tier="atom" leaf="Disabled" parts={[LABEL, FIELD, TRIGGER]} code={"<Select.Combobox label=\"Tỉnh/thành\" isDisabled value=\"hn\" ... />"} note="isDisabled → khoá ô + caret + nhạt nhãn.">
                <div className="w-72"><Select.Combobox value="hn" onValueChange={() => {}} options={OPTIONS} placeholder="Tìm tỉnh/thành" label="Tỉnh/thành" isDisabled showAnatomy /></div>
            </BlockAnatomy>
        </div>
    ),
}

/** Error — nhãn + dòng lỗi đỏ + viền lỗi (errorMessage bật cả message lẫn viền). */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string | null>(null)
            return (
                <BlockAnatomy name="Select.Combobox" tier="atom" leaf="Error" parts={[LABEL, FIELD, TRIGGER, ERROR]} code={"<Select.Combobox label=\"Tỉnh/thành\" errorMessage=\"Chọn một tỉnh/thành hợp lệ.\" ... />"} note="errorMessage → NHÃN + dòng đỏ + viền.">
                    <div className="w-72"><Select.Combobox value={value} onValueChange={setValue} options={OPTIONS} placeholder="Tìm tỉnh/thành" label="Tỉnh/thành" errorMessage="Chọn một tỉnh/thành hợp lệ." showAnatomy /></div>
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
            <BlockAnatomy name="Select.Combobox" tier="atom" leaf="Loading" parts={[LABEL, SKELETON]} code={"<Select.Combobox label=\"Tỉnh/thành\" isSkeleton />"} note="isSkeleton → label-skeleton + trigger-box skeleton.">
                <div className="w-72"><Select.Combobox value={null} onValueChange={() => {}} options={OPTIONS} label="Tỉnh/thành" isSkeleton showAnatomy /></div>
            </BlockAnatomy>
        </div>
    ),
}
