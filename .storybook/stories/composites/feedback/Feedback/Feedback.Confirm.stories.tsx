import React from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Feedback } from "@sb-components/composites/feedback/Feedback/Feedback"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * COMPOSITE (composite tier) — `Feedback.Confirm`: vỏ dialog CHẶN ĐƯỜNG cho hành động
 * không lùi được (huỷ ghi danh, xoá bài nộp). Composite dựng sẵn Header/Body/Footer;
 * nội dung đi bằng `title`/`description` + nhãn hai nút — KHÔNG mở `children`
 * (vỏ đã cố định hình, §13b).
 *
 * Composite THUẦN trình bày: `isOpen` + mọi callback vào bằng prop. Nút Xác nhận KHÔNG
 * tự đóng dialog — caller đóng qua `onOpenChange` sau khi hành động xong (nên
 * `isConfirming` mới giữ được dialog mở trong lúc chờ).
 *
 * ⚠️ PHẠM VI STATE (§12f): chỉ render state do CHÍNH composite đẻ — có/không
 * `description`, `tone`, `isConfirming`. Spinner/disabled của từng nút là state
 * của `Button.*` (story atom), ở đây chỉ xem hệ quả ở tầng composite.
 *
 * Cây DOM thật là HeroUI `AlertDialog` NGUYÊN CON (`Backdrop → Container → Dialog →
 * Header[→Heading] · Body[→Typography.Base] · Footer[→Button.Base × 2]`) — tier
 * `heroui` cho mọi node của thư viện (2026-07-28, LUẬT node = tên component thật).
 * `Footer` forward `showAnatomy` xuống `Button.Group` nên hai nút THẬT
 * (`Button.Base`) hiện ra, thay vì dán nhãn "Footer" giả làm chính `Button.Group`.
 *
 * 2026-07-27: di trú toàn bộ leaf sang API `states[]` (§8/§4a).
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

/**
 * Cây thật: mọi tầng khung là component HEROUI (`AlertDialog.*`, tier `heroui`, không
 * `storyId` — không có story riêng của ta để trỏ sang). Node CÓ story riêng để bấm
 * nhảy là `Typography.Base` (mô tả) và `Button.Base` (hai nút, do `Button.Group` dựng).
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "AlertDialog.Backdrop": { tier: "heroui", role: "the modal overlay/backdrop." },
    "AlertDialog.Container": { tier: "heroui", role: "sizes and places the dialog (`size=\"sm\"`)." },
    "AlertDialog.Dialog": { tier: "heroui", role: "the dialog surface itself." },
    "AlertDialog.Header": { tier: "heroui", role: "wraps the heading." },
    "AlertDialog.Heading": { tier: "heroui", role: "the question text (`title`)." },
    "AlertDialog.Body": { tier: "heroui", role: "wraps the consequence line — only when `description` is set." },
    "Typography.Base": {
        tier: "atom",
        role: "the consequence sentence under the question",
        storyId: "atoms-text-typography-typography-base--colors",
    },
    "AlertDialog.Footer": { tier: "heroui", role: "wraps the button row." },
    "Button.Base": {
        tier: "atom",
        role: "Cancel (secondary) plus Confirm (primary or danger), right-aligned — built by `Button.Group`, which is not itself a DOM node.",
        storyId: "atoms-buttons-button-button-base--variants",
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
                reason="The blocking frame: an irreversible action must pause on the same shape everywhere, the question in the Header, the consequence in the Body, and the two ways out in the Footer. Press the trigger to open; the anatomy panel measures the dialog body once it is open."
                states={[
                    {
                        name: "tone = \"default\", description set",
                        why: "The dialog shows a Header question, a Body consequence sentence, and a Footer with Cancel and a primary Confirm button. This tone is for a choice that does not destroy anything, which is why Confirm stays primary rather than danger.",
                        code: `<Feedback.Confirm
    isOpen={isOpen}
    onOpenChange={setOpen}
    title="Submit this quiz?"
    description="Once submitted, you won't be able to change your answers until results are in."
    confirmLabel="Submit"
    onConfirm={submit}
/>`,
                        render: (
                            <Demo
                                triggerLabel="Submit"
                                title="Submit this quiz?"
                                description="Once submitted, you won't be able to change your answers until results are in."
                                confirmLabel="Submit"
                            />
                        ),
                    },
                ]}
            />
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
                states={[
                    {
                        name: "tone = \"danger\"",
                        why: "Only the Confirm button's variant swaps to danger, while Header, Body, and Footer keep the exact same composition as the Default leaf. This tone is for deletes and undo actions, where the button's colour is the one signal that this choice cannot be walked back.",
                        code: `<Feedback.Confirm
    tone="danger"
    title="Delete this submission?"
    confirmLabel="Delete submission"
    …
/>`,
                        render: (
                            <Demo
                                tone="danger"
                                triggerLabel="Delete submission"
                                title="Delete this submission?"
                                description="The submission will be permanently deleted and cannot be recovered."
                                confirmLabel="Delete submission"
                            />
                        ),
                    },
                ]}
            />
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
                states={[
                    {
                        name: "description not set",
                        why: "The Body node disappears entirely, leaving only the Header question and the Footer buttons, with no empty gap left where the Body would have been. Drop description only when the consequence is already obvious from the question alone.",
                        code: `<Feedback.Confirm
    isOpen
    title="Leave this practice session?"
    confirmLabel="Leave"
    …
/>`,
                        render: (
                            <Feedback.Confirm
                                isOpen
                                onOpenChange={() => {}}
                                title="Leave this practice session?"
                                confirmLabel="Leave"
                                onConfirm={() => {}}
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
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
                states={[
                    {
                        name: "isConfirming = true, tone = \"danger\"",
                        why: "Both Footer buttons still render, but Confirm turns pending with its own spinner and Cancel becomes disabled, while the dialog stays open rather than auto-closing. Keeping the dialog open during the async action is what lets isConfirming show the reader their delete is actually in flight.",
                        code: `<Feedback.Confirm
    isOpen
    isConfirming
    tone="danger"
    title="Deleting submission…"
    …
/>`,
                        render: (
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
                        ),
                    },
                ]}
            />
        </div>
    ),
}
