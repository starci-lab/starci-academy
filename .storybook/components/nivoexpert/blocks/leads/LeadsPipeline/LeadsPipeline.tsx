import { UsersThreeIcon } from "@phosphor-icons/react"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard, SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { Grid, type GridItem } from "@sb-components/frames/Grid/Grid"

/**
 * `LeadsPipeline` -- the leads board: every lead sorted into one of four fixed
 * pipeline stages (new -> contacted -> won/lost), one column per stage. Tapping a
 * row is the select action -- the real app opens `LeadDetailDrawer` with the
 * tapped lead's id. The board is one shape; `isSkeleton`/`empty` are STATES of
 * it, not separate leaves.
 */

/** The four fixed pipeline stages -- order is the board's own column order. */
export type LeadStage = "new" | "contacted" | "won" | "lost"

/** One lead -- a subset of the real lead record. */
export interface LeadRowView {
    /** Stable row id -- the value reported to {@link LeadsPipelineProps.onSelectLead}. */
    id: string
    /** The lead's email -- the row's primary line. */
    email: string
    /** What the lead is interested in, when known -- the row's secondary line. */
    interest?: string | null
    /** Where the lead came from (e.g. "Landing page") -- shown as trailing metadata. */
    source?: string | null
    /** Which column this lead sits in. */
    stage: LeadStage
}

/** Props for {@link LeadsPipeline}. */
export interface LeadsPipelineProps {
    /** Every lead, any stage -- this block sorts them into columns itself. Empty is the `empty` state. */
    leads: Array<LeadRowView>
    /** Fired with a lead id when its row is tapped -- the caller opens `LeadDetailDrawer` with it. */
    onSelectLead: (leadId: string) => void
    /**
     * `true` -> the board's own first fetch is in flight: every column keeps its
     * label and draws a fixed count of lead-shaped rows shimmering (§12b),
     * threaded straight down -- never a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: LeadsPipelineLabels
}

/** The already-resolved copy the block renders. */
export interface LeadsPipelineLabels {
    /** The four stage labels, keyed by stage -- also the four column headers. */
    stageLabels: Record<LeadStage, string>
    /** Shown inside a column that has no leads at that stage. */
    emptyColumnLabel: string
    /** Board-wide empty-state title -- no leads at all yet. */
    emptyTitle: string
    /** Board-wide empty-state supporting line. */
    emptyDescription: string
}

/** Column order -- fixed, not caller-supplied (mirrors the real funnel: new -> contacted -> won/lost). */
const STAGE_ORDER: ReadonlyArray<LeadStage> = ["new", "contacted", "won", "lost"]

/** Stage -> count-chip tone. New is the active-attention stage, won is a success, lost is neutral. */
const STAGE_TONE: Record<LeadStage, ChipTone> = {
    new: "accent",
    contacted: "warning",
    won: "success",
    lost: "default",
}

/** How many placeholder rows each column's loading mirror draws while `leads` hasn't landed yet. */
const SKELETON_ROWS_PER_COLUMN = 2

/** Placeholder leads, two per stage -- sized like a real row so the shimmer mirrors the loaded shape. */
const SKELETON_LEADS: Array<LeadRowView> = STAGE_ORDER.flatMap((stage) =>
    Array.from({ length: SKELETON_ROWS_PER_COLUMN }, (_unused, index) => ({
        id: `skeleton-${stage}-${index}`,
        email: "lead@example.com",
        interest: "Interested in a course",
        source: "Landing page",
        stage,
    })),
)

/**
 * The leads pipeline board. See the file header for why the four columns are
 * DATA (a per-stage filter of one list) rather than four separate blocks.
 *
 * @param props - {@link LeadsPipelineProps}
 */
const LeadsPipeline = ({ leads, onSelectLead, isSkeleton = false, labels }: LeadsPipelineProps) => {
    const rows = isSkeleton ? SKELETON_LEADS : leads

    /** One stage's column: its label + count chip, then its leads (or the empty note). */
    const Column = (stage: LeadStage) => {
        const stageLeads = rows.filter((lead) => lead.stage === stage)
        const items: Array<SurfaceCardListItem> = stageLeads.map((lead) => ({
            key: lead.id,
            title: lead.email,
            subtitle: lead.interest ?? undefined,
            metaText: lead.source ?? undefined,
            onPress: isSkeleton ? undefined : () => onSelectLead(lead.id),
        }))
        return (
            <SurfaceCard
                variant="nested"
                padding={3}
                label={labels.stageLabels[stage]}
                isSkeleton={isSkeleton}
                action={isSkeleton ? undefined : () => <Chip tone={STAGE_TONE[stage]} text={String(stageLeads.length)} />}
                body={() => (
                    <SurfaceCardList
                        items={items}
                        isSkeleton={isSkeleton}
                        emptyState={() => <Typography size="xs" color="muted" text={labels.emptyColumnLabel} />}
                    />
                )}
            />
        )
    }

    const columns: Array<GridItem> = STAGE_ORDER.map((stage) => ({ key: stage, content: () => Column(stage) }))

    return (
        <div data-tier="block" data-component="LeadsPipeline">
            {!isSkeleton && leads.length === 0 ? (
                <EmptyState icon={UsersThreeIcon} title={labels.emptyTitle} description={labels.emptyDescription} />
            ) : (
                <Grid columns={{ base: 1, md: 4 }} gap={4} items={columns} isSkeleton={isSkeleton} />
            )}
        </div>
    )
}

export { LeadsPipeline }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "LeadsPipeline" } as const
