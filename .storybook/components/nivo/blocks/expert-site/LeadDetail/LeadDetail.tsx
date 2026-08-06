import { CopySimpleIcon, SparkleIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { SelectSingle } from "@sb-components/atoms/forms"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCardNested } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import type { ExpertSiteLeadStatusKey } from "@sb-components/nivo/blocks/expert-site/ExpertSiteLeads/ExpertSiteLeads"

/**
 * `LeadDetail` — overlay drawer over ONE lead: its full message, the same
 * status-move selector `ExpertSiteLeadsPipeline`'s board uses, and the AI
 * draft-reply card (drafted text, a copy-to-clipboard affordance, and the
 * draft/redraft trigger). Replaces the toast that used to carry the drafted
 * reply — content the expert needs to read and copy is the wrong shape for a
 * surface that auto-dismisses.
 */

/** The four statuses in flow order — the pipeline's own column order, reused so the selector reads the same everywhere. */
const STATUS_ORDER: Array<ExpertSiteLeadStatusKey> = ["new", "contacted", "won", "lost"]

/** Props for {@link LeadDetail}. */
export interface LeadDetailProps {
    /** Whether the drawer is currently open. Forwarded to `DrawerShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `DrawerShell`. */
    onOpenChange: (open: boolean) => void
    /** The lead's display name — the drawer's own title. */
    name: string
    /** Contact (email or phone) — the drawer's own description, under the title. */
    contact: string
    /** Already-formatted arrival timestamp. */
    createdAtLabel: string
    /** The lead's full enquiry message. `null` → the lead left no message. */
    message: string | null
    /** Current pipeline status. */
    status: ExpertSiteLeadStatusKey
    /** Move this lead to a new status — the connected layer wires this to `updateExpertSiteLead`. */
    onStatusChange: (status: ExpertSiteLeadStatusKey) => void
    /**
     * The AI-drafted reply text. `null` → not drafted yet (distinct from an
     * empty string, which would read as "drafted, and empty").
     */
    draftReply: string | null
    /** Ask the AI to draft (or redraft) a reply — the connected layer wires this to `draftLeadReply`. */
    onDraftReply: () => void
    /** `true` → the draft mutation is in flight; the draft button busies and locks. */
    isDrafting?: boolean
    /** Set → the last draft attempt failed; shown inline on the draft card. `null` → no error. */
    draftError: string | null
    /** Copy the drafted reply to the clipboard — the connected layer performs the copy + its own toast. */
    onCopyDraft: () => void
    /** Close-button label / footer action. */
    onClose: () => void
    /** Already-localized copy. */
    labels: LeadDetailLabels
}

/** The already-resolved copy the drawer renders. */
export interface LeadDetailLabels {
    /** Heading over the message section. */
    messageLabel: string
    /** Placeholder when the lead left no message. */
    noMessageLabel: string
    /** Accessible name for the status selector. */
    statusLabel: string
    /** The four status labels, keyed by status. */
    statusOptions: Record<ExpertSiteLeadStatusKey, string>
    /** Heading on the draft-reply card. */
    draftSectionLabel: string
    /** Draft / redraft button label. */
    draftActionLabel: string
    /** Copy-to-clipboard button label. */
    copyLabel: string
    /** Status chip text — nothing drafted yet. */
    draftEmptyChipLabel: string
    /** Status chip text — the draft mutation is in flight. */
    draftPendingChipLabel: string
    /** Status chip text — a draft is in hand. */
    draftReadyChipLabel: string
    /** Status chip text — the last draft attempt failed. */
    draftErrorChipLabel: string
    /** Placeholder body text before any draft exists. */
    draftEmptyBodyLabel: string
    /** Close button label. */
    closeLabel: string
}

/** Derives the draft card's status chip tone + text from the three draft flags. */
const draftChip = (
    draftReply: string | null,
    isDrafting: boolean,
    draftError: string | null,
    labels: LeadDetailLabels,
): { tone: ChipTone; text: string } => {
    if (draftError) return { tone: "danger", text: labels.draftErrorChipLabel }
    if (isDrafting) return { tone: "default", text: labels.draftPendingChipLabel }
    if (draftReply != null) return { tone: "success", text: labels.draftReadyChipLabel }
    return { tone: "default", text: labels.draftEmptyChipLabel }
}

/**
 * The lead detail drawer. See the file header for the overlay test this was
 * built against and why there is no note field yet.
 *
 * @param props - {@link LeadDetailProps}
 */
const LeadDetail = ({
    isOpen,
    onOpenChange,
    name,
    contact,
    createdAtLabel,
    message,
    status,
    onStatusChange,
    draftReply,
    onDraftReply,
    isDrafting = false,
    draftError,
    onCopyDraft,
    onClose,
    labels,
}: LeadDetailProps) => {
    const statusChoices = STATUS_ORDER.map((key) => ({ value: key, label: labels.statusOptions[key] }))
    const chip = draftChip(draftReply, isDrafting, draftError, labels)

    return (
        <DrawerShell
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="right"
            title={name}
            description={contact}
            body={() => (
                <StackV
                    gap={6}
                    principle="block-boundary"
                    items={[
                        () => (
                            <StackH
                                gap={3}
                                principle="flex-action"
                                justify="between"
                                at="sm"
                                items={[
                                    () => <Typography size="xs" color="muted" text={createdAtLabel} />,
                                    () => (
                                        <SelectSingle
                                            ariaLabel={labels.statusLabel}
                                            options={statusChoices}
                                            value={status}
                                            onValueChange={(next) => onStatusChange(next as ExpertSiteLeadStatusKey)}
                                        />
                                    ),
                                ]}
                            />
                        ),
                        () => (
                            <SurfaceCardNested
                                title={labels.messageLabel}
                                body={() => (
                                    <Typography
                                        size="sm"
                                        preserveWhitespace
                                        color={message ? undefined : "muted"}
                                        text={message ?? labels.noMessageLabel}
                                    />
                                )}
                            />
                        ),
                        () => (
                            <SurfaceCardNested
                                title={labels.draftSectionLabel}
                                meta={() => <Chip tone={chip.tone} text={chip.text} />}
                                body={({ isSkeleton = false }: SkeletonProps) => (
                                    <StackV
                                        gap={3}
                                        isSkeleton={isSkeleton}
                                        items={[
                                            () => (
                                                draftError ? (
                                                    <Typography size="sm" color="danger" preserveWhitespace text={draftError} />
                                                ) : draftReply != null ? (
                                                    <Typography size="sm" preserveWhitespace text={draftReply} />
                                                ) : (
                                                    <Typography size="sm" color="muted" text={labels.draftEmptyBodyLabel} />
                                                )
                                            ),
                                            () => (
                                                <StackH
                                                    gap={2}
                                                    items={[
                                                        () => (
                                                            <Button
                                                                variant="secondary"
                                                                size="sm"
                                                                prefixIcon={SparkleIcon}
                                                                label={labels.draftActionLabel}
                                                                onPress={onDraftReply}
                                                                isPending={isDrafting}
                                                            />
                                                        ),
                                                        () => (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                prefixIcon={CopySimpleIcon}
                                                                label={labels.copyLabel}
                                                                onPress={onCopyDraft}
                                                                isDisabled={draftReply == null}
                                                            />
                                                        ),
                                                    ]}
                                                />
                                            ),
                                        ]}
                                    />
                                )}
                            />
                        ),
                    ]}
                />
            )}
            footer={() => (
                <Button variant="ghost" label={labels.closeLabel} onPress={onClose} />
            )}
        />
    )
}

export { LeadDetail }
