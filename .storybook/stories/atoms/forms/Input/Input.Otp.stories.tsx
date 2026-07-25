import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/Input.Otp", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

// FieldFrame parts (§11a) — atom TỰ mang nhãn/mô tả/lỗi, không tách Field primitive.
const FIELD: AnatomyNode = { name: "Field", tier: "atom", role: "dãy ô mã OTP (HeroUI InputOTP.Group + Slot)" }
const LABEL: AnatomyNode = { name: "Label", tier: "atom", role: "nhãn field (HeroUI Label)" }
const DESC: AnatomyNode = { name: "Description", tier: "atom", role: "mô tả dưới nhãn (text-muted)" }
const ERROR: AnatomyNode = { name: "Error", tier: "atom", role: "dòng lỗi (text-danger)" }
const SKELETON: AnatomyNode = { name: "Skeleton", tier: "atom", role: "dãy ô skeleton khớp length (hybrid C)" }

/** Default — ô TRẦN 6 ô trống. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy name="Input.Otp" tier="atom" leaf="Default" parts={[FIELD]} note="trần — không label/hint/error." code={"<Input.Otp value={v} onValueChange={setV} length={6} />"}>
                    <div className="w-80"><Input.Otp value={value} onValueChange={setValue} length={6} ariaLabel="Mã xác minh" showAnatomy /></div>
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
                <BlockAnatomy name="Input.Otp" tier="atom" leaf="WithLabel" parts={[LABEL, DESC, FIELD]} note="label + hint." code={"<Input.Otp label=\"Mã xác minh\" hint=\"Gửi qua email của bạn\" value={v} onValueChange={setV} length={6} />"}>
                    <div className="w-80"><Input.Otp label="Mã xác minh" hint="Gửi qua email của bạn" value={value} onValueChange={setValue} length={6} showAnatomy /></div>
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
                <BlockAnatomy name="Input.Otp" tier="atom" leaf="Required" parts={[LABEL, FIELD]} note="isRequired → dấu * sau nhãn." code={"<Input.Otp label=\"Mã xác minh\" isRequired value={v} onValueChange={setV} length={6} />"}>
                    <div className="w-80"><Input.Otp label="Mã xác minh" isRequired value={value} onValueChange={setValue} length={6} showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Filled — đã nhập một phần mã + nhãn. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("1234")
            return (
                <BlockAnatomy name="Input.Otp" tier="atom" leaf="Filled" parts={[LABEL, FIELD]} note="value có một phần mã." code={"<Input.Otp label=\"Mã xác minh\" value=\"1234\" onValueChange={setV} length={6} />"}>
                    <div className="w-80"><Input.Otp label="Mã xác minh" value={value} onValueChange={setValue} length={6} showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Disabled — khoá dãy ô + nhãn nhạt (có sẵn mã). */
export const Disabled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("1234")
            return (
                <BlockAnatomy name="Input.Otp" tier="atom" leaf="Disabled" parts={[LABEL, FIELD]} note="isDisabled → khoá + nhạt dãy ô." code={"<Input.Otp label=\"Mã xác minh\" isDisabled value=\"1234\" length={6} />"}>
                    <div className="w-80"><Input.Otp label="Mã xác minh" value={value} onValueChange={setValue} length={6} isDisabled showAnatomy /></div>
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
                <BlockAnatomy name="Input.Otp" tier="atom" leaf="Error" parts={[LABEL, FIELD, ERROR]} note="label + errorMessage → nhãn + dòng đỏ + viền." code={"<Input.Otp label=\"Mã xác minh\" errorMessage=\"Mã không đúng\" value=\"123\" length={6} />"}>
                    <div className="w-80"><Input.Otp label="Mã xác minh" errorMessage="Mã không đúng" value={value} onValueChange={setValue} length={6} showAnatomy /></div>
                </BlockAnatomy>
            )
        }
        return <div className="p-8"><Demo /></div>
    },
}

/** Loading — nhãn skeleton (mirror) trên dãy ô skeleton khớp length. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="Input.Otp" tier="atom" leaf="Loading" parts={[LABEL, SKELETON]} note="isSkeleton + label → mirror nhãn trên dãy ô." code={"<Input.Otp label=\"Mã xác minh\" isSkeleton length={6} />"}>
                <div className="w-80"><Input.Otp label="Mã xác minh" value="" onValueChange={() => {}} length={6} isSkeleton showAnatomy /></div>
            </BlockAnatomy>
        </div>
    ),
}
