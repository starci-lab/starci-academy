import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { Form } from "@sb-components/composites/form/Form/Form"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

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
    title: "Composites/Form/Form/Form.Base",
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
    { name: "Body", tier: "composite", role: "the content column (`body`/`children`) — Form.Sections and fields, spaced by `gap`" },
    { name: "Actions", tier: "composite", role: "the button-row slot at the BOTTOM of the form (usually Form.Actions)" },
]

/** Fixture field thật — atom `Input.*` TỰ mang label/hint/required (§12e). */
const AccountFields = () => {
    const [name, setName] = useState("Quang Nguyen")
    const [email, setEmail] = useState("quang@starci.dev")
    return (
        <>
            <Input.Text label="Full name" isRequired value={name} onValueChange={setName} placeholder="Full name" />
            <Input.Text label="Email" hint="Where course notifications are sent." value={email} onValueChange={setEmail} placeholder="you@example.com" />
        </>
    )
}

/** Default — `children` là lối rút gọn của `body`; `actions` là slot riêng ở đáy. */
export const Default: Story = {
    render: () => {
        const Demo = () => (
            <BlockAnatomy
                name="Form.Base"
                tier="composite"
                leaf="Default"
                parts={PARTS}
                reason="The form frame of the layout tier: it builds a real `<form>` (ENTER inside a field submits, a11y), stacks content into a column on the `gap` rhythm (§10c), and keeps one `actions` slot at the bottom. The frame knows nothing about the fields inside — no validation, no values, no errors (that is the block tier); labels and errors come from the form atoms themselves (§12e)."
                code={`<Form.Base
  gap={6}
  onSubmit={() => save()}
  actions={<Form.Actions items={[{ key: "cancel", label: "Cancel", variant: "secondary" }, { key: "save", label: "Save" }]} />}
>
  <Form.Section title="Account">
    <Input.Text label="Full name" isRequired value={name} onValueChange={setName} />
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
                                    { key: "cancel", label: "Cancel", variant: "secondary" },
                                    { key: "save", label: "Save changes" },
                                ]}
                            />
                        )}
                    >
                        <Form.Section title="Account">
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
                tier="composite"
                leaf="Submitting"
                parts={PARTS}
                note="`isDisabled` maps to a native `<fieldset disabled>`, which switches off EVERY control inside (fields and buttons) at once — the frame never threads a flag down to each field."
                code={`<Form.Base
  isDisabled
  actions={<Form.Actions items={[{ key: "cancel", label: "Cancel", variant: "secondary" }, { key: "save", label: "Saving", isPending: true }]} />}
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
                                    { key: "cancel", label: "Cancel", variant: "secondary" },
                                    { key: "save", label: "Saving", isPending: true },
                                ]}
                            />
                        )}
                    >
                        <Form.Section title="Account">
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
                tier="composite"
                leaf="Disabled"
                parts={PARTS}
                note="A static lock: the same `<fieldset disabled>` as Submitting, but no button is pending — the form reads, it just does not act."
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
                                    { key: "cancel", label: "Cancel", variant: "secondary" },
                                    { key: "save", label: "Save changes" },
                                ]}
                            />
                        )}
                    >
                        <Form.Section title="Account" description="Only an administrator can edit this profile.">
                            <AccountFields />
                        </Form.Section>
                    </Form.Base>
                </div>
            </BlockAnatomy>
        )
        return <div className="p-8"><Demo /></div>
    },
}
