import { EnvelopeSimpleIcon, EyeIcon, FloppyDiskIcon, SparkleIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputTextarea, SelectSingle } from "@sb-components/atoms/forms"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import {
    type ExpertSiteLeadRow,
    type ExpertSiteLeadStatusKey,
} from "@sb-components/nivo/blocks/expert-site/ExpertSiteLeads/ExpertSiteLeads"

/**
 * `ExpertSiteLeadsPipeline` — the full leads CRM surface: a 4-column pipeline
 * over `ExpertSiteLeadStatus` (`new → contacted → won → lost`), each column a
 * `SurfaceCard` header (status + count) over a stack of lead cards, each lead
 * card carrying name + meta, a status-move selector, a private note field, and
 * an AI "draft reply" affordance (the connected layer wires it to
 * `draftLeadReply`). One DATA state of the single shape switches on the whole
 * set: `empty` (no leads yet — a share-link invite replaces the four columns)
 * vs `with-leads` (the pipeline). Grounded in the real `ExpertSiteLeadEntity`.
 *
 * SUPERSEDES `ExpertSiteLeads` as the leads-CRM surface: the proposal's "Leads /
 * CRM" screen is a 4-column pipeline, not a single flat list, so this is a
 * different shape rather than a variant of the existing block. It reuses
 * `ExpertSiteLeads`' own `ExpertSiteLeadRow`/`ExpertSiteLeadStatusKey` types
 * (same entity, same status vocabulary) instead of forking a parallel shape.
 * `ExpertSiteLeads` is left in place — retiring it is a call for whoever wires
 * the CRM route, not this file.
 */

