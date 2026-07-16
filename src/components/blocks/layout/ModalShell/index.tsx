import React from "react"
import { cn, Modal, Typography } from "@heroui/react"
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
     * Simple title string/node rendered as HeroUI {@link Typography}
     * (`type="body"` `weight="bold"`). With optional {@link description}, both
     * sit in one `pr-8` stack (room for the close button). Ignored when
     * {@link header} is provided. Omit title/header to render no header at all.
     */
    title?: ReactNode
    /**
     * Explanatory copy under {@link title} (`Typography` `body-sm` muted). Part
     * of the simple header path — keeps the body free for form/list/CTA only.
     * Ignored when {@link header} is provided, or when {@link title} is omitted.
     */
    description?: ReactNode
    /**
     * Extra classes merged onto the default title/description wrapper. Only
     * applies when {@link title} is used (not {@link header}).
     */
    titleClassName?: string
    /**
     * Full custom header content — use this instead of {@link title} /
     * {@link description} when the modal needs a non-standard header (identity
     * subtitle row, inline chip, shared `Typography`, …). Takes precedence
     * over {@link title} and {@link description}.
     */
    header?: ReactNode
    /**
     * Size of the underlying `Modal.Container` (dialog width). Mirrors HeroUI's
     * own `size` scale; omit for the component default.
     */
    size?: React.ComponentProps<typeof Modal.Container>["size"]
    /**
     * Scroll behavior of the underlying `Modal.Container`. Use `"inside"` when
     * the body is longer than the viewport — header stays put, body scrolls.
     * When set, the container also gets `max-h-[85vh]` so inside-scroll has a
     * real ceiling (override via {@link containerClassName} if needed).
     *
     * **List rule (surface-in-surface):** a row list inside the modal body must
     * be `SurfaceListCard` with `bordered` — nested on the modal surface, shadow
     * is invisible; border delineates. Do not hand-roll `border-b` rows on the
     * bare body.
     */
    scroll?: React.ComponentProps<typeof Modal.Container>["scroll"]
    /**
     * Extra classes merged onto `Modal.Container` (e.g. a bespoke max-width).
     * Merged after the `scroll="inside"` max-height default.
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
     * Category **tabs**: whether {@link children}'s FIRST element is a tab
     * strip (`Tabs` / `TabsCard` / `ExtendedTabs` / a dedicated TabBar) rather
     * than plain content. Governs header→body gap only:
     * - plain (default) → `gap-4`
     * - leading tabs → `gap-3` (tabs sit in the title's identity cluster)
     *
     * Does **not** set tabs→panel spacing — caller always uses `gap-4` between
     * the tab strip and panel content. Do not set this for a `TabsCard` pill
     * toggle nested inside a form panel. No effect without {@link title}/{@link header}
     * (no header ⇒ no header-body gap to set).
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
 *   description={t("myModal.description")}
 *   bodyClassName="gap-3"
 * >
 *   <MyModalBody />
 * </ModalShell>
 * @see Story: .storybook/stories/blocks/layout/ModalShell/ModalShell.stories
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
                            Only fires when a header actually precedes body (no header ⇒
                            no sibling match ⇒ this class is inert). */}
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
