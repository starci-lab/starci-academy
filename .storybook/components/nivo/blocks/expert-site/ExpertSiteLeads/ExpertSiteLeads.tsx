import { EnvelopeSimpleIcon } from "@phosphor-icons/react"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { SelectSingle } from "@sb-components/atoms/forms/Select/Select"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ExpertSiteLeads` — the owner-side list of contact requests, each workable
 * through New → Contacted → Won/Lost. One composition: a titled card with a row
 * per lead (name + status chip + time, contact, message, status selector). Two
 * DATA states of the single shape: `empty` and `with-leads`. Grounded in the
 * real `ExpertSiteLeads`; maps onto `ExpertSiteLeadEntity`.
 */

/** The four follow-up states — mirrors `ExpertSiteLeadStatus`. */
export type ExpertSiteLeadStatusKey = "new" | "contacted" | "won" | "lost"

/** One lead row — a subset of `ExpertSiteLeadEntity`. */
export interface ExpertSiteLeadRow {
    /** Lead id. */
    id: string
    /** Name the visitor gave (`ExpertSiteLeadEntity.name`). */
    name: string
    /** How to reach them back (`ExpertSiteLeadEntity.contact`). */
    contact: string
    /** What they wrote, or null (`ExpertSiteLeadEntity.message`). */
    message?: string | null
    /** Where the lead sits in the flow (`ExpertSiteLeadEntity.status`). */
    status: ExpertSiteLeadStatusKey
    /** Already-formatted arrival time (`ExpertSiteLeadEntity.createdAt`). */
    createdAtLabel: string
    /** Private note the expert keeps on this lead, or null (`ExpertSiteLeadEntity.note`). */
    note?: string | null
}

/** Props for {@link ExpertSiteLeads}. */
export interface ExpertSiteLeadsProps {
    /** The leads, newest first. */
    leads: Array<ExpertSiteLeadRow>
    /** Move one lead to a new status. */
    onStatusChange: (leadId: string, status: ExpertSiteLeadStatusKey) => void
    /**
     * `true` → the list's own first fetch is in flight: the same titled card
     * renders a fixed count of lead-shaped rows with every content node
     * shimmering (§12b). Threaded straight down — never fed to a separate
     * skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: ExpertSiteLeadsLabels
}

/** The already-resolved copy the block renders. */
export interface ExpertSiteLeadsLabels {
    /** Card title (e.g. "Leads"). */
    title: string
    /** Accessible name for the per-row status selector. */
    statusLabel: string
    /** The four status labels, keyed by status. */
    statusOptions: Record<ExpertSiteLeadStatusKey, string>
    /** Empty-state title. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** The four statuses in flow order — the same order the selector lists them. */
const STATUS_ORDER: Array<ExpertSiteLeadStatusKey> = ["new", "contacted", "won", "lost"]

/** Status → chip tone. `new` leads on accent; won is success, lost is neutral. */
const STATUS_TONE: Record<ExpertSiteLeadStatusKey, ChipTone> = {
    new: "accent",
    contacted: "warning",
    won: "success",
    lost: "default",
}

/** How many placeholder rows the loading mirror draws while `leads` hasn't landed yet. */
const SKELETON_ROW_COUNT = 3

/** Placeholder rows — sized like a real row so the shimmer mirrors the loaded shape. */
const SKELETON_LEADS: Array<ExpertSiteLeadRow> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    name: "Lead name",
    contact: "lead@example.com",
    message: "A short enquiry the visitor left through the contact form.",
    status: "new",
    createdAtLabel: "01/01/2026 09:00",
}))

/**
 * One lead row — name + status chip + arrival time, contact, optional message, and
 * the status selector. The SAME shape drives the loaded and the loading rows;
 * `isSkeleton` threads down so a loading row is the loaded row with its content
 * nodes shimmering.
 */
const LeadRowItem = ({ lead, options, onStatusChange, labels, isSkeleton }: {
    lead: ExpertSiteLeadRow
    options: Array<{ value: ExpertSiteLeadStatusKey; label: string }>
    onStatusChange: (leadId: string, status: ExpertSiteLeadStatusKey) => void
    labels: ExpertSiteLeadsLabels
    isSkeleton: boolean
}) => (
    <SurfaceCard
        variant="nested"
        padding={3}
        isSkeleton={isSkeleton}
        body={() => (
            <StackV
                gap={3}
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <StackH
                            gap={3}
                            justify="between"
                            isSkeleton={isSkeleton}
                            items={[
                                () => (
                                    <StackH
                                        gap={3}
                                        isSkeleton={isSkeleton}
                                        items={[
                                            () => (
                                                <Typography
                                                    size="sm"
                                                    weight="medium"
                                                    isSkeleton={isSkeleton}
                                                    text={lead.name}
                                                />
                                            ),
                                            () => (
                                                <Chip
                                                    tone={STATUS_TONE[lead.status]}
                                                    isSkeleton={isSkeleton}
                                                    text={labels.statusOptions[lead.status]}
                                                />
                                            ),
                                        ]}
                                    />
                                ),
                                () => (
                                    <Typography
                                        size="xs"
                                        color="muted"
                                        isSkeleton={isSkeleton}
                                        text={lead.createdAtLabel}
                                    />
                                ),
                            ]}
                        />
                    ),
                    () => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={lead.contact} />,
                    ...(lead.message
                        ? [
                            () => (
                                <Typography
                                    size="sm"
                                    preserveWhitespace
                                    isSkeleton={isSkeleton}
                                    text={lead.message ?? ""}
                                />
                            ),
                        ]
                        : []),
                    () => (
                        <SelectSingle
                            ariaLabel={labels.statusLabel}
                            options={options}
                            value={lead.status}
                            isSkeleton={isSkeleton}
                            onValueChange={(next) =>
                                onStatusChange(lead.id, next as ExpertSiteLeadStatusKey)
                            }
                        />
                    ),
                ]}
            />
        )}
    />
)

/**
 * The leads list. See the file header for why empty vs with-leads are states of
 * one shape rather than separate leaves, and how `isSkeleton` mirrors the loaded
 * rows.
 *
 * @param props - {@link ExpertSiteLeadsProps}
 */
const ExpertSiteLeads = ({ leads, onStatusChange, isSkeleton = false, labels }: ExpertSiteLeadsProps) => {
    const options = STATUS_ORDER.map((status) => ({ value: status, label: labels.statusOptions[status] }))
    const rows = isSkeleton ? SKELETON_LEADS : leads

    return (
        <div data-tier="block" data-component="ExpertSiteLeads">
            <SurfaceCard
                padding={3}
                label={labels.title}
                isSkeleton={isSkeleton}
                body={() =>
                    !isSkeleton && leads.length === 0 ? (
                        <EmptyState
                            icon={EnvelopeSimpleIcon}
                            title={labels.emptyTitle}
                            description={labels.emptyDescription}
                        />
                    ) : (
                        <StackV
                            gap={2}
                            isSkeleton={isSkeleton}
                            items={rows.map((lead) => () => (
                                <LeadRowItem
                                    lead={lead}
                                    options={options}
                                    onStatusChange={onStatusChange}
                                    labels={labels}
                                    isSkeleton={isSkeleton}
                                />
                            ))}
                        />
                    )
                }
            />
        </div>
    )
}

export { ExpertSiteLeads }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ExpertSiteLeads" } as const
