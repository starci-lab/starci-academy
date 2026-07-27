import React from "react"
import type { ReactNode } from "react"
import { cn, Modal } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `ModalShell.*`, the dialog-scaffold KHUNG
 * namespace (thầy 2026-07-25, canon §13a). Authored in Storybook (not `src`);
 * synced to `src` later. No `@/components` imports (design-spec ports stay
 * self-contained).
 *
 * KHUNG API LAW (§13b): `.Base` is a WRAPPER frame → the named slots
 * `header`/`body`/`footer` are the main road, `children` stays as shorthand
 * for `body`. `footer` is a REAL slot now (rendered as HeroUI `Modal.Footer`)
 * — before this refactor every caller hand-rolled a
 * `<div className="flex justify-end gap-2">` CTA row INSIDE the body, which is
 * exactly the "nhét nhiều thứ vào 1 chỗ" the slot law exists to stop.
 * Nothing here repeats, so no `items` member. Namespace only — no bare
 * component export.
 *
 * A tier-3 presentational frame — it owns no state of its own; the caller
 * threads open/close state plus the header and body content via props.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link ModalShell.Base}. */
export interface ModalShellBaseProps {
    /** Whether the modal is currently open. Forwarded to HeroUI `<Modal>`. */
    isOpen: boolean
    /**
     * Open-state change handler (fires on backdrop click, Escape, and the
     * close-trigger button). Forwarded to HeroUI `<Modal>`.
     */
    onOpenChange: (open: boolean) => void
    /**
     * Simple title string/node rendered as HeroUI {@link Typography}
     * (`type="body"` `weight="bold"`). With optional {@link description}, both
     * sit in one `pr-8` stack (room for the close button). Ignored when
     * {@link header} is provided. Omit title/header to render no header at all.
     */
    title?: ReactNode
    /**
     * Explanatory copy under {@link title} (`Typography` `body-sm` muted). Part
     * of the simple header path. Ignored when {@link header} is provided, or when
     * {@link title} is omitted.
     */
    description?: ReactNode
    /** Extra classes on the default title/description wrapper (only with {@link title}). */
    titleClassName?: string
    /**
     * Full custom header content — use instead of {@link title}/{@link description}
     * for a non-standard header. Takes precedence over both.
     */
    header?: ReactNode
    /** Body content of the modal. Equivalent to `children`; wins over it when both are passed. */
    body?: ReactNode
    /**
     * Bottom action row of the dialog (the CTA cluster). Rendered as HeroUI
     * `Modal.Footer`, which already lays it out `flex flex-row items-center
     * justify-end gap-2` — pass the buttons bare, do NOT re-wrap them in a
     * flex row.
     */
    footer?: ReactNode
    /** Shorthand for {@link ModalShellBaseProps.body} — a wrapper frame wraps anything. */
    children?: ReactNode
    /** Size of the underlying `Modal.Container` (dialog width). */
    size?: React.ComponentProps<typeof Modal.Container>["size"]
    /**
     * Scroll behavior of the underlying `Modal.Container`. Use `"inside"` when
     * the body is longer than the viewport — header stays put, body scrolls.
     * When set, the container also gets `max-h-[85vh]`.
     */
    scroll?: React.ComponentProps<typeof Modal.Container>["scroll"]
    /** Extra classes merged onto `Modal.Container` (merged after the `scroll="inside"` max-height default). */
    containerClassName?: string
    /** Extra classes merged onto `Modal.Dialog`, in addition to {@link className}. */
    dialogClassName?: string
    /** Extra classes merged onto `Modal.Body`. */
    bodyClassName?: string
    /** Extra classes merged onto `Modal.Footer`. */
    footerClassName?: string
    /** Extra classes merged onto `Modal.Dialog`. */
    className?: string
    /**
     * When `true`, each composed part (close trigger / header / body / footer)
     * emits `data-anat-part="<name>"` so a BlockAnatomy panel can badge it
     * on-render. Off by default (production).
     */
    showAnatomy?: boolean
}

/**
 * Shared modal scaffold: `Modal > Backdrop > Container > Dialog > CloseTrigger
 * + Header? + Body + Footer?`. Extracted so each modal only supplies its
 * open-state, header content, body, and action row.
 *
 * @param props - See {@link ModalShellBaseProps}.
 */
