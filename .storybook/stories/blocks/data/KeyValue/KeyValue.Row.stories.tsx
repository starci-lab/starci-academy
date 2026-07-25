import type { Meta, StoryObj } from "@storybook/nextjs"
import { KeyValue } from "@sb-components/layouts/data/KeyValue/KeyValue"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ⚠️ PHẠM VI STATE (§12f/§13) — `KeyValue.Row` sở hữu HÌNH THÁI của MỘT cặp
 * nhãn–giá trị: nhãn (+`hint`) trái, giá trị phải, và bậc NHẤN `emphasis` cho dòng
 * tổng. Ba state đó sinh ra từ chính prop của nó → nằm hết ở đây.
 *
 * `divider` KHÔNG có story riêng ở đây: đường kẻ là một SEAM GIỮA hai hàng, chỉ có
 * nghĩa khi hàng nằm trong danh sách — nhà của nó là `KeyValue.List` (ở đó list
 * quyết định hàng cuối không kẻ). Đây đúng là test §12f: "state này do prop của
 * CHÍNH nó sinh ra, hay chỉ có nghĩa ở cấp trên?".
 *
 * Khung KHÔNG format: `value` dưới đây là chuỗi ĐÃ format sẵn (`"1.200.000 ₫"`),
 * không phải số để khung tự đổi đơn vị.
 */
const meta: Meta<typeof KeyValue.Row> = {
    title: "Layouts/Data/KeyValue/KeyValue.Row",
    component: KeyValue.Row,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof KeyValue.Row>

/**
 * ANATOMY IS PER-LEAF. Hàng compose THẲNG atom `Typography.*` (§9 — chữ đi qua
 * atom, không rải `text-*`/`font-*`): `Label` (muted) · `Value` (medium,
 * `tabular-nums`). `Hint` chỉ tồn tại ở leaf thực sự truyền `hint`.
 */
const ROW_PARTS: Array<AnatomyNode> = [
    { name: "Label", tier: "atom", role: "Typography.Sm muted — tên của giá trị (§9a chữ PHỤ)" },
    { name: "Value", tier: "atom", role: "Typography.Sm medium + tabular-nums — node ĐÃ format" },
]
const HINT_PARTS: Array<AnatomyNode> = [
    { name: "Label", tier: "atom", role: "Typography.Sm muted" },
    { name: "Hint", tier: "atom", role: "Typography.Xs muted — dòng phụ dưới nhãn, gap-1 (§10 tight)" },
    { name: "Value", tier: "atom", role: "Typography.Sm medium + tabular-nums" },
]
const EMPHASIS_PARTS: Array<AnatomyNode> = [
    { name: "Label", tier: "atom", role: "Typography.Sm foreground + medium (nhãn hàng tổng)" },
    { name: "Value", tier: "atom", role: "Typography.Base BOLD + tabular-nums (số lớn, §9b)" },
]

/** Default — nhãn muted trái, giá trị medium phải; `justify-between` giữ hai mép. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="KeyValue.Row"
                tier="primitive"
                leaf="Default"
                parts={ROW_PARTS}
                reason="Khung của một đơn-vị-ngữ-nghĩa: 'một cái tên, một con số'. Nó chỉ bố trí + phân cấp chữ qua atom Typography (nhãn muted / giá trị medium, §9), KHÔNG format và KHÔNG tính toán — `value` là node consumer đưa vào đã format sẵn."
                code={"<KeyValue.Row label=\"Học phí\" value=\"1.200.000 ₫\" />"}
            >
                <div className="max-w-sm">
                    <KeyValue.Row showAnatomy label="Học phí" value="1.200.000 ₫" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** WithHint — `hint` là dòng phụ DƯỚI nhãn (điều kiện/đơn vị), cụm khít gap-1. */
export const WithHint: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="KeyValue.Row"
                tier="primitive"
                leaf="WithHint"
                parts={HINT_PARTS}
                note="`hint` thuộc về CỘT NHÃN (không phải cột giá trị) nên nó xếp dọc dưới `Label` với `gap-1` (§10b `tight`); giá trị vẫn neo `items-start` ở mép phải, không bị kéo xuống giữa."
                code={`<KeyValue.Row
  label="Giảm giá"
  hint="Áp dụng đến 31/12"
  value="-200.000 ₫"
/>`}
            >
                <div className="max-w-sm">
                    <KeyValue.Row showAnatomy label="Giảm giá" hint="Áp dụng đến 31/12" value="-200.000 ₫" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Emphasis — bậc NHẤN cho dòng tổng: nhãn lên foreground medium, giá trị lên base bold. */
export const Emphasis: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="KeyValue.Row"
                tier="primitive"
                leaf="Emphasis"
                parts={EMPHASIS_PARTS}
                note="`emphasis` chỉ đổi BẬC CHỮ (§9: nhãn muted→foreground medium, giá trị sm-medium→base-bold) — KHÔNG đổi cấu trúc, không tự cộng tổng. Con số vẫn do consumer đưa vào."
                code={"<KeyValue.Row emphasis label=\"Tổng cộng\" value=\"1.000.000 ₫\" />"}
            >
                <div className="max-w-sm">
                    <KeyValue.Row showAnatomy emphasis label="Tổng cộng" value="1.000.000 ₫" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
