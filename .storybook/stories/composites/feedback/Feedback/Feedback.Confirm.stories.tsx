import React from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Feedback } from "@sb-components/composites/feedback/Feedback/Feedback"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

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
 *
 * DEPS thật: `Footer` — khung tự dựng `Button.Group` (data-driven `items`, không
 * phải node caller đưa vào) nên bấm nhảy được sang story của nó. `Header`/`Body`
 * chỉ bọc chữ (`AlertDialog.Heading`/`Typography.Base`) — ruột, không phải deps.
 */
const meta: Meta<typeof Feedback.Confirm> = {
    title: "Composites/Feedback/Feedback/Feedback.Confirm",
    component: Feedback.Confirm,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Feedback.Confirm>

/** Node THẬT duy nhất có story khác để nhảy tới: Footer luôn là `Button.Group` (khung tự dựng, data-driven). */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Footer: {
        tier: "atom",
        role: "Cancel (secondary) + Confirm (primary/danger), right-aligned — always a Button.Group",
        storyId: "atoms-buttons-button-button-group--default",
    },
}

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
                tier="composite"
                leaf="Default"
                annotate={ANNOTATE}
                reason="The BLOCKING frame: an irreversible action must pause on the same shape everywhere — the question (Header), the consequence (Body), and the two ways out (Footer). Press the trigger to open; the anatomy panel measures the dialog body once it's open."
                code={`<Feedback.Confirm
  isOpen={isOpen}
  onOpenChange={setOpen}
  title="Submit this quiz?"
  description="Once submitted, you won't be able to change your answers until results are in."
  confirmLabel="Submit"
  onConfirm={submit}
/>`}
            >
                <Demo
                    triggerLabel="Submit"
                    title="Submit this quiz?"
                    description="Once submitted, you won't be able to change your answers until results are in."
                    confirmLabel="Submit"
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
                tier="composite"
                leaf="Danger"
                annotate={ANNOTATE}
                note={"`tone=\"danger\"` only swaps the Confirm button's variant — Header/Body/Footer stay the same. Use it for deletes and undo actions."}
                code={`<Feedback.Confirm
  tone="danger"
  title="Delete this submission?"
  confirmLabel="Delete submission"
  …
/>`}
            >
                <Demo
                    tone="danger"
                    triggerLabel="Delete submission"
                    title="Delete this submission?"
                    description="The submission will be permanently deleted and cannot be recovered."
                    confirmLabel="Delete submission"
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
                tier="composite"
                leaf="TitleOnly"
                annotate={ANNOTATE}
                note="Drop `description` and the frame renders NO Body at all (no empty gap left behind) — use this only when the consequence is already clear from the question."
                code={`<Feedback.Confirm
  isOpen
  title="Leave this practice session?"
  confirmLabel="Leave"
  …
/>`}
            >
                <Feedback.Confirm
                    isOpen
                    onOpenChange={() => {}}
                    title="Leave this practice session?"
                    confirmLabel="Leave"
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
                tier="composite"
                leaf="Confirming"
                annotate={ANNOTATE}
                note="`isConfirming`: Footer still shows both buttons — Confirm turns pending (the atom draws its own Spinner), Cancel is disabled, and the dialog does NOT auto-close."
                code={`<Feedback.Confirm
  isOpen
  isConfirming
  tone="danger"
  title="Deleting submission…"
  …
/>`}
            >
                <Feedback.Confirm
                    isOpen
                    onOpenChange={() => {}}
                    tone="danger"
                    title="Deleting submission…"
                    description="The submission is being permanently deleted."
                    confirmLabel="Delete submission"
                    isConfirming
                    onConfirm={() => {}}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}
