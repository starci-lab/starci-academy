import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { InputText } from "@sb-components/atoms/forms/Input/Input"
import { Form, FormActions, FormSection } from "@sb-components/composites/form/Form/Form"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * KHUNG (composite tier §13) — `Form`: vỏ `<form>` THẬT (submit bằng ENTER) +
 * cột nội dung theo nhịp `gap` (§10c) + slot `actions` ở đáy.
 *
 * ⚠️ PHẠM VI STATE (§12f): story ở đây chỉ render state do CHÍNH khung đẻ ra —
 * `isDisabled` (khoá cả form qua `<fieldset disabled>`) và cách nó bố trí
 * `body`/`actions`. Nhãn/hint/lỗi/required của field là state của ATOM
 * (`Atoms/Forms/Input/*`, §12e) — KHÔNG lặp ở đây. Pending của từng nút là state
 * của `Atoms/Buttons/Button` — ở đây nó chỉ xuất hiện như MỘT PHẦN của trạng thái
 * "đang submit" mà khung sở hữu.
 */
const meta: Meta<typeof Form> = {
    title: "Composites/Form/Form/Form",
    component: Form,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Form>

/**
 * Khung KHÔNG badge `Body`/`Actions` (2026-07-28, §11a.1 LOẠI 3): cả hai bọc node
 * TUỲ Ý caller đưa vào (field bất kỳ, hoặc `actions` — thường là `FormActions`
 * nhưng không hề bị ép kiểu), nên không có MỘT component cố định để trỏ sang —
 * component đã bỏ hẳn hai badge này. Không còn part nào của RIÊNG `Form` để
 * khai ở đây; những node THẬT xuất hiện trong canvas dưới đây (vd `Typography`
 * của `FormSection`) đã có `storyId` khai sẵn ở `FormSection.stories.tsx`.
 */

/** Fixture field thật — atom `Input.*` TỰ mang label/hint/required (§12e). */
const AccountFields = () => {
    const [name, setName] = useState("Quang Nguyen")
    const [email, setEmail] = useState("quang@starci.dev")
    return (
        <>
            <InputText label="Full name" isRequired value={name} onValueChange={setName} placeholder="Full name" />
            <InputText label="Email" hint="Where course notifications are sent." value={email} onValueChange={setEmail} placeholder="you@example.com" />
        </>
    )
}

/** Default — `children` là lối rút gọn của `body`; `actions` là slot riêng ở đáy. */
export const Default: Story = {
    render: () => {
        const Demo = () => (
            <BlockAnatomy
                name="Form"
                tier="composite"
                leaf="Default"
                reason="The form frame of the composite tier: it builds a real `<form>` (ENTER inside a field submits, a11y), stacks content into a column on the `gap` rhythm (§10c), and keeps one `actions` slot at the bottom. The frame knows nothing about the fields inside, no validation, no values, no errors (that is the block tier); labels and errors come from the form atoms themselves (§12e)."
                states={[
                    {
                        name: "isDisabled not set, children shorthand fills body",
                        why: "The frame renders as a live, editable form: the fieldset stays enabled and `children` fills the `body` slot as the shorthand for it, while `actions` sits in its own slot at the bottom. This is the resting shape a reader lands on before anything is submitted or locked.",
                        code: `<Form
  gap="section"
  onSubmit={() => save()}
  actions={<FormActions items={[{ key: "cancel", label: "Cancel", variant: "secondary" }, { key: "save", label: "Save" }]} />}
>
  <FormSection title="Account">
    <InputText label="Full name" isRequired value={name} onValueChange={setName} />
    <InputText label="Email" value={email} onValueChange={setEmail} />
  </FormSection>
</Form>`,
                        render: (
                            <div className="w-96">
                                <Form
                                    showAnatomy
                                    onSubmit={() => {}}
                                    actions={(
                                        <FormActions
                                            items={[
                                                { key: "cancel", label: "Cancel", variant: "secondary" },
                                                { key: "save", label: "Save changes" },
                                            ]}
                                        />
                                    )}
                                >
                                    <FormSection title="Account">
                                        <AccountFields />
                                    </FormSection>
                                </Form>
                            </div>
                        ),
                    },
                ]}
            />
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
                name="Form"
                tier="composite"
                leaf="Submitting"
                states={[
                    {
                        name: "isDisabled = true, one action isPending",
                        why: "Every control inside locks at once, because `isDisabled` maps to a native `<fieldset disabled>` covering both fields and buttons, while the save button's own spinner marks which action is running. The frame never threads a flag down to each field individually, so this single switch is what keeps the whole form from being edited mid-submit.",
                        code: `<Form
  isDisabled
  actions={<FormActions items={[{ key: "cancel", label: "Cancel", variant: "secondary" }, { key: "save", label: "Saving", isPending: true }]} />}
>
  …
</Form>`,
                        render: (
                            <div className="w-96">
                                <Form
                                    showAnatomy
                                    isDisabled
                                    onSubmit={() => {}}
                                    actions={(
                                        <FormActions
                                            items={[
                                                { key: "cancel", label: "Cancel", variant: "secondary" },
                                                { key: "save", label: "Saving", isPending: true },
                                            ]}
                                        />
                                    )}
                                >
                                    <FormSection title="Account">
                                        <AccountFields />
                                    </FormSection>
                                </Form>
                            </div>
                        ),
                    },
                ]}
            />
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
                name="Form"
                tier="composite"
                leaf="Disabled"
                states={[
                    {
                        name: "isDisabled = true, no action isPending",
                        why: "Every control locks through the same `<fieldset disabled>` as the Submitting leaf, but none of the buttons carries a spinner. This is a static lock, not an in-flight one: the form reads and nothing on it is currently running, such as a step upstream that has not cleared yet.",
                        code: `<Form isDisabled actions={<FormActions items={[…]} />}>
  …
</Form>`,
                        render: (
                            <div className="w-96">
                                <Form
                                    showAnatomy
                                    isDisabled
                                    onSubmit={() => {}}
                                    actions={(
                                        <FormActions
                                            items={[
                                                { key: "cancel", label: "Cancel", variant: "secondary" },
                                                { key: "save", label: "Save changes" },
                                            ]}
                                        />
                                    )}
                                >
                                    <FormSection title="Account" description="Only an administrator can edit this profile.">
                                        <AccountFields />
                                    </FormSection>
                                </Form>
                            </div>
                        ),
                    },
                ]}
            />
        )
        return <div className="p-8"><Demo /></div>
    },
}
