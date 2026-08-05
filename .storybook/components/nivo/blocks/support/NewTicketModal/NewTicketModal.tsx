import { PaperPlaneTiltIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputText, InputTextarea } from "@sb-components/atoms/forms"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `NewTicketModal` — overlay modal that opens a new support ticket: a subject
 * line plus the opening message body, handed off as one new
 * `SupportTicketEntity` and its first `TicketMessageEntity`. Never mounted by
 * `SupportView` itself (a page may import blocks/composites/frames, never an
 * overlay) — the route shell above the page owns when this is on screen.
 */

/** Props for {@link NewTicketModal}. */
export interface NewTicketModalProps {
    /** Whether the modal is currently open. Forwarded to `ModalShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `ModalShell`. */
    onOpenChange: (open: boolean) => void
    /** Subject line for the new ticket (controlled) — maps to `SupportTicketEntity.subject`. */
    subject: string
    /** Fires as the subject field changes. */
    onSubjectChange: (value: string) => void
    /** Body of the opening message (controlled) — maps to `TicketMessageEntity.body`. */
    body: string
    /** Fires as the body field changes. */
    onBodyChange: (value: string) => void
    /** Create the ticket — the connected layer runs the mutation, then opens the new thread. */
    onSubmit: () => void
    /** `true` → the create is in flight (submit button busy, fields lock). */
    isSubmitting?: boolean
    /**
     * `true` → the modal's own first fetch (e.g. resolving support hours/eligibility)
     * is in flight: both fields shimmer. Threaded straight down — never fed to a
     * separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: NewTicketModalLabels
}

/** The already-resolved copy the modal renders. */
export interface NewTicketModalLabels {
    /** Modal title (e.g. "Open a support ticket"). */
    title: string
    /** Label above the subject field. */
    subjectLabel: string
    /** Placeholder in the subject field. */
    subjectPlaceholder: string
    /** Label above the body field. */
    bodyLabel: string
    /** Placeholder in the body field. */
    bodyPlaceholder: string
    /** Cancel button label. */
    cancelLabel: string
    /** Submit button label. */
    submitLabel: string
}

/**
 * The new-ticket modal. See the file header for why this page's overlay never
 * mounts inside the page tree.
 *
 * @param props - {@link NewTicketModalProps}
 */
const NewTicketModal = ({
    isOpen,
    onOpenChange,
    subject,
    onSubjectChange,
    body,
    onBodyChange,
    onSubmit,
    isSubmitting = false,
    isSkeleton = false,
    labels,
}: NewTicketModalProps) => {
    const canSubmit = subject.trim().length > 0 && body.trim().length > 0

    return (
        <ModalShell
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={labels.title}
            size="md"
            isSkeleton={isSkeleton}
            body={({ isSkeleton }: SkeletonProps) => (
                <StackV
                    gap={4}
                    isSkeleton={isSkeleton}
                    items={[
                        () => (
                            <InputText
                                label={labels.subjectLabel}
                                placeholder={labels.subjectPlaceholder}
                                value={subject}
                                onValueChange={onSubjectChange}
                                isDisabled={isSubmitting}
                                isSkeleton={isSkeleton}
                            />
                        ),
                        () => (
                            <InputTextarea
                                label={labels.bodyLabel}
                                placeholder={labels.bodyPlaceholder}
                                rows={4}
                                value={body}
                                onValueChange={onBodyChange}
                                isDisabled={isSubmitting}
                                isSkeleton={isSkeleton}
                            />
                        ),
                    ]}
                />
            )}
            footer={() => (
                <>
                    <Button variant="ghost" label={labels.cancelLabel} onPress={() => onOpenChange(false)} isDisabled={isSubmitting} />
                    <Button
                        variant="primary"
                        prefixIcon={PaperPlaneTiltIcon}
                        label={labels.submitLabel}
                        onPress={onSubmit}
                        isPending={isSubmitting}
                        isDisabled={!canSubmit}
                    />
                </>
            )}
        />
    )
}

export { NewTicketModal }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "NewTicketModal" } as const
