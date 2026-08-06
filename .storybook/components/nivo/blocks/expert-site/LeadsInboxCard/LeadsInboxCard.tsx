import { ArrowRightIcon } from "@phosphor-icons/react"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import type { ExpertSiteLeadStatusKey } from "@sb-components/nivo/blocks/expert-site/ExpertSiteLeads/ExpertSiteLeads"

/**
 * `LeadsInboxCard` — the overview's leads TILE: the whole card is one press
 * target that drills into the leads CRM (`ExpertSiteLeadsPipeline`). Shows a big
 * total-leads count plus a mini pipeline (one count per `ExpertSiteLeadStatus`).
 * Two DATA states of the single shape: `empty` (no leads yet — invites sharing
 * the site link, mirrored via `isEmpty`) and `with-leads` (mini pipeline shown,
 * "N new" badge when any are unworked). Grounded in the real
 * `ExpertSiteLeadEntity` — counts are `count()` by `status`, never fabricated.
 */

/** The four pipeline counts, keyed by `ExpertSiteLeadStatus` — mirrors `ExpertSiteLeads`. */
export type LeadsInboxCounts = Record<ExpertSiteLeadStatusKey, number>

/** Props for {@link LeadsInboxCard}. */
export interface LeadsInboxCardProps {
    /** Lead counts by status — the big number is their sum. */
    counts: LeadsInboxCounts
    /** Drill into the full leads CRM (`ExpertSiteLeadsPipeline`). */
    onOpenCrm: () => void
    /**
     * `true` → the site's own first fetch is in flight: the same tile renders
     * with the title, count, caption, mini pipeline, and drill link all
     * shimmering, and the whole-card press target is disabled. Threaded straight
     * down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: LeadsInboxCardLabels
}

/** The already-resolved copy the block renders. */
export interface LeadsInboxCardLabels {
    /** Tile title (e.g. "Leads (CRM)"). */
    title: string
    /** Prefix before the unworked count in the "N new" badge (e.g. "New"). */
    newBadgePrefix: string
    /** Caption under the count when leads have arrived. */
    caption: string
    /** Caption under the count when there are no leads yet — the share-link invite. */
    emptyCaption: string
    /** The four status labels, keyed by status — used on the mini pipeline chips. */
    statusOptions: Record<ExpertSiteLeadStatusKey, string>
    /** Drill-link text (e.g. "Open CRM"). */
    openCrmLabel: string
    /** Accessible name for the whole-card press target. */
    openCrmAriaLabel: string
}

/** The four statuses in flow order — same order the mini pipeline reads left to right. */
const STATUS_ORDER: Array<ExpertSiteLeadStatusKey> = ["new", "contacted", "won", "lost"]

/** Status → chip tone. Mirrors `ExpertSiteLeads`' own mapping so the vocabulary stays one. */
const STATUS_TONE: Record<ExpertSiteLeadStatusKey, ChipTone> = {
    new: "accent",
    contacted: "warning",
    won: "success",
    lost: "default",
}

/** Placeholder counts — sized like a real live tile so the shimmer mirrors the loaded shape. */
const SKELETON_COUNTS: LeadsInboxCounts = { new: 3, contacted: 5, won: 3, lost: 1 }

const sumCounts = (counts: LeadsInboxCounts) => counts.new + counts.contacted + counts.won + counts.lost

/**
 * The leads-inbox tile. See the file header for why empty vs with-leads are
 * states of one shape rather than separate leaves, and how `isSkeleton` mirrors
 * the loaded tile.
 *
 * @param props - {@link LeadsInboxCardProps}
 */
const LeadsInboxCard = ({ counts, onOpenCrm, isSkeleton = false, labels }: LeadsInboxCardProps) => {
    const rowCounts = isSkeleton ? SKELETON_COUNTS : counts
    const total = sumCounts(rowCounts)
    const isEmpty = !isSkeleton && total === 0

    return (
        <div data-tier="block" data-component="LeadsInboxCard">
            <SurfaceCard
                padding={3}
                onPress={isSkeleton ? undefined : onOpenCrm}
                isDisabled={isSkeleton}
                ariaLabel={labels.openCrmAriaLabel}
                body={() => (
                    <StackV
                        gap={3}
                        principle="sibling-stack"
                        isSkeleton={isSkeleton}
                        items={[
                            () => (
                                <StackH
                                    gap={3}
                                    justify="between"
                                    isSkeleton={isSkeleton}
                                    items={[
                                        () => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={labels.title} />,
                                        ...(isSkeleton || rowCounts.new > 0
                                            ? [
                                                () => (
                                                    <Chip
                                                        tone="accent"
                                                        isSkeleton={isSkeleton}
                                                        text={`${labels.newBadgePrefix} ${rowCounts.new}`}
                                                    />
                                                ),
                                            ]
                                            : []),
                                    ]}
                                />
                            ),
                            () => (
                                <Typography
                                    size="h2"
                                    weight="bold"
                                    tabularNums
                                    isSkeleton={isSkeleton}
                                    text={String(total)}
                                />
                            ),
                            () => (
                                <Typography
                                    size="xs"
                                    color="muted"
                                    isSkeleton={isSkeleton}
                                    text={isEmpty ? labels.emptyCaption : labels.caption}
                                />
                            ),
                            ...(isSkeleton || !isEmpty
                                ? [
                                    () => (
                                        <StackH
                                            gap={2}
                                            principle="icon-text"
                                            at="sm"
                                            isSkeleton={isSkeleton}
                                            items={STATUS_ORDER.map((status) => () => (
                                                <Chip
                                                    tone={STATUS_TONE[status]}
                                                    isSkeleton={isSkeleton}
                                                    text={`${labels.statusOptions[status]} ${rowCounts[status]}`}
                                                />
                                            ))}
                                        />
                                    ),
                                ]
                                : []),
                            () => (
                                <Typography
                                    size="sm"
                                    weight="medium"
                                    color="accent"
                                    suffixIcon={ArrowRightIcon}
                                    iconSlide={!isSkeleton}
                                    isSkeleton={isSkeleton}
                                    text={labels.openCrmLabel}
                                />
                            ),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { LeadsInboxCard }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "LeadsInboxCard" } as const
