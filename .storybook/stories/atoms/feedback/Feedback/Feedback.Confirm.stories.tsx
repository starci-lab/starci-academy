import React from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Feedback } from "@sb-components/layouts/feedback/Feedback/Feedback"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * KHUNG (layout tier) — `Feedback.Confirm`: vỏ dialog CHẶN ĐƯỜNG cho hành động
 * không lùi được (huỷ ghi danh, xoá bài nộp). Khung dựng sẵn Header/Body/Footer;
 * nội dung đi bằng `title`/`description` + nhãn hai nút — KHÔNG mở `children`
 * (vỏ đã cố định hình, §13b).
 *
 * Khung THUẦN trình bày: `isOpen` + mọi callback vào bằng prop. Nút Xác nhận KHÔNG
 * tự đóng dialog — caller đóng qua `onOpenChange` sau khi hành động xong (nên
 * `isConfirming` mới giữ được dialog mở trong lúc chờ).
 *
 * ⚠️ PHẠM VI STATE (§12f): chỉ render state do CHÍNH khung đẻ — có/không
 * `description`, `tone`, `isConfirming`. Spinner/disabled của từng nút là state
 * của `Button.*` (story atom), ở đây chỉ xem hệ quả ở tầng khung.
 */
const meta: Meta<typeof Feedback.Confirm> = {
    title: "Layouts/Feedback/Feedback/Feedback.Confirm",
    component: Feedback.Confirm,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Feedback.Confirm>

const HEADER: AnatomyNode = { name: "Header", tier: "primitive", role: "AlertDialog.Heading — câu hỏi/khẳng định điều sắp xảy ra" }
const BODY: AnatomyNode = { name: "Body", tier: "primitive", role: "mô tả HỆ QUẢ (muted, body-sm) để lựa chọn là có hiểu biết" }
const FOOTER: AnatomyNode = { name: "Footer", tier: "primitive", role: "atom `Button.Group`: Huỷ (secondary) + Xác nhận (primary/danger), canh phải" }

const PARTS: Array<AnatomyNode> = [HEADER, BODY, FOOTER]
const TITLE_ONLY_PARTS: Array<AnatomyNode> = [HEADER, FOOTER]

/**
 * Controlled trigger wrapper — nút mở dialog để nội dung hiện ra trên canvas
 * (Confirm là overlay). Dialog tự đóng khi Huỷ / Xác nhận qua `onOpenChange`.
 */
const Demo = ({
    tone = "default",
    triggerLabel,
    title,
    description,
    confirmLabel,
}: {
    tone?: "default" | "danger"
    triggerLabel: string
    title: ReactNode
    description?: ReactNode
    confirmLabel?: string
}) => {
    const [isOpen, setOpen] = React.useState(false)
    return (
        <>
            <Button.Base
                label={triggerLabel}
                variant={tone === "danger" ? "danger" : "primary"}
                onPress={() => setOpen(true)}
            />
            <Feedback.Confirm
                isOpen={isOpen}
                onOpenChange={setOpen}
                tone={tone}
                title={title}
                description={description}
                confirmLabel={confirmLabel}
                onConfirm={() => setOpen(false)}
                showAnatomy
            />
        </>
    )
}

/** Xác nhận thường: tone mặc định, nút Xác nhận primary — lựa chọn không phá huỷ gì. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Confirm"
                tier="primitive"
                leaf="Default"
                parts={PARTS}
                reason="Khung CHẶN ĐƯỜNG: hành động không lùi được phải có một nhịp dừng có cùng hình ở mọi surface — câu hỏi (Header) · hệ quả (Body) · hai lối đi (Footer). Bấm nút trigger để mở; panel anatomy đo phần thân dialog khi mở."
                code={`<Feedback.Confirm
  isOpen={isOpen}
  onOpenChange={setOpen}
  title="Nộp bài kiểm tra này?"
  description="Nộp rồi sẽ không sửa được đáp án cho tới khi có kết quả."
  confirmLabel="Nộp bài"
  onConfirm={submit}
/>`}
            >
                <Demo
                    triggerLabel="Nộp bài"
                    title="Nộp bài kiểm tra này?"
                    description="Nộp rồi sẽ không sửa được đáp án cho tới khi có kết quả."
                    confirmLabel="Nộp bài"
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `tone="danger"` — xoá / hoàn tác: nút Xác nhận chuyển sang danger, composition không đổi. */
export const Danger: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Confirm"
                tier="primitive"
                leaf="Danger"
                parts={PARTS}
                note={"`tone=\"danger\"` CHỈ đổi variant nút Xác nhận — Header/Body/Footer giữ nguyên. Dùng đúng cho xoá/hoàn tác (§ConfirmDialog danger)."}
                code={`<Feedback.Confirm
  tone="danger"
  title="Xoá bài nộp này?"
  confirmLabel="Xoá bài nộp"
  …
/>`}
            >
                <Demo
                    tone="danger"
                    triggerLabel="Xoá bài nộp"
                    title="Xoá bài nộp này?"
                    description="Bài nộp sẽ bị xoá vĩnh viễn và không khôi phục được."
                    confirmLabel="Xoá bài nộp"
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Biên: không `description` → Body biến mất, khung còn Header + Footer. */
export const TitleOnly: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Confirm"
                tier="primitive"
                leaf="TitleOnly"
                parts={TITLE_ONLY_PARTS}
                note="Bỏ `description` → khung KHÔNG render Body (không để một vùng trống) — chỉ dùng khi hệ quả đã nằm gọn trong câu hỏi."
                code={`<Feedback.Confirm
  isOpen
  title="Thoát khỏi phiên luyện tập?"
  confirmLabel="Thoát"
  …
/>`}
            >
                <Feedback.Confirm
                    isOpen
                    onOpenChange={() => {}}
                    title="Thoát khỏi phiên luyện tập?"
                    confirmLabel="Thoát"
                    onConfirm={() => {}}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `isConfirming` — hành động đang chạy: nút Xác nhận quay spinner, nút Huỷ khoá, dialog vẫn mở. */
export const Confirming: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Feedback.Confirm"
                tier="primitive"
                leaf="Confirming"
                parts={PARTS}
                note="`isConfirming`: Footer vẫn đủ 2 nút — Xác nhận sang pending (atom tự vẽ Spinner), Huỷ bị disable, dialog KHÔNG tự đóng."
                code={`<Feedback.Confirm
  isOpen
  isConfirming
  tone="danger"
  title="Đang xoá bài nộp…"
  …
/>`}
            >
                <Feedback.Confirm
                    isOpen
                    onOpenChange={() => {}}
                    tone="danger"
                    title="Đang xoá bài nộp…"
                    description="Bài nộp đang được xoá vĩnh viễn."
                    confirmLabel="Xoá bài nộp"
                    isConfirming
                    onConfirm={() => {}}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}
