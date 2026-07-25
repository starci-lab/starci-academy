import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { Form } from "@sb-components/blocks/form/Form/Form"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * KHUNG (layout tier §13) — `Form.Base`: vỏ `<form>` THẬT (submit bằng ENTER) +
 * cột nội dung theo nhịp `gap` (§10c) + slot `actions` ở đáy.
 *
 * ⚠️ PHẠM VI STATE (§12f): story ở đây chỉ render state do CHÍNH khung đẻ ra —
 * `isDisabled` (khoá cả form qua `<fieldset disabled>`) và cách nó bố trí
 * `body`/`actions`. Nhãn/hint/lỗi/required của field là state của ATOM
 * (`Atoms/Forms/Input/*`, §12e) — KHÔNG lặp ở đây. Pending của từng nút là state
 * của `Atoms/Buttons/Button` — ở đây nó chỉ xuất hiện như MỘT PHẦN của trạng thái
 * "đang submit" mà khung sở hữu.
 */
const meta: Meta<typeof Form.Base> = {
    title: "Layouts/Form/Form/Form.Base",
    component: Form.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Form.Base>

/** Hai part TRỰC TIẾP của khung: cột nội dung và slot hàng nút (§11a). */
const PARTS: Array<AnatomyNode> = [
    { name: "Body", tier: "primitive", role: "cột nội dung (`body`/`children`) — các Form.Section / field, nhịp `gap`" },
    { name: "Actions", tier: "primitive", role: "slot hàng nút ở ĐÁY form (thường là Form.Actions)" },
]

/** Fixture field thật — atom `Input.*` TỰ mang label/hint/required (§12e). */
const AccountFields = () => {
    const [name, setName] = useState("Nguyễn Minh Quang")
    const [email, setEmail] = useState("quang@starci.dev")
    return (
        <>
            <Input.Text label="Họ và tên" isRequired value={name} onValueChange={setName} placeholder="Họ và tên" />
            <Input.Text label="Email" hint="Dùng để nhận thông báo khoá học." value={email} onValueChange={setEmail} placeholder="you@example.com" />
        </>
    )
}

/** Default — `children` là lối rút gọn của `body`; `actions` là slot riêng ở đáy. */
export const Default: Story = {
    render: () => {
        const Demo = () => (
            <BlockAnatomy
                name="Form.Base"
                tier="primitive"
                leaf="Default"
                parts={PARTS}
                reason="Khung form của tầng layout: dựng thẻ `<form>` thật (ENTER trong field = submit, a11y), xếp nội dung thành cột theo `gap` §10c, và giữ một slot `actions` ở đáy. Khung KHÔNG biết field bên trong — không validation, không giá trị, không lỗi (đó là tầng block); nhãn/lỗi do atom form tự mang (§12e)."
                code={`<Form.Base
  gap={6}
  onSubmit={() => save()}
  actions={<Form.Actions items={[{ key: "cancel", label: "Huỷ", variant: "secondary" }, { key: "save", label: "Lưu" }]} />}
>
  <Form.Section title="Tài khoản">
    <Input.Text label="Họ và tên" isRequired value={name} onValueChange={setName} />
    <Input.Text label="Email" value={email} onValueChange={setEmail} />
  </Form.Section>
</Form.Base>`}
            >
                <div className="w-96">
                    <Form.Base
                        showAnatomy
                        onSubmit={() => {}}
                        actions={(
                            <Form.Actions
                                items={[
                                    { key: "cancel", label: "Huỷ", variant: "secondary" },
                                    { key: "save", label: "Lưu thay đổi" },
                                ]}
                            />
                        )}
                    >
                        <Form.Section title="Tài khoản">
                            <AccountFields />
                        </Form.Section>
                    </Form.Base>
                </div>
            </BlockAnatomy>
        )
        return <div className="p-8"><Demo /></div>
    },
}

/**
 * Submitting — đang gửi: khung khoá CẢ form (`isDisabled`) trong khi nút chính
 * quay spinner. Đây là state của KHUNG (một `<fieldset disabled>` phủ mọi control),
 * không phải state riêng của nút.
 */
export const Submitting: Story = {
    render: () => {
        const Demo = () => (
            <BlockAnatomy
                name="Form.Base"
                tier="primitive"
                leaf="Submitting"
                parts={PARTS}
                note="`isDisabled` → `<fieldset disabled>` native tắt MỌI control con (field + nút) cùng lúc; khung không phải thread cờ xuống từng field."
                code={`<Form.Base
  isDisabled
  actions={<Form.Actions items={[{ key: "cancel", label: "Huỷ", variant: "secondary" }, { key: "save", label: "Đang lưu", isPending: true }]} />}
>
  …
</Form.Base>`}
            >
                <div className="w-96">
                    <Form.Base
                        showAnatomy
                        isDisabled
                        onSubmit={() => {}}
                        actions={(
                            <Form.Actions
                                items={[
                                    { key: "cancel", label: "Huỷ", variant: "secondary" },
                                    { key: "save", label: "Đang lưu", isPending: true },
                                ]}
                            />
                        )}
                    >
                        <Form.Section title="Tài khoản">
                            <AccountFields />
                        </Form.Section>
                    </Form.Base>
                </div>
            </BlockAnatomy>
        )
        return <div className="p-8"><Demo /></div>
    },
}

/**
 * Disabled — form khoá mà KHÔNG có gì đang chạy (chưa đủ quyền, đang chờ điều
 * kiện mở). Cùng cơ chế `<fieldset disabled>`, khác ở chỗ không nút nào pending.
 */
export const Disabled: Story = {
    render: () => {
        const Demo = () => (
            <BlockAnatomy
                name="Form.Base"
                tier="primitive"
                leaf="Disabled"
                parts={PARTS}
                note="Khoá tĩnh: cùng `<fieldset disabled>` như Submitting nhưng không nút nào pending — form chỉ đọc được, không thao tác được."
                code={`<Form.Base isDisabled actions={<Form.Actions items={[…]} />}>
  …
</Form.Base>`}
            >
                <div className="w-96">
                    <Form.Base
                        showAnatomy
                        isDisabled
                        onSubmit={() => {}}
                        actions={(
                            <Form.Actions
                                items={[
                                    { key: "cancel", label: "Huỷ", variant: "secondary" },
                                    { key: "save", label: "Lưu thay đổi" },
                                ]}
                            />
                        )}
                    >
                        <Form.Section title="Tài khoản" description="Chỉ quản trị viên mới sửa được hồ sơ này.">
                            <AccountFields />
                        </Form.Section>
                    </Form.Base>
                </div>
            </BlockAnatomy>
        )
        return <div className="p-8"><Demo /></div>
    },
}
