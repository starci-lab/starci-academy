import type { Meta, StoryObj } from "@storybook/nextjs"
import { FloppyDiskIcon, XIcon } from "@phosphor-icons/react"
import { Form } from "@sb-components/composites/form/Form/Form"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * COMPOSITE (composite tier §13) — `Form.Actions`: hàng nút cuối form. Là khung DANH
 * SÁCH LẶP nên BẮT BUỘC nhận `items` dữ liệu, CẤM children (§13b) — và nó
 * COMPOSE atom `Button.Group` chứ KHÔNG tự vẽ nút (§13c).
 *
 * ⚠️ PHẠM VI STATE (§12f): state do CHÍNH khung đẻ ra là CĂN NGANG (`align`) và
 * DÍNH ĐÁY (`sticky`). Vai trò/hành vi từng nút (`variant`/`isDisabled`/`icon`)
 * là state của `Atoms/Buttons/Button` — khung chỉ chuyển tiếp qua `items`.
 */
const meta: Meta<typeof Form.Actions> = {
    title: "Composites/Form/Form/Form.Actions",
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
    { name: "Group", tier: "atom", role: "the button row, built from `items` by the atom `Button.Group` (gap-2, a related cluster per §10b)" },
]

/** Cặp nút chuẩn của một form: huỷ (secondary) + lưu (primary). */
const SAVE_ITEMS = [
    { key: "cancel", label: "Huỷ", variant: "secondary" as const, icon: XIcon },
    { key: "save", label: "Lưu thay đổi", icon: FloppyDiskIcon },
]

/**
 * Default — `align`: mép neo của hàng nút. GỘP MỘT LEAF (§14d.2) vì cả ba giá trị
 * cho ra ĐÚNG một cây DOM (Button.Group + 2 nút), chỉ đổi lớp `justify-*` — khác
 * lớp thì là STATE, không phải leaf. Ba giá trị của `align` giờ là ba phần tử của
 * `states[]` thay vì ba bản render xếp tay bằng `AlignSample` (đã xoá, chỉ để xếp
 * state tay).
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Form.Actions"
                tier="composite"
                leaf="Default"
                parts={PARTS}
                renderClassName="w-96"
                reason="This row never hand-rolls its own buttons: it forwards `items` straight down to the atom `Button.Group` and only adds two concepts that belong to the frame itself, horizontal alignment (`align`) and bottom-docking (`sticky`). Because it renders a repeated list of buttons it must take `items` as data, so passing `children` here is forbidden."
                states={[
                    {
                        name: "align = \"end\" (default)",
                        why: "The button cluster sits flush against the row's end edge, with `Huỷ` and `Lưu thay đổi` reading toward that edge. This is the resting alignment most forms want, so a caller who never sets `align` still lands a CTA where the eye expects to find it.",
                        code: `<Form.Actions
    align="end"
    items={[
        { key: "cancel", label: "Huỷ", variant: "secondary", prefixIcon: XIcon },
        { key: "save", label: "Lưu thay đổi", prefixIcon: FloppyDiskIcon },
    ]}
/>`,
                        render: <Form.Actions showAnatomy align="end" items={SAVE_ITEMS} />,
                    },
                    {
                        name: "align = \"start\"",
                        why: "The button cluster keeps its natural width and only slides over to the row's start edge instead of its end edge. This fits a form living in a narrow column read from the left (§3), where anchoring at the end edge would leave a visually detached gap.",
                        code: `<Form.Actions
    align="start"
    items={[
        { key: "cancel", label: "Huỷ", variant: "secondary", prefixIcon: XIcon },
        { key: "save", label: "Lưu thay đổi", prefixIcon: FloppyDiskIcon },
    ]}
/>`,
                        render: <Form.Actions showAnatomy align="start" items={SAVE_ITEMS} />,
                    },
                    {
                        name: "align = \"between\"",
                        why: "The frame stretches the button row to the full width of its container, pushing `Huỷ` to the start edge and `Lưu thay đổi` to the end edge. Spreading the two mismatched actions across both edges reads as an escape route on one side and the committing action on the other, and only the frame can claim the full width the split needs.",
                        code: `<Form.Actions
    align="between"
    items={[
        { key: "cancel", label: "Huỷ", variant: "secondary", prefixIcon: XIcon },
        { key: "save", label: "Lưu thay đổi", prefixIcon: FloppyDiskIcon },
    ]}
/>`,
                        render: <Form.Actions showAnatomy align="between" items={SAVE_ITEMS} />,
                    },
                ]}
            />
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
                tier="composite"
                leaf="Pending"
                parts={PARTS}
                renderClassName="w-96"
                states={[
                    {
                        name: "save item's isPending = true",
                        why: "The save button swaps its label for a spinner and stops accepting presses, while the cancel button next to it stays exactly as it was. This frame never draws the spinner itself, the flag only flows through `items` into `Button.Base`, which already owns its own pending shape.",
                        code: `<Form.Actions
    items={[
        { key: "cancel", label: "Huỷ", variant: "secondary" },
        { key: "save", label: "Đang lưu", isPending: true },
    ]}
/>`,
                        render: (
                            <Form.Actions
                                showAnatomy
                                items={[
                                    { key: "cancel", label: "Huỷ", variant: "secondary" },
                                    { key: "save", label: "Đang lưu", isPending: true },
                                ]}
                            />
                        ),
                    },
                ]}
            />
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
                tier="composite"
                leaf="Sticky"
                parts={PARTS}
                states={[
                    {
                        name: "sticky",
                        why: "The button row grows a top border and an opaque background, then pins itself to the bottom edge of the scrolling container instead of scrolling away with the fields above it. A long form loses its call to action once the user scrolls past it, so docking the row keeps `Lưu thay đổi` reachable at every scroll position.",
                        code: `<div className="h-64 overflow-y-auto">
    <Form.Base actions={<Form.Actions sticky items={[…]} />}>…</Form.Base>
</div>`,
                        render: (
                            <div className="h-64 w-96 overflow-y-auto rounded-3xl border border-default px-3">
                                <div className="flex flex-col gap-3 py-3">
                                    {["Họ và tên", "Email", "Số điện thoại", "Công ty", "Chức danh", "Ghi chú"].map((row) => (
                                        <div key={row} className="h-16 rounded-xl bg-default" aria-hidden />
                                    ))}
                                </div>
                                <Form.Actions showAnatomy sticky items={SAVE_ITEMS} />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
