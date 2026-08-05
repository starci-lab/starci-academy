import { PaperPlaneRightIcon, PencilSimpleIcon, SparkleIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { InputTextarea } from "@sb-components/atoms/forms"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { KeyValueList, type KeyValueListItem } from "@sb-components/composites/data/KeyValue/KeyValue"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `LeadDetailDrawer` — the overlay for one lead: its pipeline stage stepper,
 * its message/source, and an AI-drafted reply the expert reviews (edit or
 * approve) before it sends. The lead is a resolved view handed in as props —
 * this file never fetches.
 */

/** The four fixed pipeline stages — same set `LeadsPipeline` sorts leads into. */
export type LeadStage = "new" | "contacted" | "won" | "lost"

/** Props for {@link LeadDetailDrawer}. */
export interface LeadDetailDrawerProps {
    /** Whether the drawer is currently open. Forwarded to `DrawerShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `DrawerShell`. */
    onOpenChange: (open: boolean) => void
    /** The lead's email — the drawer's title. */
    email: string
    /** Which stage the lead is currently in. */
    stage: LeadStage
    /** What the lead said/asked, when known. */
    message?: string | null
    /** Where the lead came from (e.g. "Landing page"), when known. */
    source?: string | null
    /** The AI-drafted reply, awaiting the expert's review. */
    draftReply: string
    /** Fires as the expert edits the draft, once {@link isEditingDraft} is true. */
    onDraftReplyChange: (value: string) => void
    /** `true` → the draft renders as an editable textarea instead of static text. */
    isEditingDraft?: boolean
    /** Switches the draft into edit mode. */
    onEditDraft: () => void
    /** Sends the (possibly edited) draft — the human-in-loop approval gesture. */
    onSendReply: () => void
    /** `true` → the send is in flight: both footer buttons lock, Send shows a spinner. */
    isSending?: boolean
    /**
     * `true` → the drawer's own first fetch (looking the lead up by id) is in
     * flight: the title, the stage stepper, the message/source rows, and the
     * AI-draft card all draw their skeleton mirror, threaded straight down.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: LeadDetailDrawerLabels
}

/** The already-resolved copy the drawer renders. */
export interface LeadDetailDrawerLabels {
    /** The four stage labels, keyed by stage — drives the stepper row. */
    stageLabels: Record<LeadStage, string>
    /** Row label for the lead's message. */
    messageLabel: string
    /** Row label for the lead's source. */
    sourceLabel: string
    /** Shown when a field has no value. */
    unknownValueLabel: string
    /** AI-draft card title. */
    aiDraftTitle: string
    /** Chip on the AI-draft card while it hasn't been sent. */
    pendingApprovalLabel: string
    /** "Edit draft" footer button label. */
    editDraftLabel: string
    /** "Send reply" footer button label at rest. */
    sendReplyLabel: string
    /** "Send reply" footer button label while sending. */
    sendingLabel: string
}

/** Stepper order — fixed, mirrors `LeadsPipeline`'s own column order. */
const STAGE_ORDER: ReadonlyArray<LeadStage> = ["new", "contacted", "won", "lost"]

/**
 * The lead-detail drawer. See the file header for why the pipeline/message/AI-draft
 * content is a resolved view handed in, not fetched by this file.
 *
 * @param props - {@link LeadDetailDrawerProps}
 */
const LeadDetailDrawer = ({
    isOpen,
    onOpenChange,
    email,
    stage,
    message,
    source,
    draftReply,
    onDraftReplyChange,
    isEditingDraft = false,
    onEditDraft,
    onSendReply,
    isSending = false,
    isSkeleton = false,
    labels,
}: LeadDetailDrawerProps) => {
    /** One stepper pill — filled/accent for the lead's current stage, muted otherwise. */
    const stepperChip = (candidate: LeadStage): { tone: ChipTone } => ({ tone: candidate === stage ? "accent" : "default" })

    const detailRows: Array<KeyValueListItem> = [
        { key: "message", label: labels.messageLabel, value: message ?? labels.unknownValueLabel },
        { key: "source", label: labels.sourceLabel, value: source ?? labels.unknownValueLabel },
    ]

    const Body = ({ isSkeleton: skeleton }: SkeletonProps) => (
        <StackV
            gap={4}
            isSkeleton={skeleton}
            items={[
                () => (
                    <StackH
                        gap={2}
                        isSkeleton={skeleton}
                        items={STAGE_ORDER.map((candidate) => () => (
                            <Chip tone={stepperChip(candidate).tone} isSkeleton={skeleton} text={labels.stageLabels[candidate]} />
                        ))}
                    />
                ),
                () => <KeyValueList items={detailRows} isSkeleton={skeleton} />,
                () => (
                    <SurfaceCard
                        variant="nested"
                        padding={3}
                        isSkeleton={skeleton}
                        body={() => (
                            <StackV
                                gap={3}
                                isSkeleton={skeleton}
                                items={[
                                    () => (
                                        <StackH
                                            gap={2}
                                            align="center"
                                            justify="between"
                                            isSkeleton={skeleton}
                                            items={[
                                                () => (
                                                    <StackH
                                                        gap={2}
                                                        align="center"
                                                        isSkeleton={skeleton}
                                                        items={[
                                                            () => (
                                                                <SparkleIcon
                                                                    aria-hidden
                                                                    focusable="false"
                                                                    weight="fill"
                                                                    className="size-4 shrink-0 text-accent"
                                                                />
                                                            ),
                                                            () => (
                                                                <Typography
                                                                    size="sm"
                                                                    weight="semibold"
                                                                    isSkeleton={skeleton}
                                                                    text={labels.aiDraftTitle}
                                                                />
                                                            ),
                                                        ]}
                                                    />
                                                ),
                                                () => <Chip tone="warning" isSkeleton={skeleton} text={labels.pendingApprovalLabel} />,
                                            ]}
                                        />
                                    ),
                                    () =>
                                        !skeleton && isEditingDraft ? (
                                            <InputTextarea
                                                variant="secondary"
                                                ariaLabel={labels.aiDraftTitle}
                                                value={draftReply}
                                                onValueChange={onDraftReplyChange}
                                                rows={5}
                                            />
                                        ) : (
                                            <Typography size="sm" preserveWhitespace isSkeleton={skeleton} text={draftReply} />
                                        ),
                                ]}
                            />
                        )}
                    />
                ),
            ]}
        />
    )

    const Footer = ({ isSkeleton: skeleton }: SkeletonProps) => (
        <>
            <Button
                variant="outline"
                prefixIcon={PencilSimpleIcon}
                label={labels.editDraftLabel}
                onPress={onEditDraft}
                isDisabled={isSending}
                isSkeleton={skeleton}
            />
            <Button
                variant="primary"
                prefixIcon={PaperPlaneRightIcon}
                label={isSending ? labels.sendingLabel : labels.sendReplyLabel}
                onPress={onSendReply}
                isPending={isSending}
                isSkeleton={skeleton}
            />
        </>
    )

    return (
        <div>
            <DrawerShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={email}
                isSkeleton={isSkeleton}
                body={Body}
                footer={Footer}
            />
        </div>
    )
}

export { LeadDetailDrawer }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "overlay", name: "LeadDetailDrawer" } as const
