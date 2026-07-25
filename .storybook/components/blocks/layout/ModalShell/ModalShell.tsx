import React from "react"
import type { ReactNode } from "react"
import { cn, Modal, Typography } from "@heroui/react"

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
    /**
     * Category **tabs**: whether the body's FIRST element is a tab strip
     * rather than plain content. Governs header→body gap only: plain → `gap-4`;
     * leading tabs → `gap-3`. No effect without {@link title}/{@link header}.
     */
    bodyStartsWithTabs?: boolean
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
    bodyStartsWithTabs,
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
                    <Modal.Dialog className={cn(dialogClassName, className)}>
                        <Modal.CloseTrigger data-anat-part={showAnatomy ? "CloseTrigger" : undefined} />
                        {header ? (
                            <Modal.Header data-anat-part={showAnatomy ? "Header" : undefined}>{header}</Modal.Header>
                        ) : title != null ? (
                            <Modal.Header>
                                <div className={cn("flex flex-col gap-1 pr-8", titleClassName)}>
                                    <Typography
                                        type="body"
                                        weight="bold"
                                        data-anat-part={showAnatomy ? "Title" : undefined}
                                    >
                                        {title}
                                    </Typography>
                                    {description != null ? (
                                        <Typography
                                            type="body-sm"
                                            color="muted"
                                            data-anat-part={showAnatomy ? "Description" : undefined}
                                        >
                                            {description}
                                        </Typography>
                                    ) : null}
                                </div>
                            </Modal.Header>
                        ) : null}
                        {/* HeroUI's own `.modal__header + .modal__body { mt-2 }` (8px) is
                            tighter than the modal scale — override to gap-4
                            (header→plain content) or gap-3 (header→tabs).
                            Only fires when a header actually precedes body. */}
                        <Modal.Body
                            data-anat-part={showAnatomy ? "Body" : undefined}
                            className={cn(
                                hasHeader && (bodyStartsWithTabs ? "mt-3!" : "mt-4!"),
                                bodyClassName,
                            )}
                        >
                            {main}
                        </Modal.Body>
                        {/* Same reason as above: HeroUI ships `mt-5` (20px) before the
                            footer, off the modal's 4-scale — normalise to mt-4 so
                            header→body and body→footer read as the SAME gap. */}
                        {footer != null ? (
                            <Modal.Footer
                                data-anat-part={showAnatomy ? "Footer" : undefined}
                                className={cn("mt-4!", footerClassName)}
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
