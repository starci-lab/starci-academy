import { cn } from "@heroui/react"
import {
    AlertDialogRoot,
    AlertDialogBackdrop,
    AlertDialogContainer,
    AlertDialogDialog,
    AlertDialogHeader,
    AlertDialogHeading,
    AlertDialogBody,
    AlertDialogFooter,
} from "@sb-components/atoms/feedback/AlertDialog/AlertDialog"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { ButtonGroup } from "@sb-components/composites/buttons/ButtonGroup/ButtonGroup"

/**
 * `ConfirmDialog` — a blocking dialog shell for an irreversible action (unenroll, delete a
 * submission). Builds Header/Body/Footer; content goes through `title`/`description` + the two
 * button labels, not `children`. Purely presentational: `isOpen` and every callback come via
 * props. The Confirm button does not close the dialog — the caller closes it through
 * `onOpenChange` once the action finishes, so `isConfirming` keeps it open while waiting.
 */

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "ConfirmDialog" } as const

/** Props for {@link ConfirmDialog}. */
export interface ConfirmDialogProps {
    /** Whether the dialog is currently open (controlled). Forwarded to house `AlertDialogRoot`. */
    isOpen: boolean
    /**
     * Open-state change handler (fires on cancel and, when dismissable, on Escape).
     * The confirm button does NOT close the dialog itself — the caller closes it via
     * this handler once {@link ConfirmDialogProps.onConfirm} resolves.
     */
    onOpenChange: (open: boolean) => void
    /**
     * Dialog heading — a short question ("Unenroll from this course?"). The header
     * slot's TEXT; the shell wraps it in `Typography` itself (COMPOSITE-8).
     */
    title: string
    /**
     * Optional supporting copy under the title (the body slot's TEXT) — spell out the
     * consequence so the choice is informed. The shell wraps it in `Typography` itself
     * (COMPOSITE-8).
     */
    description?: string
    /** Label for the confirming action button. Default `"Confirm"`. */
    confirmLabel?: string
    /** Label for the cancel / dismiss button. Default `"Cancel"`. */
    cancelLabel?: string
    /** Fires when the user presses confirm. Run the irreversible action here. */
    onConfirm: () => void
    /**
     * Visual weight of the confirm action. `"danger"` styles the confirm button as
     * destructive for actions that delete or undo; `"default"` for benign ones.
     */
    tone?: "default" | "danger"
    /**
     * When `true`, the confirm button shows a spinner and blocks further presses
     * while the action is in flight; the cancel button is disabled too.
     */
    isConfirming?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
    /**
     * `true` → `title`/`description` switch to shimmer (COMPOSITE-8 — both are TEXT
     * this shell renders itself via `Typography`, so the flag reaches them directly,
     * no component-reference slot to call).
     */
    isSkeleton?: boolean
}

/**
 * A controlled confirmation dialog for irreversible actions (unenroll from a course,
 * delete a submission) built on house `AlertDialog*` parts. A purely presentational frame —
 * open state and every callback come in via props; the frame holds no state, does no fetching.
 *
 * The shell already builds a FULL header/body/footer (footer = `ButtonGroup` cancel +
 * confirm) so it does NOT open up `children`: content goes through `title`/`description`.
 *
 * @param props - {@link ConfirmDialogProps}
 */
export const ConfirmDialog = ({
    isOpen,
    onOpenChange,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    tone = "default",
    isConfirming = false,
    classNames,
    isSkeleton = false,
}: ConfirmDialogProps) => {
    const isDanger = tone === "danger"
    return (
        <AlertDialogRoot isOpen={isOpen} onOpenChange={onOpenChange}>
            {/* Root = react-aria `DialogTrigger`: a LOGICAL wrapper, renders no DOM node of its own. */}
            <AlertDialogBackdrop>
                <AlertDialogContainer size="sm">
                    <AlertDialogDialog className={cn(classNames)}>
                        {/* No status icon — text-only; heading/body left, footer right. */}
                        <AlertDialogHeader>
                            <AlertDialogHeading>
                                {/* `alert-dialog__heading` already sets `text-base font-medium` —
                                    match it explicitly so wrapping in `Typography` doesn't shift
                                    the weight. */}
                                <Typography text={title} weight="medium" isSkeleton={isSkeleton} />
                            </AlertDialogHeading>
                        </AlertDialogHeader>
                        {description != null ? (
                            <AlertDialogBody>
                                {/* Typography atom doesn't accept unknown props — tag the wrapper (§11a.1). */}
                                <span>
                                    <Typography size="sm" text={description} color="muted" isSkeleton={isSkeleton} />
                                </span>
                            </AlertDialogBody>
                        ) : null}
                        <AlertDialogFooter className="w-full">
                            <ButtonGroup
                                principle="flex-action-end"
                                items={[
                                    {
                                        key: "cancel",
                                        label: cancelLabel,
                                        variant: "secondary",
                                        isDisabled: isConfirming,
                                        onPress: () => onOpenChange(false),
                                    },
                                    {
                                        key: "confirm",
                                        label: confirmLabel,
                                        variant: isDanger ? "danger" : "primary",
                                        isPending: isConfirming,
                                        onPress: onConfirm,
                                    },
                                ]}
                            />
                        </AlertDialogFooter>
                    </AlertDialogDialog>
                </AlertDialogContainer>
            </AlertDialogBackdrop>
        </AlertDialogRoot>
    )
}
