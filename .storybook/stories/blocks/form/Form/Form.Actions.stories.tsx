import type { Meta, StoryObj } from "@storybook/nextjs"
import { FloppyDisk, Xmark } from "@gravity-ui/icons"
import { Form } from "@sb-components/layouts/form/Form/Form"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * KHUNG (layout tier §13) — `Form.Actions`: hàng nút cuối form. Là khung DANH
 * SÁCH LẶP nên BẮT BUỘC nhận `items` dữ liệu, CẤM children (§13b) — và nó
 * COMPOSE atom `Button.Group` chứ KHÔNG tự vẽ nút (§13c).
 *
 * ⚠️ PHẠM VI STATE (§12f): state do CHÍNH khung đẻ ra là CĂN NGANG (`align`) và
 * DÍNH ĐÁY (`sticky`). Vai trò/hành vi từng nút (`variant`/`isDisabled`/`icon`)
 * là state của `Atoms/Buttons/Button` — khung chỉ chuyển tiếp qua `items`.
 */
const meta: Meta<typeof Form.Actions> = {
    title: "Layouts/Form/Form/Form.Actions",
    component: Form.Actions,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Form.Actions>

/** Con TRỰC TIẾP duy nhất = atom `Button.Group` (khung chỉ căn ngang + chrome dính đáy). */
const PARTS: Array<AnatomyNode> = [
    { name: "Group", tier: "atom", role: "hàng nút — atom Button.Group dựng từ `items` (gap-2 related, §10b)" },
]

/** Cặp nút chuẩn của một form: huỷ (secondary) + lưu (primary). */
const SAVE_ITEMS = [
    { key: "cancel", label: "Huỷ", variant: "secondary" as const, icon: Xmark },
    { key: "save", label: "Lưu thay đổi", icon: FloppyDisk },
]

/** Default — căn PHẢI (`align="end"`): CTA nằm ở mép kết thúc của form. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Form.Actions"
                tier="primitive"
                leaf="Default"
                parts={PARTS}
                reason="Hàng nút cuối form. Khung KHÔNG hand-roll nút (§13c) — nó chuyển `items` thẳng xuống atom `Button.Group` và chỉ thêm hai khái niệm KHUNG thật: căn ngang (`align`) và dính đáy (`sticky`). Danh sách lặp ⇒ `items` dữ liệu, cấm children (§13b)."
                code={`<Form.Actions
  items={[
    { key: "cancel", label: "Huỷ", variant: "secondary", icon: Xmark },
    { key: "save", label: "Lưu thay đổi", icon: FloppyDisk },
  ]}
/>`}
            >
                <div className="w-96">
                    <Form.Actions showAnatomy items={SAVE_ITEMS} />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** AlignStart — căn TRÁI: dùng khi form nằm trong một cột hẹp đọc từ trái (§3). */
export const AlignStart: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Form.Actions"
                tier="primitive"
                leaf="AlignStart"
                parts={PARTS}
                note="`align='start'` → `justify-start`; cụm nút giữ nguyên bề rộng nội tại, chỉ đổi mép neo."
                code={`<Form.Actions
  align="start"
  items={[…]}
/>`}
            >
                <div className="w-96">
                    <Form.Actions showAnatomy align="start" items={SAVE_ITEMS} />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * AlignBetween — đẩy HAI mép: lối thoát (huỷ) bên trái, CTA bên phải. Khung phải
 * cho cụm nút chiếm hết bề ngang mới đẩy ra được — đó là việc của khung, không
 * phải của atom.
 */
export const AlignBetween: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Form.Actions"
                tier="primitive"
                leaf="AlignBetween"
                parts={PARTS}
                note="`align='between'` → khung truyền `w-full justify-between` xuống Button.Group: huỷ dạt trái, CTA dạt phải."
                code={`<Form.Actions
  align="between"
  items={[…]}
/>`}
            >
                <div className="w-96">
                    <Form.Actions showAnatomy align="between" items={SAVE_ITEMS} />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Pending — nút chính đang chạy.
 *
 * ⚠️ GHI CHÚ §12f: `isPending` KHÔNG do khung này đẻ ra — nó chỉ chuyển tiếp qua
 * `items` xuống `Button.Base` (state đã có "nhà" ở `Atoms/Buttons/Button.Base`).
 * Giữ story theo yêu cầu spec nhóm 5 để thấy hàng nút lúc submit; nếu áp §12f
 * nghiêm (neo: `Button.Group` đã bị bắt xoá `Pending`) thì XOÁ story này và xem
 * trạng thái submit ở `Form.Base` → `Submitting`.
 */
export const Pending: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Form.Actions"
                tier="primitive"
                leaf="Pending"
                parts={PARTS}
                note="Chuyển tiếp `isPending` xuống item — Button.Base tự vẽ Spinner + khoá press. Khung không đổi bố cục."
                code={`<Form.Actions
  items={[
    { key: "cancel", label: "Huỷ", variant: "secondary" },
    { key: "save", label: "Đang lưu", isPending: true },
  ]}
/>`}
            >
                <div className="w-96">
                    <Form.Actions
                        showAnatomy
                        items={[
                            { key: "cancel", label: "Huỷ", variant: "secondary" },
                            { key: "save", label: "Đang lưu", isPending: true },
                        ]}
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Sticky — form dài trong khung cuộn: hàng nút DÍNH đáy với vạch ngăn + nền đặc,
 * để CTA luôn với tới được. Đặt trong một khung cuộn thật thì mới đọc ra ý nghĩa.
 */
export const Sticky: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Form.Actions"
                tier="primitive"
                leaf="Sticky"
                parts={PARTS}
                note="`sticky` → `sticky bottom-0` + `border-t` + nền đặc: chrome của KHUNG (không đổi API nút). Cuộn thử khung bên dưới để thấy hàng nút đứng yên ở đáy."
                code={`<div className="h-64 overflow-y-auto">
  <Form.Base actions={<Form.Actions sticky items={[…]} />}>…</Form.Base>
</div>`}
            >
                <div className="h-64 w-96 overflow-y-auto rounded-3xl border border-default px-3">
                    <div className="flex flex-col gap-3 py-3">
                        {["Họ và tên", "Email", "Số điện thoại", "Công ty", "Chức danh", "Ghi chú"].map((row) => (
                            <div key={row} className="h-16 rounded-xl bg-default" aria-hidden />
                        ))}
                    </div>
                    <Form.Actions showAnatomy sticky items={SAVE_ITEMS} />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
