import { CheckCircleIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputText, InputTextarea } from "@sb-components/atoms/forms"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ExpertSiteLeadForm` — the public contact form on an expert's site. One
 * composition: name + contact + message above a submit button. The three phases
 * — `idle`, `isSubmitting`, `isSubmitted` — are DATA, so they are STATES of the
 * single shape. Grounded in the real `ExpertSiteLeadForm`; maps onto the
 * `ExpertSiteLeadEntity` fields a visitor supplies.
 */

/** Props for {@link ExpertSiteLeadForm}. */
export interface ExpertSiteLeadFormProps {
    /** Visitor's name — maps to `ExpertSiteLeadEntity.name`. */
    name: string
    /** Fires as the name field changes. */
    onNameChange: (value: string) => void
    /** Email or phone — maps to `ExpertSiteLeadEntity.contact`. Free-text on purpose. */
    contact: string
    /** Fires as the contact field changes. */
    onContactChange: (value: string) => void
    /** Optional message — maps to `ExpertSiteLeadEntity.message`. */
    message: string
    /** Fires as the message field changes. */
    onMessageChange: (value: string) => void
    /** Submit the enquiry — the connected layer runs the mutation. */
    onSubmit: () => void
    /** Already-localized field labels + button copy. */
    labels: ExpertSiteLeadFormLabels
    /** `true` → the submit is in flight (button shows a spinner, inputs lock). */
    isSubmitting?: boolean
    /** `true` → the enquiry landed; the form is replaced by the thank-you line. */
    isSubmitted?: boolean
}

/** The already-resolved copy the form renders — the connected layer supplies these. */
export interface ExpertSiteLeadFormLabels {
    /** Label above the name field. */
    nameLabel: string
    /** Label above the contact field. */
    contactLabel: string
    /** Hint under the contact field (e.g. "Email or phone so we can reach you back"). */
    contactHint: string
    /** Label above the message field. */
    messageLabel: string
    /** Submit button label. */
    submitLabel: string
    /** Confirmation line shown once the enquiry is sent. */
    sentLabel: string
}

/**
 * The public lead form. See the file header for why the three phases are states
 * of one shape rather than separate leaves.
 *
 * @param props - {@link ExpertSiteLeadFormProps}
 */
const ExpertSiteLeadForm = ({
    name,
    onNameChange,
    contact,
    onContactChange,
    message,
    onMessageChange,
    onSubmit,
    labels,
    isSubmitting = false,
    isSubmitted = false,
}: ExpertSiteLeadFormProps) => {
    // The visitor is the person filling this in, so `canSubmit` is derived from the
    // two required fields — presentation logic the block owns, not a request.
    const canSubmit = name.trim().length > 0 && contact.trim().length > 0

    // ── SUBMITTED branch: the fields are gone; a single confirmation line stands in.
    if (isSubmitted) {
        return (
            <div data-tier="block" data-component="ExpertSiteLeadForm">
                <StackH
                    gap={3}
                    items={[
                        () => (
                            <CheckCircleIcon
                                aria-hidden
                                focusable="false"
                                weight="fill"
                                className="size-5 shrink-0 text-success"
                            />
                        ),
                        () => <Typography size="sm" text={labels.sentLabel} />,
                    ]}
                />
            </div>
        )
    }

    return (
        <div data-tier="block" data-component="ExpertSiteLeadForm">
            <StackV
                gap={3}
                items={[
                    () => (
                        <InputText
                            variant="secondary"
                            label={labels.nameLabel}
                            value={name}
                            onValueChange={onNameChange}
                            isDisabled={isSubmitting}
                        />
                    ),
                    () => (
                        <InputText
                            variant="secondary"
                            label={labels.contactLabel}
                            hint={labels.contactHint}
                            value={contact}
                            onValueChange={onContactChange}
                            isDisabled={isSubmitting}
                        />
                    ),
                    () => (
                        <InputTextarea
                            variant="secondary"
                            label={labels.messageLabel}
                            rows={3}
                            value={message}
                            onValueChange={onMessageChange}
                            isDisabled={isSubmitting}
                        />
                    ),
                    () => (
                        <Button
                            variant="primary"
                            prefixIcon={PaperPlaneTiltIcon}
                            label={labels.submitLabel}
                            onPress={onSubmit}
                            isDisabled={!canSubmit}
                            isPending={isSubmitting}
                        />
                    ),
                ]}
            />
        </div>
    )
}

// A private wrapper so the file matches the `_slot` skeleton-thread convention used
// by callers embedding this form (e.g. `ExpertSiteView`) — the form has no async
// data of its own, so `isSkeleton` simply mirrors the idle field stack.
export const ExpertSiteLeadFormSkeleton = ({ isSkeleton = true }: SkeletonProps) => (
    <SurfaceCard
        variant="nested"
        padding={3}
        isSkeleton={isSkeleton}
        body={() => (
            <StackV
                gap={3}
                isSkeleton={isSkeleton}
                items={[
                    ({ isSkeleton: skeleton }: SkeletonProps) => (
                        <InputText isSkeleton={skeleton} value="" onValueChange={() => {}} label="" />
                    ),
                    ({ isSkeleton: skeleton }: SkeletonProps) => (
                        <InputText isSkeleton={skeleton} value="" onValueChange={() => {}} label="" />
                    ),
                    ({ isSkeleton: skeleton }: SkeletonProps) => (
                        <InputTextarea isSkeleton={skeleton} value="" onValueChange={() => {}} label="" />
                    ),
                ]}
            />
        )}
    />
)

export { ExpertSiteLeadForm }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ExpertSiteLeadForm" } as const
