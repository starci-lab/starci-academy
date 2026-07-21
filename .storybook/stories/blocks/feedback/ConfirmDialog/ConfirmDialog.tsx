import React from "react"
import { AlertDialog, Button, cn, Spinner, Typography } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/feedback/ConfirmDialog`. Authored in Storybook (not `src`);
 * synced to `src` later.
 *
 * A controlled confirmation dialog for irreversible actions (huỷ ghi danh, xoá
 * bài nộp) built on HeroUI {@link AlertDialog}. Tier-3 presentational — the open
 * state and every callback arrive via props; the block owns no state or fetch.
 */

/** Props for the {@link ConfirmDialog} block. */
export interface ConfirmDialogProps {
    /**
     * Whether the dialog is currently open (controlled). Forwarded to the
     * HeroUI {@link AlertDialog} root.
     */
    isOpen: boolean
    /**
     * Open-state change handler (fires on cancel and, when dismissable, on
     * Escape). The confirm button does NOT close the dialog itself — the caller
     * closes it via this handler once {@link onConfirm} resolves.
     */
    onOpenChange: (open: boolean) => void
    /**
     * Dialog heading — a short question or statement of what is about to happen
     * ("Huỷ ghi danh khoá này?").
     */
    title: React.ReactNode
    /**
     * Optional supporting copy under the title — spell out the consequence so
     * the choice is informed ("Tiến độ học của bạn sẽ bị xoá và không khôi phục
     * được.").
     */
    description?: React.ReactNode
    /** Label for the confirming action button. Default `"Xác nhận"`. */
    confirmLabel?: string
    /** Label for the cancel / dismiss button. Default `"Huỷ"`. */
    cancelLabel?: string
    /**
     * Fires when the user presses the confirm button. Run the irreversible
     * action here, then close the dialog via {@link onOpenChange}.
     */
    onConfirm: () => void
    /**
     * Visual weight of the confirm action. `"danger"` styles the confirm button
     * as destructive (danger variant) for actions that delete or undo; leave as
     * `"default"` for benign confirmations. Default `"default"`.
     */
    tone?: "default" | "danger"
    /**
     * When `true`, the confirm button shows a spinner and blocks further presses
     * while the action is in flight; the cancel button is disabled too.
     */
    isConfirming?: boolean
    /** Extra classes on the dialog. */
    className?: string
}

/**
 * ConfirmDialog is a controlled confirmation dialog for irreversible actions,
 * built on HeroUI {@link AlertDialog}. It renders a status icon, a {@link title}
 * heading, optional {@link description} body, and a footer with a cancel button
 * plus a confirm button. When {@link tone} is `"danger"` the confirm button uses
 * the destructive `danger` variant and the icon turns danger — the pairing that
 * signals a delete / undo action.
 *
 * The confirm button never closes the dialog on its own: {@link onConfirm} runs
 * the action, and the caller closes the dialog via {@link onOpenChange} (so an
 * async action can keep the dialog open under {@link isConfirming}).
 *
 * @param props - {@link ConfirmDialogProps}
 */
export const ConfirmDialog = ({
    isOpen,
    onOpenChange,
    title,
    description,
    confirmLabel = "Xác nhận",
    cancelLabel = "Huỷ",
    onConfirm,
    tone = "default",
    isConfirming,
    className,
}: ConfirmDialogProps) => {
    const isDanger = tone === "danger"
    return (
        <AlertDialog isOpen={isOpen} onOpenChange={onOpenChange}>
            <AlertDialog.Backdrop>
                <AlertDialog.Container size="sm">
                    <AlertDialog.Dialog className={cn(className)}>
                        <AlertDialog.Header>
                            {/* Icon status mirrors the tone — danger for destructive */}
                            <AlertDialog.Icon status={isDanger ? "danger" : "default"} />
                            <AlertDialog.Heading>{title}</AlertDialog.Heading>
                        </AlertDialog.Header>
                        {description != null ? (
                            <AlertDialog.Body>
                                <Typography type="body-sm" color="muted">
                                    {description}
                                </Typography>
                            </AlertDialog.Body>
                        ) : null}
                        <AlertDialog.Footer className="w-full items-center justify-end gap-3">
                            <Button
                                variant="tertiary"
                                isDisabled={isConfirming}
                                onPress={() => onOpenChange(false)}
                            >
                                {cancelLabel}
                            </Button>
                            {/* Destructive → danger variant; the spinner is rendered
                                explicitly because isPending alone shows none. */}
                            <Button
                                variant={isDanger ? "danger" : "primary"}
                                isPending={isConfirming}
                                onPress={onConfirm}
                            >
                                {isConfirming ? <Spinner color="current" size="sm" /> : null}
                                {confirmLabel}
                            </Button>
                        </AlertDialog.Footer>
                    </AlertDialog.Dialog>
                </AlertDialog.Container>
            </AlertDialog.Backdrop>
        </AlertDialog>
    )
}