/** Props for {@link ExpertSiteLeadsPipeline}. */
export interface ExpertSiteLeadsPipelineProps {
    /** The leads, any order — the pipeline groups them by `status`. */
    leads: Array<ExpertSiteLeadRow>
    /** Move one lead to a new status (the hook for a column-to-column status move). */
    onStatusChange: (leadId: string, status: ExpertSiteLeadStatusKey) => void
    /** Edit the draft text of a lead's private note (not yet persisted). */
    onNoteChange: (leadId: string, note: string) => void
    /** Persist the lead's current note draft — the Save action commits it via `updateExpertSiteLead`. */
    onNoteSave: (leadId: string) => void
    /** Ask the AI to draft a reply to this lead — the connected layer wires this to `draftLeadReply`, and opens `LeadDetail` to show it. */
    onDraftReply: (leadId: string) => void
    /** Open the full detail of one lead — the connected layer opens `LeadDetail` for it (browse/act while the board stays visible behind it). */
    onOpenLead: (leadId: string) => void
    /** Copy the site's public link — the empty state's share invite. */
    onCopyLink: () => void
    /**
     * `true` → the site's own first fetch is in flight: the same four-column
     * layout renders a fixed count of lead-shaped cards per column, every
     * content node shimmering (§12b). Threaded straight down — never fed to a
     * separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: ExpertSiteLeadsPipelineLabels
}

/** The already-resolved copy the block renders. */
export interface ExpertSiteLeadsPipelineLabels {
    /** The four status labels, keyed by status — column headers AND the per-card status options. */
    statusOptions: Record<ExpertSiteLeadStatusKey, string>
    /** Accessible name for the per-card status-move selector. */
    statusLabel: string
    /** Label for the per-card private-note field. */
    noteLabel: string
    /** Placeholder for the per-card private-note field. */
    notePlaceholder: string
    /** Label for the per-card note Save action. */
    saveNoteLabel: string
    /** "Draft reply" affordance label. */
    draftReplyLabel: string
    /** Accessible name for the "open lead detail" icon button — combined with the lead's own name. */
    openLeadAriaLabel: string
    /** Empty-state title (no leads across any column). */
    emptyTitle: string
    /** Empty-state supporting line — the share-link invite. */
    emptyDescription: string
    /** Empty-state action label (copies the site link). */
    copyLinkLabel: string
}

/** The four statuses in flow order — the four columns, left to right. */
const STATUS_ORDER: Array<ExpertSiteLeadStatusKey> = ["new", "contacted", "won", "lost"]

/** Column count per container step — one column narrow, up to all four from `@app-lg`. */
const PIPELINE_COLUMNS = { base: 1 as const, sm: 2 as const, lg: 4 as const }

/** Placeholder rows — one or two per status, sized like real cards so the shimmer mirrors the loaded shape. */
const SKELETON_LEADS: Array<ExpertSiteLeadRow> = [
    { id: "skeleton-new-1", name: "Lead name", contact: "lead@example.com", message: "A short enquiry.", status: "new", createdAtLabel: "01/01/2026 09:00", note: null },
    { id: "skeleton-new-2", name: "Lead name", contact: "0912 345 678", message: null, status: "new", createdAtLabel: "01/01/2026 08:00", note: null },
    { id: "skeleton-contacted-1", name: "Lead name", contact: "lead@example.com", message: null, status: "contacted", createdAtLabel: "31/12/2025 17:00", note: null },
    { id: "skeleton-contacted-2", name: "Lead name", contact: "lead@example.com", message: null, status: "contacted", createdAtLabel: "31/12/2025 15:00", note: null },
    { id: "skeleton-won-1", name: "Lead name", contact: "lead@example.com", message: null, status: "won", createdAtLabel: "30/12/2025 12:00", note: null },
    { id: "skeleton-lost-1", name: "Lead name", contact: "lead@example.com", message: null, status: "lost", createdAtLabel: "29/12/2025 10:00", note: null },
]

/** Buckets the given rows by `status`, keeping `STATUS_ORDER`'s four keys always present. */
const groupByStatus = (rows: Array<ExpertSiteLeadRow>): Record<ExpertSiteLeadStatusKey, Array<ExpertSiteLeadRow>> => {
    const grouped: Record<ExpertSiteLeadStatusKey, Array<ExpertSiteLeadRow>> = { new: [], contacted: [], won: [], lost: [] }
    for (const lead of rows) {
        grouped[lead.status].push(lead)
    }
    return grouped
}

/**
 * One lead card — name + an "open detail" icon button (opens `LeadDetail`),
 * meta (contact + arrival time), optional message, the status-move selector,
 * a private note field (Save commits it via `updateExpertSiteLead`), and the
 * AI draft-reply affordance. The SAME shape drives the loaded and the loading
 * cards; `isSkeleton` threads down so a loading card is the loaded card with
 * its content nodes shimmering.
 */
const LeadCard = ({ lead, options, onStatusChange, onNoteChange, onNoteSave, onDraftReply, onOpenLead, labels, isSkeleton }: {
    lead: ExpertSiteLeadRow
    options: Array<{ value: ExpertSiteLeadStatusKey; label: string }>
    onStatusChange: (leadId: string, status: ExpertSiteLeadStatusKey) => void
    onNoteChange: (leadId: string, note: string) => void
    onNoteSave: (leadId: string) => void
    onDraftReply: (leadId: string) => void
    onOpenLead: (leadId: string) => void
    labels: ExpertSiteLeadsPipelineLabels
    isSkeleton: boolean
}) => (
    <SurfaceCard
        variant="nested"
        padding={3}
        isSkeleton={isSkeleton}
        body={() => (
            <StackV
                gap={2}
                principle="title-subtitle"
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <StackH
                            gap={2}
                            justify="between"
                            isSkeleton={isSkeleton}
                            items={[
                                () => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={lead.name} />,
                                () => (
                                    <Button
                                        isIconOnly
                                        variant="ghost"
                                        size="sm"
                                        prefixIcon={EyeIcon}
                                        isSkeleton={isSkeleton}
                                        ariaLabel={`${labels.openLeadAriaLabel} ${lead.name}`}
                                        onPress={isSkeleton ? undefined : () => onOpenLead(lead.id)}
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
                            text={`${lead.contact} · ${lead.createdAtLabel}`}
                        />
                    ),
                    ...(isSkeleton || lead.message
                        ? [
                            () => (
                                <Typography
                                    size="xs"
                                    preserveWhitespace
                                    isSkeleton={isSkeleton}
                                    text={lead.message ?? ""}
                                />
                            ),
                        ]
                        : []),
                    () => (
                        <StackH
                            gap={2}
                            principle="icon-text"
                            at="sm"
                            isSkeleton={isSkeleton}
                            items={[
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
                                () => (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        prefixIcon={SparkleIcon}
                                        isSkeleton={isSkeleton}
                                        label={labels.draftReplyLabel}
                                        onPress={isSkeleton ? undefined : () => onDraftReply(lead.id)}
                                    />
                                ),
                            ]}
                        />
                    ),
                    () => (
                        <InputTextarea
                            variant="secondary"
                            label={labels.noteLabel}
                            placeholder={labels.notePlaceholder}
                            rows={2}
                            value={lead.note ?? ""}
                            isSkeleton={isSkeleton}
                            onValueChange={(next) => onNoteChange(lead.id, next)}
                        />
                    ),
                    () => (
                        <Button
                            variant="secondary"
                            size="sm"
                            prefixIcon={FloppyDiskIcon}
                            isSkeleton={isSkeleton}
                            label={labels.saveNoteLabel}
                            onPress={isSkeleton ? undefined : () => onNoteSave(lead.id)}
                        />
                    ),
                ]}
            />
        )}
    />
)

/**
 * One pipeline column — a status header (label + count) over the stack of lead
 * cards sitting in that status. Renders bare (no card rows) when the status has
 * no leads; the OVERALL empty state (every status empty) is handled one level up.
 */
const PipelineColumn = ({ status, leads, options, onStatusChange, onNoteChange, onNoteSave, onDraftReply, onOpenLead, labels, isSkeleton }: {
    status: ExpertSiteLeadStatusKey
    leads: Array<ExpertSiteLeadRow>
    options: Array<{ value: ExpertSiteLeadStatusKey; label: string }>
    onStatusChange: (leadId: string, status: ExpertSiteLeadStatusKey) => void
    onNoteChange: (leadId: string, note: string) => void
    onNoteSave: (leadId: string) => void
    onDraftReply: (leadId: string) => void
    onOpenLead: (leadId: string) => void
    labels: ExpertSiteLeadsPipelineLabels
    isSkeleton: boolean
}) => (
    <SurfaceCard
        padding={3}
        label={labels.statusOptions[status]}
        labelEnd={String(leads.length)}
        isSkeleton={isSkeleton}
        body={() =>
            leads.length === 0 ? null : (
                <StackV
                    gap={2}
                    isSkeleton={isSkeleton}
                    items={leads.map((lead) => () => (
                        <LeadCard
                            lead={lead}
                            options={options}
                            onStatusChange={onStatusChange}
                            onNoteChange={onNoteChange}
                            onNoteSave={onNoteSave}
                            onDraftReply={onDraftReply}
                            onOpenLead={onOpenLead}
                            labels={labels}
                            isSkeleton={isSkeleton}
                        />
                    ))}
                />
            )
        }
    />
)

/**
 * The leads pipeline. See the file header for why this supersedes `ExpertSiteLeads`
 * and how `isSkeleton` mirrors the loaded columns.
 *
 * @param props - {@link ExpertSiteLeadsPipelineProps}
 */
const ExpertSiteLeadsPipeline = ({
    leads,
    onStatusChange,
    onNoteChange,
    onNoteSave,
    onDraftReply,
    onOpenLead,
    onCopyLink,
    isSkeleton = false,
    labels,
}: ExpertSiteLeadsPipelineProps) => {
    const rows = isSkeleton ? SKELETON_LEADS : leads
    const isEmpty = !isSkeleton && leads.length === 0
    const grouped = groupByStatus(rows)
    const options = STATUS_ORDER.map((status) => ({ value: status, label: labels.statusOptions[status] }))

    return (
        <div data-tier="block" data-component="ExpertSiteLeadsPipeline">
            {isEmpty ? (
                <SurfaceCard
                    padding={3}
                    body={() => (
                        <EmptyState
                            icon={EnvelopeSimpleIcon}
                            title={labels.emptyTitle}
                            description={labels.emptyDescription}
                            action={() => (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    label={labels.copyLinkLabel}
                                    onPress={onCopyLink}
                                />
                            )}
                        />
                    )}
                />
            ) : (
                <Grid
                    columns={PIPELINE_COLUMNS}
                    principle="content-row"
                    isSkeleton={isSkeleton}
                    items={STATUS_ORDER.map((status) => ({
                        key: status,
                        content: () => (
                            <PipelineColumn
                                status={status}
                                leads={grouped[status]}
                                options={options}
                                onStatusChange={onStatusChange}
                                onNoteChange={onNoteChange}
                                onNoteSave={onNoteSave}
                                onDraftReply={onDraftReply}
                                onOpenLead={onOpenLead}
                                labels={labels}
                                isSkeleton={isSkeleton}
                            />
                        ),
                    }))}
                />
            )}
        </div>
    )
}

export { ExpertSiteLeadsPipeline }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ExpertSiteLeadsPipeline" } as const
