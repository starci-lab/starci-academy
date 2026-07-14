import React from "react"
import { cn, Modal } from "@heroui/react"
import type { ReactNode } from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Props for the {@link ModalShell} block.
 *
 * A tier-3 presentational block — it owns no state of its own; the caller
 * threads open/close state plus the header and body content via props.
 */
export interface ModalShellProps extends WithClassNames<undefined> {
    /**
     * Whether the modal is currently open. Forwarded to HeroUI `<Modal>`.
     */
    isOpen: boolean
    /**
     * Open-state change handler (fires on backdrop click, Escape, and the
     * close-trigger button). Forwarded to HeroUI `<Modal>`.
     */
    onOpenChange: (open: boolean) => void
    /**
     * Simple title string/node rendered in the default header look
     * (`text-lg font-semibold pr-8`, the space reserved for the close
     * button). Ignored when {@link header} is provided. Omit both to render
     * no header at all.
     */
    title?: ReactNode
    /**
     * Extra classes merged onto the default title wrapper. Only applies
     * when {@link title} is used (not {@link header}).
     */
    titleClassName?: string
    /**
     * Full custom header content — use this instead of {@link title} when the
     * modal needs a non-standard header (a subtitle row, an inline chip, a
     * shared `Typography` element, …). Takes precedence over {@link title}.
     */
    header?: ReactNode
    /**
     * Size of the underlying `Modal.Container` (dialog width). Mirrors HeroUI's
     * own `size` scale; omit for the component default.
     */
    size?: React.ComponentProps<typeof Modal.Container>["size"]
    /**
     * Scroll behavior of the underlying `Modal.Container` (e.g. `"inside"` for
     * dialogs whose body scrolls independently of the page).
     */
    scroll?: React.ComponentProps<typeof Modal.Container>["scroll"]
    /**
     * Extra classes merged onto `Modal.Container` (e.g. a bespoke max-width).
     */
    containerClassName?: string
    /**
     * Extra classes merged onto `Modal.Dialog`, in addition to {@link className}.
     */
    dialogClassName?: string
    /**
     * Extra classes merged onto `Modal.Body`.
     */
    bodyClassName?: string
    /**
     * Whether {@link children}'s FIRST element is a tab strip (`Tabs`/
     * `TabsCard`/`ExtendedTabs`) rather than plain content. Governs the
     * header→body gap (`fe/foundations/gap.md`): header→plain-content =
     * `gap-6` (default); header→tabs = `gap-3` (tabs sit closer to the
     * title, as part of the same "identity" cluster — the CONTENT below the
     * tabs still gets its own `gap-6` from the tabs, which the modal's own
     * body layout is responsible for, not this prop). No effect without
     * {@link title}/{@link header} (no header ⇒ no header-body gap to set).
     */
    bodyStartsWithTabs?: boolean
    /**
     * Body content of the modal.
     */
    children: ReactNode
}

/**
 * Shared modal scaffold: `Modal > Backdrop > Container > Dialog > CloseTrigger
 * + Header? + Body`. This is the exact structure that used to be hand-rolled
 * in nearly every modal under `components/modals/*` — extracted here so each
 * modal only supplies its open-state, header content, and body.
 *
 * Modals with a non-standard shape (no close trigger, header/body content
 * placed directly on the `Dialog`, a customized `Backdrop`, …) should keep
 * their own hand-rolled `<Modal>` tree instead of forcing this block.
 *
 * @param props - See {@link ModalShellProps}.
 * @returns The rendered modal element.
 *
 * @example
 * <ModalShell
 *   isOpen={isOpen}
 *   onOpenChange={setOpen}
 *   title={t("myModal.title")}
 *   bodyClassName="gap-3"
 * >
 *   <MyModalBody />
 * </ModalShell>
 */
export const ModalShell = ({
    isOpen,
    onOpenChange,
    title,
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
                <Modal.Container className={containerClassName} scroll={scroll} size={size}>
                    <Modal.Dialog className={cn(dialogClassName, className)}>
                        <Modal.CloseTrigger />
                        {header ? (
                            <Modal.Header>{header}</Modal.Header>
                        ) : title != null ? (
                            <Modal.Header>
                                <div className={cn("text-lg font-semibold pr-8", titleClassName)}>
                                    {title}
                                </div>
                            </Modal.Header>
                        ) : null}
                        {/* HeroUI's own `.modal__header + .modal__body { mt-2 }` (8px) is
                            tighter than fe/foundations/gap.md's scale — override to gap-6
                            (header→plain content) or gap-3 (header→tabs) per §header rule.
                            Only fires when a header actually precedes body (no header ⇒
                            no sibling match ⇒ this class is inert). */}
                        <Modal.Body
                            className={cn(
                                hasHeader && (bodyStartsWithTabs ? "mt-3!" : "mt-6!"),
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
