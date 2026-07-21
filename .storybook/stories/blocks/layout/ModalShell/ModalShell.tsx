import React from "react"
import type { ReactNode } from "react"
import { cn, Modal, Typography } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — the target `ModalShell` overlay primitive.
 * Authored in Storybook (not `src`); synced to `src` later. No `@/components`
 * imports (design-spec ports stay self-contained).
 *
 * A tier-3 presentational block — it owns no state of its own; the caller
 * threads open/close state plus the header and body content via props.
 */

/** Props for the {@link ModalShell} block. */
export interface ModalShellProps {
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
    /**
     * Category **tabs**: whether {@link children}'s FIRST element is a tab strip
     * rather than plain content. Governs header→body gap only: plain → `gap-4`;
     * leading tabs → `gap-3`. No effect without {@link title}/{@link header}.
     */
    bodyStartsWithTabs?: boolean
    /** Body content of the modal. */
    children: ReactNode
    /** Extra classes merged onto `Modal.Dialog`. */
    className?: string
}

/**
 * Shared modal scaffold: `Modal > Backdrop > Container > Dialog > CloseTrigger
 * + Header? + Body`. Extracted so each modal only supplies its open-state,
 * header content, and body.
 *
 * @param props - See {@link ModalShellProps}.
 */
export const ModalShell = ({
    isOpen,
    onOpenChange,
    title,
    description,
    titleClassName,
    header,
    size,
    scroll,
    containerClassName,
    dialogClassName,
    bodyClassName,
    bodyStartsWithTabs,
    className,
    children,
}: ModalShellProps) => {
    const hasHeader = header != null || title != null
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container
                    className={cn(scroll === "inside" && "max-h-[85vh]", containerClassName)}
                    scroll={scroll}
                    size={size}
                >
                    <Modal.Dialog className={cn(dialogClassName, className)}>
                        <Modal.CloseTrigger />
                        {header ? (
                            <Modal.Header>{header}</Modal.Header>
                        ) : title != null ? (
                            <Modal.Header>
                                <div className={cn("flex flex-col gap-1 pr-8", titleClassName)}>
                                    <Typography type="body" weight="bold">
                                        {title}
                                    </Typography>
                                    {description != null ? (
                                        <Typography type="body-sm" color="muted">
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
                            className={cn(
                                hasHeader && (bodyStartsWithTabs ? "mt-3!" : "mt-4!"),
                                bodyClassName,
                            )}
                        >
                            {children}
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
