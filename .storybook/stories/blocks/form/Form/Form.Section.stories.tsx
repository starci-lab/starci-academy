import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Input } from "@sb-components/atoms/forms/Input/Input"
import { Form } from "@sb-components/blocks/form/Form/Form"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * KHUNG (layout tier §13) — `Form.Section`: nhóm field CÓ TIÊU ĐỀ. Một khối
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
    title: "Layouts/Form/Form/Form.Section",
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
        tier: "primitive",
        role: "khối đầu nhóm — chỉ còn tiêu đề",
        children: [{ name: "Title", tier: "atom", role: "tiêu đề nhóm (Typography.Sm medium, §9b)" }],
    },
    { name: "Body", tier: "primitive", role: "cột field (`body`/`children`) theo nhịp `gap`" },
]

const WITH_DESCRIPTION_PARTS: Array<AnatomyNode> = [
    {
        name: "Header",
        tier: "primitive",
        role: "khối đầu nhóm — tiêu đề + mô tả, gap-1 tight (§10b)",
        children: [
            { name: "Title", tier: "atom", role: "tiêu đề nhóm (Typography.Sm medium)" },
            { name: "Description", tier: "atom", role: "mô tả nhóm (Typography.Xs muted, §9a)" },
        ],
    },
    { name: "Body", tier: "primitive", role: "cột field (`body`/`children`) theo nhịp `gap`" },
]

/** Fixture field thật — atom tự mang label/hint/errorMessage/isRequired (§12e). */
const BillingFields = () => {
    const [company, setCompany] = useState("StarCi Academy")
    const [taxCode, setTaxCode] = useState("")
    return (
        <>
            <Input.Text label="Tên công ty" isRequired value={company} onValueChange={setCompany} placeholder="Tên trên hoá đơn" />
            <Input.Text
                label="Mã số thuế"
                errorMessage="Mã số thuế phải có 10 hoặc 13 chữ số."
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
                tier="primitive"
                leaf="Default"
                parts={TITLE_ONLY_PARTS}
                reason="Khung gom field thành NHÓM CÓ TÊN — chỉ bố cục + chữ qua atom Typography (§9c). Tiêu đề ở đây KHÔNG phải `label` của field: label/hint/lỗi/required thuộc atom form (§12e), khung không đẻ lại."
                code={`<Form.Section title="Thông tin xuất hoá đơn">
  <Input.Text label="Tên công ty" isRequired value={company} onValueChange={setCompany} />
  <Input.Text label="Mã số thuế" errorMessage="Mã số thuế phải có 10 hoặc 13 chữ số." value={taxCode} onValueChange={setTaxCode} />
</Form.Section>`}
            >
                <div className="w-96">
                    <Form.Section showAnatomy title="Thông tin xuất hoá đơn">
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
                tier="primitive"
                leaf="WithDescription"
                parts={WITH_DESCRIPTION_PARTS}
                note="`description` chỉ mở thêm MỘT node trong Header (gap-1 tight với tiêu đề) — nhịp `gap` của nhóm không đổi."
                code={`<Form.Section
  title="Thông tin xuất hoá đơn"
  description="Thông tin này in trên hoá đơn điện tử, sửa sau sẽ phải xin cấp lại."
>
  …
</Form.Section>`}
            >
                <div className="w-96">
                    <Form.Section
                        showAnatomy
                        title="Thông tin xuất hoá đơn"
                        description="Thông tin này in trên hoá đơn điện tử, sửa sau sẽ phải xin cấp lại."
                    >
                        <BillingFields />
                    </Form.Section>
                </div>
            </BlockAnatomy>
        )
        return <div className="p-8"><Demo /></div>
    },
}
