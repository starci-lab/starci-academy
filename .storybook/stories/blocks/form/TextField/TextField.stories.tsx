import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { EnvelopeIcon } from "@phosphor-icons/react"
import { TextField } from "@sb-components/blocks/form/TextField/TextField"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * TextField is the golden single-line text input — a controlled field composing
 * FieldShell (label / hint / error / skeleton) with HeroUI's TextField + Input.
 * It is the template every other form input clones: bare `value`/`onValueChange`
 * in, all field scaffolding owned by the component.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis. `FieldShell` lives in a sibling folder (not editable here) so
 * it is badged as ONE opaque node via a plain marker wrapper — its own
 * label/hint/error anatomy is that component's own story, not drilled into here.
 */
const meta: Meta<typeof TextField> = {
    title: "Primitives/Forms/TextField",
    component: TextField,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof TextField>

const FIELD_SHELL: AnatomyNode = { name: "FieldShell", tier: "primitive", role: "khung field dùng chung (label · hint · error · skeleton column)" }
const INPUT: AnatomyNode = { name: "Input", tier: "primitive", role: "control nhập liệu (leading icon tuỳ chọn, HeroUI Input)" }
const PARTS: Array<AnatomyNode> = [FIELD_SHELL, INPUT]

/** Local controlled wrapper so the field is typeable on the canvas. */
const Controlled = ({
    initialValue = "",
    label,
    description,
    errorMessage,
    placeholder,
    isDisabled,
    leadingIcon,
}: {
    initialValue?: string
    label?: ReactNode
    description?: ReactNode
    errorMessage?: ReactNode
    placeholder?: string
    isDisabled?: boolean
    leadingIcon?: typeof EnvelopeIcon
}) => {
    const [value, setValue] = useState(initialValue)
    return (
        <TextField
            showAnatomy
            label={label}
            description={description}
            errorMessage={errorMessage}
            placeholder={placeholder}
            value={value}
            onValueChange={setValue}
            isDisabled={isDisabled}
            leadingIcon={leadingIcon}
        />
    )
}

/** Default: a plain labelled field with a placeholder. */
export const Default: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="TextField" tier="primitive" leaf="Default" parts={PARTS} reason="TextField luôn compose FieldShell (khung label/hint/error) bọc Input (control nhập liệu) — 2 phần trực tiếp cố định.">
                <Controlled label="Họ và tên" placeholder="Nguyễn Văn A" />
            </BlockAnatomy>
        </div>
    ),
}

/** WithHint: a description under the label, plus a leading icon. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="TextField" tier="primitive" leaf="WithHint" parts={PARTS} note="`description` render bên trong FieldShell (hint dưới label); `leadingIcon` nằm trong Input, không phải node riêng.">
                <Controlled
                    label="Email"
                    description="Dùng để đăng nhập và nhận thông báo."
                    placeholder="ban@vidu.com"
                    leadingIcon={EnvelopeIcon}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** WithError: an invalid field with a fix-it error line below. */
export const WithError: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="TextField" tier="primitive" leaf="WithError" parts={PARTS} note="`errorMessage` → FieldShell hiện dòng lỗi + Input nhận `isInvalid` qua HeroTextField.">
                <Controlled
                    label="Email"
                    initialValue="ban@@vidu"
                    placeholder="ban@vidu.com"
                    errorMessage="Email không hợp lệ — kiểm tra lại định dạng."
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Disabled: the field is not editable. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy name="TextField" tier="primitive" leaf="Disabled" parts={PARTS} note="`isDisabled` truyền xuống cả FieldShell (label mờ) và Input (control khoá).">
                <Controlled label="Mã giới thiệu" initialValue="STARCI-2026" isDisabled />
            </BlockAnatomy>
        </div>
    ),
}

/** Skeleton: the loading mirror — label bar over a field-box skeleton. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8 max-w-sm">
            <BlockAnatomy
                name="TextField"
                tier="primitive"
                leaf="Skeleton"
                parts={[{ name: "FieldShell", tier: "primitive", role: "khung field TỰ đổi sang mirror (label bar + field-box skeleton) khi isSkeleton — Input không render" }]}
                note="`isSkeleton` → FieldShell tự render mirror; Input hoàn toàn không mount (không có node control thật)."
            >
                <TextField showAnatomy label="Họ và tên" value="" onValueChange={() => {}} isSkeleton />
            </BlockAnatomy>
        </div>
    ),
}
