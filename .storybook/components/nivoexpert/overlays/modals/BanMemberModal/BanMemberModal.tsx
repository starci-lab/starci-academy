import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputTextarea } from "@sb-components/atoms/forms/Input/Input"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `BanMemberModal` — the danger gate for banning a community member: a warning
 * callout naming the consequence, a required audit-reason field, and a red
 * Confirm disabled until a reason is entered. Confirm does NOT close the modal
 * itself (same rule `ConfirmDialog` follows) — the caller closes it via
 * `onOpenChange` once `setMemberStatus` resolves, keeping it open (`isBanning`)
 * while the mutation is in flight.
 */

/** Props for {@link BanMemberModal}. */
export interface BanMemberModalProps {
    /** Whether the modal is currently open. Forwarded to `ModalShell`. */
    isOpen: boolean
    /** Open-state change handler. Forwarded to `ModalShell`. */
    onOpenChange: (open: boolean) => void
    /** The member's display name — shown in the title and the warning copy. */
    memberName: string
    /** The audit-reason text (controlled). Confirm stays disabled while this is empty. */
    reason: string
    /** Fired on every keystroke in the reason field. */
    onReasonChange: (value: string) => void
    /** Fired when Confirm is pressed — the connected layer runs `setMemberStatus` with the audit reason. Does NOT close the modal itself; the caller closes it once the mutation resolves. */
    onConfirm: () => void
    /** `true` while the ban is in flight — Confirm shows a spinner, both buttons and the reason field lock. */
    isBanning?: boolean
    /** Already-resolved copy. */
    labels: BanMemberModalLabels
}

/** Already-resolved copy the modal renders. */
export interface BanMemberModalLabels {
    /** Label above the reason field. */
    reasonFieldLabel: string
    /** Placeholder text inside the empty reason field. */
    reasonPlaceholder: string
    /** Cancel button label. */
    cancelLabel: string
    /** Confirm button label. */
    confirmLabel: string
}

/** Fixed, block-owned title prefix — the member's name is appended, same convention `SetMemberRoleModal` uses. */
const MODAL_TITLE = "Ban member?"

/** Fixed warning-callout title — the consequence is always the same shape, only the name varies. */
const WARNING_TITLE = "This can't be undone automatically"

/**
 * The ban gate. See the file header for why Confirm stays disabled until a
 * reason is entered, and why the modal never closes itself.
 *
 * @param props - {@link BanMemberModalProps}
 */
const BanMemberModal = ({
    isOpen,
    onOpenChange,
    memberName,
    reason,
    onReasonChange,
    onConfirm,
    isBanning = false,
    labels,
}: BanMemberModalProps) => {
    const canConfirm = reason.trim().length > 0 && !isBanning

    return (
        <div>
            <ModalShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={`${MODAL_TITLE} · ${memberName}`}
                size="sm"
                body={() => (
                    <StackV
                        gap={4}
                        items={[
                            () => (
                                <Callout
                                    status="danger"
                                    title={WARNING_TITLE}
                                    description={`Banning revokes ${memberName}'s access to every course they're enrolled in, until you unban them.`}
                                />
                            ),
                            () => (
                                <InputTextarea
                                    label={labels.reasonFieldLabel}
                                    placeholder={labels.reasonPlaceholder}
                                    value={reason}
                                    onValueChange={onReasonChange}
                                    isRequired
                                    isDisabled={isBanning}
                                    variant="secondary"
                                />
                            ),
                        ]}
                    />
                )}
                footer={() => (
                    <StackH
                        gap={2}
                        justify="end"
                        items={[
                            () => <Button variant="secondary" size="sm" label={labels.cancelLabel} onPress={() => onOpenChange(false)} isDisabled={isBanning} />,
                            () => <Button variant="danger" size="sm" label={labels.confirmLabel} onPress={onConfirm} isPending={isBanning} isDisabled={!canConfirm} />,
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { BanMemberModal }
