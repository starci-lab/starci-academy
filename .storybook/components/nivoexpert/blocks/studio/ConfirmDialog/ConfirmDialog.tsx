import { AlertDialog, cn } from "@heroui/react"
import { Alert } from "@sb-components/atoms/feedback/Alert/Alert"
import { InputText } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ButtonGroup } from "@sb-components/composites/buttons/ButtonGroup/ButtonGroup"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ConfirmDialog` — overlay modal for an irreversible delete: names the
 * exact blast radius and keeps the danger action disabled until the operator
 * types the entity's own slug back. One shell for every hard-delete flow in
 * the academy — a course, a lesson, an order — never a bare
 * `window.confirm`.
 */

/** Props for {@link ConfirmDialog}. */
export interface ConfirmDialogProps {
    /** Whether the dialog is currently open (controlled). Forwarded to HeroUI `AlertDialog`. */
    isOpen: boolean
    /**
     * Open-state change handler (fires on cancel and, when dismissable, on
     * Escape). The confirm button does NOT close the dialog itself — the
     * caller closes it through this handler once {@link onConfirm} resolves.
     */
    onOpenChange: (open: boolean) => void
    /** Dialog heading — a short question (e.g. "Delete this course?"). */
    title: string
    /** The danger banner's own title (e.g. "This can't be undone"). */
    warningTitle: string
    /** The danger banner's body — names the exact blast radius, already composed by the caller. */
    warningDescription: string
    /** The exact string the operator must type to unlock the confirm action (a slug, an order id). */
    matchText: string
    /** The confirm-text field's current value (controlled). */
    matchValue: string
    /** Fires as the confirm-text field changes. */
    onMatchValueChange: (value: string) => void
    /** Fires when the operator presses the confirm action. Run the irreversible action here. */
    onConfirm: () => void
    /**
     * `true` → the confirm button shows a spinner and blocks further presses
     * while the delete is in flight; the cancel button and the field lock too.
     */
    isConfirming?: boolean
    /**
     * `true` → `title`/`warningTitle`/`warningDescription` switch to shimmer —
     * this dialog only ever opens once the entity it names has resolved, so
     * this is a placeholder state, not an everyday one.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: ConfirmDialogLabels
}

/** The already-resolved copy the dialog renders. */
export interface ConfirmDialogLabels {
    /** Label above the confirm-text field (e.g. "Type the course slug to confirm"). */
    matchFieldLabel: string
    /** Cancel button label. */
    cancelLabel: string
    /** Confirm button label (e.g. "Delete permanently"). */
    confirmLabel: string
}

/**
 * The type-to-confirm danger dialog. See the file header for why it keeps
 * its own `AlertDialog` tree instead of composing the shared shell.
 *
 * @param props - {@link ConfirmDialogProps}
 */
const ConfirmDialog = ({
    isOpen,
    onOpenChange,
    title,
    warningTitle,
    warningDescription,
    matchText,
    matchValue,
    onMatchValueChange,
    onConfirm,
    isConfirming = false,
    isSkeleton = false,
    labels,
}: ConfirmDialogProps) => {
    const isMatched = matchValue.trim() === matchText
    return (
        <AlertDialog isOpen={isOpen} onOpenChange={onOpenChange}>
            {/* `AlertDialog` root = react-aria `DialogTrigger`: a LOGICAL wrapper, renders no DOM node of its own. */}
            <AlertDialog.Backdrop>
                <AlertDialog.Container size="sm">
                    <AlertDialog.Dialog className={cn("gap-3")}>
                        <AlertDialog.Header>
                            <AlertDialog.Heading>
                                <Typography text={title} weight="medium" isSkeleton={isSkeleton} />
                            </AlertDialog.Heading>
                        </AlertDialog.Header>
                        <AlertDialog.Body>
                            <StackV
                                gap={3}
                                isSkeleton={isSkeleton}
                                items={[
                                    () => (
                                        <Alert
                                            status="danger"
                                            title={warningTitle}
                                            description={warningDescription}
                                            isSkeleton={isSkeleton}
                                        />
                                    ),
                                    () => (
                                        <InputText
                                            label={labels.matchFieldLabel}
                                            placeholder={matchText}
                                            value={matchValue}
                                            onValueChange={onMatchValueChange}
                                            isDisabled={isConfirming}
                                            isSkeleton={isSkeleton}
                                        />
                                    ),
                                ]}
                            />
                        </AlertDialog.Body>
                        <AlertDialog.Footer className="w-full">
                            <ButtonGroup
                                align="end"
                                classNames={["w-full"]}
                                items={[
                                    {
                                        key: "cancel",
                                        label: labels.cancelLabel,
                                        variant: "secondary",
                                        isDisabled: isConfirming,
                                        onPress: () => onOpenChange(false),
                                    },
                                    {
                                        key: "confirm",
                                        label: labels.confirmLabel,
                                        variant: "danger",
                                        isDisabled: !isMatched,
                                        isPending: isConfirming,
                                        onPress: onConfirm,
                                    },
                                ]}
                            />
                        </AlertDialog.Footer>
                    </AlertDialog.Dialog>
                </AlertDialog.Container>
            </AlertDialog.Backdrop>
        </AlertDialog>
    )
}

export { ConfirmDialog }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ConfirmDialog" } as const
