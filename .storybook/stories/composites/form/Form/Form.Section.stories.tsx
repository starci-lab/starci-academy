import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { Form } from "@sb-components/composites/form/Form/Form"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * KHUNG (composite tier §13) — `Form.Section`: nhóm field CÓ TIÊU ĐỀ. Một khối
 * header (tiêu đề + mô tả tuỳ chọn, `gap-1` tight vì là một CẶP) rồi tới cột
 * field theo nhịp `gap` (§10c).
 *
 * ⚠️ PHẠM VI STATE (§12f): khung này chỉ đẻ ra HAI hình — có `description` và
 * không. Nhãn/hint/lỗi/required của từng field là state của atom
 * (`Atoms/Forms/Input/*`, §12e) — khung KHÔNG đụng tới, nên KHÔNG có story
 * `Error`/`Required` ở đây. Field `errorMessage` xuất hiện trong fixture chỉ để
 * cho thấy khung để yên cho atom tự lo dòng lỗi.
 */
const meta: Meta<typeof Form.Section> = {
    title: "Composites/Form/Form/Form.Section",
    component: Form.Section,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Form.Section>

/**
 * Chỉ khai `Typography.Base` — component THẬT duy nhất của khung này có story
 * riêng để trỏ sang. Khung KHÔNG badge `Header`/`Body` nữa (2026-07-28, §11a.1
 * LOẠI 2/3): `Header` chỉ là div gom title+description mà chính hai
 * `Typography.Base` bên dưới đã nói hết, còn `Body` bọc field TUỲ Ý caller đưa
 * vào — cả hai không có MỘT component cố định để trỏ sang, nên component đã bỏ
 * hẳn hai badge này; `Typography.Base` nổi lên thành node gốc thay vì con của
 * `Header`.
 */
const TITLE_ONLY_PARTS: Array<AnatomyNode> = [
    {
        name: "Typography.Base",
        tier: "atom",
        role: "the group title (Sm medium, §9b)",
        storyId: "atoms-text-typography-typography-base--bold",
    },
]

const WITH_DESCRIPTION_PARTS: Array<AnatomyNode> = [
    {
        name: "Typography.Base",
        tier: "atom",
        role: "the title (Sm medium) and the description (Xs muted, §9a) — same real component, two props",
        storyId: "atoms-text-typography-typography-base--colors",
    },
]

/** Fixture field thật — atom tự mang label/hint/errorMessage/isRequired (§12e). */
const BillingFields = () => {
    const [company, setCompany] = useState("StarCi Academy")
    const [taxCode, setTaxCode] = useState("")
    return (
        <>
            <Input.Text label="Company name" isRequired value={company} onValueChange={setCompany} placeholder="Name printed on the invoice" />
            <Input.Text
                label="Tax code"
                errorMessage="A tax code must be 10 or 13 digits."
                value={taxCode}
                onValueChange={setTaxCode}
                placeholder="0123456789"
            />
        </>
    )
}

/** Default — chỉ tiêu đề: nhóm field không cần giải thích thêm. */
export const Default: Story = {
    render: () => {
        const Demo = () => (
            <BlockAnatomy
                name="Form.Section"
                tier="composite"
                leaf="Default"
                parts={TITLE_ONLY_PARTS}
                reason="The frame that gathers fields into a named group draws layout plus text through the Typography atom (§9c) and nothing else. The title here is not a field `label`; label, hint, error, and required all belong to the form atoms (§12e), and the frame never grows its own copy of them."
                states={[
                    {
                        name: "description unset",
                        why: "The Header block carries only the Title node, so the group opens with a single line before the field column starts. This is the shape a group reaches for when its title already says everything the reader needs.",
                        code: `<Form.Section title="Billing details">
  <Input.Text label="Company name" isRequired value={company} onValueChange={setCompany} />
  <Input.Text label="Tax code" errorMessage="A tax code must be 10 or 13 digits." value={taxCode} onValueChange={setTaxCode} />
</Form.Section>`,
                        render: (
                            <div className="w-96">
                                <Form.Section showAnatomy title="Billing details">
                                    <BillingFields />
                                </Form.Section>
                            </div>
                        ),
                    },
                ]}
            />
        )
        return <div className="p-8"><Demo /></div>
    },
}

/** WithDescription — thêm dòng mô tả muted dưới tiêu đề (ngữ cảnh cho cả nhóm). */
export const WithDescription: Story = {
    render: () => {
        const Demo = () => (
            <BlockAnatomy
                name="Form.Section"
                tier="composite"
                leaf="WithDescription"
                states={[
                    {
                        name: "description = \"These details are printed on the e-invoice...\"",
                        why: "Passing `description` opens exactly one more node inside Header, a muted line sitting on a tight `gap-1` under the title. The group's own `gap` rhythm toward the field column below does not change, because the new line only grows the header block.",
                        code: `<Form.Section
  title="Billing details"
  description="These details are printed on the e-invoice; changing them later means requesting a reissue."
>
  …
</Form.Section>`,
                        render: (
                            <div className="w-96">
                                <Form.Section
                                    showAnatomy
                                    title="Billing details"
                                    description="These details are printed on the e-invoice; changing them later means requesting a reissue."
                                >
                                    <BillingFields />
                                </Form.Section>
                            </div>
                        ),
                    },
                ]}
                parts={WITH_DESCRIPTION_PARTS}
            />
        )
        return <div className="p-8"><Demo /></div>
    },
}
