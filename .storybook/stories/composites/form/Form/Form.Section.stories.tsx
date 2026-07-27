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

/** Header (Title[+Description]) · Body — các part TRỰC TIẾP của khung (§11a). */
const TITLE_ONLY_PARTS: Array<AnatomyNode> = [
    {
        name: "Header",
        tier: "composite",
        role: "the group's opening block — title only",
        children: [{ name: "Title", tier: "atom", role: "the group title (Typography.Sm medium, §9b)" }],
    },
    { name: "Body", tier: "composite", role: "the field column (`body`/`children`) on the `gap` rhythm" },
]

const WITH_DESCRIPTION_PARTS: Array<AnatomyNode> = [
    {
        name: "Header",
        tier: "composite",
        role: "the group's opening block — title plus description, gap-1 tight (§10b)",
        children: [
            { name: "Title", tier: "atom", role: "the group title (Typography.Sm medium)" },
            { name: "Description", tier: "atom", role: "the group description (Typography.Xs muted, §9a)" },
        ],
    },
    { name: "Body", tier: "composite", role: "the field column (`body`/`children`) on the `gap` rhythm" },
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
                reason="The frame that gathers fields into a NAMED GROUP — layout plus text through the Typography atom (§9c), nothing else. The title here is NOT a field `label`: label, hint, error, and required belong to the form atoms (§12e), and the frame never grows its own."
                code={`<Form.Section title="Billing details">
  <Input.Text label="Company name" isRequired value={company} onValueChange={setCompany} />
  <Input.Text label="Tax code" errorMessage="A tax code must be 10 or 13 digits." value={taxCode} onValueChange={setTaxCode} />
</Form.Section>`}
            >
                <div className="w-96">
                    <Form.Section showAnatomy title="Billing details">
                        <BillingFields />
                    </Form.Section>
                </div>
            </BlockAnatomy>
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
                parts={WITH_DESCRIPTION_PARTS}
                note="`description` opens exactly ONE more node inside Header (gap-1 tight against the title) — the group's own `gap` rhythm does not change."
                code={`<Form.Section
  title="Billing details"
  description="These details are printed on the e-invoice; changing them later means requesting a reissue."
>
  …
</Form.Section>`}
            >
                <div className="w-96">
                    <Form.Section
                        showAnatomy
                        title="Billing details"
                        description="These details are printed on the e-invoice; changing them later means requesting a reissue."
                    >
                        <BillingFields />
                    </Form.Section>
                </div>
            </BlockAnatomy>
        )
        return <div className="p-8"><Demo /></div>
    },
}