const Base = ({
    isOpen,
    onOpenChange,
    title,
    description,
    titleClassName,
    header,
    body,
    footer,
    size,
    scroll,
    containerClassName,
    dialogClassName,
    bodyClassName,
    footerClassName,
    className,
    children,
    showAnatomy = false,
}: ModalShellBaseProps) => {
    const hasHeader = header != null || title != null
    const main = body ?? children
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container
                    className={cn(scroll === "inside" && "max-h-[85vh]", containerClassName)}
                    scroll={scroll}
                    size={size}
                >
                    {/* ⭐ Cha giữ nhịp (thầy chốt (a), 2026-07-27). Dialog vốn ĐÃ là flex nhưng
                        `rowGap: normal`, nên seam phải do con tự đẩy bằng `mt-*!` — mà `!` là để
                        đè CSS của HeroUI (`.modal__header + .modal__body { mt-2 }`, `mt-5` trước
                        footer), không phải để giành với cha.
                        Nay `gap-4` ở đây + `mt-0!` ở con: MỘT seam, MỘT chủ (§10a). */}
                    <Modal.Dialog className={cn("gap-3", dialogClassName, className)}>
                        <Modal.CloseTrigger data-anat-part={showAnatomy ? "Modal.CloseTrigger" : undefined} />
                        {header ? (
                            <Modal.Header data-anat-part={showAnatomy ? "Modal.Header" : undefined}>{header}</Modal.Header>
                        ) : title != null ? (
                            <Modal.Header>
                                <div className={cn("flex flex-col gap-1 pr-8", titleClassName)}>
                                    <Typography.Base
                                        weight="bold"
                                        showAnatomy={showAnatomy}
                                        anatPart={showAnatomy ? "Typography.Base" : undefined}
                                        text={title}
                                    />
                                    {description != null ? (
                                        <Typography.Base size="sm"
                                            color="muted"
                                            showAnatomy={showAnatomy}
                                            anatPart={showAnatomy ? "Typography.Base" : undefined}
                                            text={description}
                                        />
                                    ) : null}
                                </div>
                            </Modal.Header>
                        ) : null}
                        {/* ⚠️ `bodyStartsWithTabs` ĐÃ XOÁ cùng lượt này. Nó bắt caller khai "body
                            của tôi mở đầu bằng tabs" để khung trừ bớt 4px — tức KHUNG ĐANG HỎI
                            NỘI DUNG BÊN TRONG NÓ LÀ LOẠI GÌ, thứ mà định nghĩa frame cấm.
                            4px ấy sinh ra vì `Tabs` có đệm trên của riêng nó; đệm đó là hình học
                            của `Tabs`, phải do chính nó lo (§13z), không phải để khung bù từ ngoài.
                            Hệ quả có thật: ca tabs đổi 12px thành 16px. */}
                        <Modal.Body
                            data-anat-part={showAnatomy ? "Modal.Body" : undefined}
                            className={cn(
                                // `mt-0!` chỉ để TẮT margin HeroUI ship sẵn; nhịp do `gap-4` của
                                // Dialog quyết. Số 0 nằm trên thang nên không phải ngoại lệ.
                                hasHeader && "mt-0!",
                                bodyClassName,
                            )}
                        >
                            {main}
                        </Modal.Body>
                        {/* Same reason as above: HeroUI ships `mt-5` (20px) before the
                            footer, off the scale — the Dialog's own `gap-3` decides it now so
                            header→body and body→footer read as the SAME gap. */}
                        {footer != null ? (
                            <Modal.Footer
                                data-anat-part={showAnatomy ? "Modal.Footer" : undefined}
                                className={cn("mt-0!", footerClassName)}
                            >
                                {footer}
                            </Modal.Footer>
                        ) : null}
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}

/**
 * The dialog-scaffold KHUNG namespace — one member:
 *
 * | Member | Content channel |
 * |---|---|
 * | `.Base` | `title`+`description` (or `header`) / `body` / `footer` (+ `children` = body) |
 */
export const ModalShell = {
    Base,
}
