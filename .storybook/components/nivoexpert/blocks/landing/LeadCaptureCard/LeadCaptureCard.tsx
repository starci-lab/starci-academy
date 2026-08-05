import { CheckCircleIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputText, InputTextarea } from "@sb-components/atoms/forms"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Container } from "@sb-components/frames/Container/Container"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `LeadCaptureCard` -- the closing "Contact" card of the tenant landing: name +
 * contact + optional message, one submit action, and a sent confirmation. It
 * is the universal onward path present in EVERY page state -- never omitted,
 * only its heading copy changes with `intent`. Restyle, not rewrite, of the
 * real `apps/expert/app/LeadForm.tsx`, grounded in `LeadEntity`
 * (`name`, `contact`, `message`) and the real `submitLead` mutation -- the
 * real form has no error slot (a thrown mutation still flips to the sent
 * message, since there is nothing the visitor could fix), so none is modelled
 * here either. Built on the shared HeroUI atom system
 * (`SurfaceCard`/`Input.*`/`Button`/`Typography`/`Container`/`Stack`),
 * re-themed per tenant through `apps/expert/app/globals.css`'s `--nivo-*` ->
 * HeroUI CSS-var bridge -- see the component's own file header for the full
 * contract.
 */

/** Which heading copy the card shows -- mirrors the page's own course-count state. */
export type LeadCaptureIntent = "empty" | "populated"

/** Already-localized copy the card renders. */
export interface LeadCaptureCardLabels {
    /** Small kicker above the heading (e.g. "Contact"). */
    eyebrow: string
    /** Section heading (e.g. "Ready to start?"). */
    heading: string
    /** Sub-line shown when `intent = "populated"`. */
    subheadingPopulated: string
    /** Sub-line shown when `intent = "empty"`. */
    subheadingEmpty: string
    /** Placeholder for the name field. */
    namePlaceholder: string
    /** Placeholder for the contact field (email or phone, free text). */
    contactPlaceholder: string
    /** Placeholder for the optional message field. */
    messagePlaceholder: string
    /** Submit button label at rest. */
    submitLabel: string
    /** Submit button label while the mutation is in flight. */
    submittingLabel: string
    /** Confirmation shown once `submitLead` has resolved. */
    sentMessage: string
}

/** Props for {@link LeadCaptureCard}. */
export interface LeadCaptureCardProps {
    /** Which heading copy to show -- derived from the same course count that decides the catalog region. Ignored while `isSkeleton`. */
    intent: LeadCaptureIntent
    /** Current name value (controlled). */
    name: string
    /** Fires as the name field changes. */
    onNameChange: (value: string) => void
    /** Current contact value -- email or phone, free text (controlled). */
    contact: string
    /** Fires as the contact field changes. */
    onContactChange: (value: string) => void
    /** Current message value (controlled, optional field). */
    message: string
    /** Fires as the message field changes. */
    onMessageChange: (value: string) => void
    /** Submit the lead -- the connected layer runs `submitLead({ name, contact, message })`. */
    onSubmit: () => void
    /** `true` -> the mutation is in flight: the submit button shows its busy label and every field locks. */
    isSubmitting?: boolean
    /** `true` -> `submitLead` has resolved (or calmly swallowed a transport error): the fields are replaced by the confirmation line, matching the real `LeadForm.tsx`'s `sent` state. */
    isSent?: boolean
    /**
     * `true` -> the page's course-count/brand data has not resolved yet, so the
     * card cannot yet know whether `intent` is `"empty"` or `"populated"`. Only
     * the sub-heading shimmers -- the fields and the submit action are static,
     * never data-dependent, and stay live throughout (matches the real page's
     * "the lead form is still reachable" first-load behaviour).
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: LeadCaptureCardLabels
}

/**
 * The closing lead-capture card. See the file header for why the fields never
 * take `isSkeleton` and why there is no error slot.
 *
 * @param props - {@link LeadCaptureCardProps}
 */
const LeadCaptureCard = ({
    intent,
    name,
    onNameChange,
    contact,
    onContactChange,
    message,
    onMessageChange,
    onSubmit,
    isSubmitting = false,
    isSent = false,
    isSkeleton = false,
    labels,
}: LeadCaptureCardProps) => {
    // Presentation logic the block derives, not a request it makes -- mirrors the
    // real `submit`'s implicit guard (`!name.trim() || !contact.trim() || busy`).
    const canSubmit = name.trim().length > 0 && contact.trim().length > 0 && !isSubmitting

    return (
        <div data-tier="block" data-component="LeadCaptureCard">
            <Container
                size="sm"
                padding={1}
                body={() => (
                    <StackV
                        gap={6}
                        align="center"
                        items={[
                            () => <Typography size="sm" weight="semibold" color="accent" align="center" text={labels.eyebrow} />,
                            () => <Typography size="h2" weight="bold" align="center" text={labels.heading} />,
                            () => (
                                <SurfaceCard
                                    padding={6}
                                    body={() =>
                                        isSent ? (
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
                                                    () => <Typography size="sm" text={labels.sentMessage} />,
                                                ]}
                                            />
                                        ) : (
                                            <StackV
                                                gap={4}
                                                items={[
                                                    () => (
                                                        <Typography
                                                            size="sm"
                                                            color="muted"
                                                            align="center"
                                                            isSkeleton={isSkeleton}
                                                            text={intent === "populated" ? labels.subheadingPopulated : labels.subheadingEmpty}
                                                        />
                                                    ),
                                                    () => (
                                                        <InputText
                                                            variant="secondary"
                                                            ariaLabel={labels.namePlaceholder}
                                                            placeholder={labels.namePlaceholder}
                                                            value={name}
                                                            onValueChange={onNameChange}
                                                            isDisabled={isSubmitting}
                                                        />
                                                    ),
                                                    () => (
                                                        <InputText
                                                            variant="secondary"
                                                            ariaLabel={labels.contactPlaceholder}
                                                            placeholder={labels.contactPlaceholder}
                                                            value={contact}
                                                            onValueChange={onContactChange}
                                                            isDisabled={isSubmitting}
                                                        />
                                                    ),
                                                    () => (
                                                        <InputTextarea
                                                            variant="secondary"
                                                            rows={3}
                                                            ariaLabel={labels.messagePlaceholder}
                                                            placeholder={labels.messagePlaceholder}
                                                            value={message}
                                                            onValueChange={onMessageChange}
                                                            isDisabled={isSubmitting}
                                                        />
                                                    ),
                                                    () => (
                                                        <div className="grid w-full">
                                                            <Button
                                                                variant="primary"
                                                                label={isSubmitting ? labels.submittingLabel : labels.submitLabel}
                                                                prefixIcon={PaperPlaneTiltIcon}
                                                                onPress={onSubmit}
                                                                isDisabled={!canSubmit}
                                                                isPending={isSubmitting}
                                                            />
                                                        </div>
                                                    ),
                                                ]}
                                            />
                                        )
                                    }
                                />
                            ),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { LeadCaptureCard }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "LeadCaptureCard" } as const
