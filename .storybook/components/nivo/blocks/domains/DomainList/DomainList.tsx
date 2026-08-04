import { GlobeIcon, PlusIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `DomainList` — the user's registered domains, each with its status and expiry,
 * plus a header add-domain trigger. Two DATA states of the single shape: `empty`
 * and `with-rows`. Grounded in the real `DomainEntity`.
 */

/** The three domain statuses — mirrors `DomainStatus` (`active` · `expiring` · `expired`). */
export type DomainStatusKey = "active" | "expiring" | "expired"

/** One domain row — a subset of `DomainEntity`. */
export interface DomainRow {
    /** Domain id. */
    id: string
    /** Fully-qualified domain name (`DomainEntity.name`). */
    name: string
    /** Where the domain sits in its lifecycle (`DomainEntity.status`). */
    status: DomainStatusKey
    /** Already-formatted expiry date, or null when unknown (`DomainEntity.expiresAt`). */
    expiresAtLabel?: string | null
}

/** Props for {@link DomainList}. */
export interface DomainListProps {
    /** The domains, newest first. */
    domains: Array<DomainRow>
    /** Open the add-domain flow — the connected layer runs the `addDomain` mutation. */
    onAddDomain: () => void
    /**
     * Open one domain's detail overlay (registered/expiry/nameservers + renew).
     * Omit to render the rows as plain, non-interactive information — the row
     * only becomes pressable once a handler is actually wired.
     */
    onOpenDomain?: (domainId: string) => void
    /**
     * `true` → the list's own first fetch is in flight: the same titled card
     * renders a fixed count of domain-shaped rows with every content node
     * shimmering (§12b), and the header add trigger is dropped. Threaded straight
     * down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: DomainListLabels
}

/** The already-resolved copy the block renders. */
export interface DomainListLabels {
    /** Card title (e.g. "Domains"). */
    title: string
    /** Add-domain button label. */
    addLabel: string
    /** The three status labels, keyed by status. */
    statusOptions: Record<DomainStatusKey, string>
    /** Prefix before the expiry date (e.g. "Expires"). */
    expiresPrefix: string
    /** Empty-state title. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** Status → chip tone. Active is healthy (success), expiring wants attention (warning), expired is overdue (danger). */
const STATUS_TONE: Record<DomainStatusKey, ChipTone> = {
    active: "success",
    expiring: "warning",
    expired: "danger",
}

/** How many placeholder rows the loading mirror draws while `domains` hasn't landed yet. */
const SKELETON_ROW_COUNT = 3

/** Placeholder rows — sized like a real row so the shimmer mirrors the loaded shape. */
const SKELETON_DOMAINS: Array<DomainRow> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    name: "domain-name.com",
    status: "active",
    expiresAtLabel: "01/01/2027",
}))

/**
 * One domain row — name + status chip on the left, expiry on the right. The SAME
 * shape drives the loaded and the loading rows; `isSkeleton` threads down so a
 * loading row is the loaded row with its content nodes shimmering.
 */
const DomainRowItem = ({ domain, labels, onOpenDomain, isSkeleton }: {
    domain: DomainRow
    labels: DomainListLabels
    onOpenDomain?: (domainId: string) => void
    isSkeleton: boolean
}) => (
    <SurfaceCard
        variant="nested"
        padding={3}
        isSkeleton={isSkeleton}
        onPress={onOpenDomain ? () => onOpenDomain(domain.id) : undefined}
        body={() => (
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
                                () => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={domain.name} />,
                                () => (
                                    <Chip
                                        tone={STATUS_TONE[domain.status]}
                                        isSkeleton={isSkeleton}
                                        text={labels.statusOptions[domain.status]}
                                    />
                                ),
                            ]}
                        />
                    ),
                    ...(isSkeleton || domain.expiresAtLabel
                        ? [
                            () => (
                                <Typography
                                    size="xs"
                                    color="muted"
                                    isSkeleton={isSkeleton}
                                    text={`${labels.expiresPrefix} ${domain.expiresAtLabel}`}
                                />
                            ),
                        ]
                        : []),
                ]}
            />
        )}
    />
)

/**
 * The domain list. See the file header for why empty vs with-rows are states of
 * one shape rather than separate leaves, and how `isSkeleton` mirrors the loaded
 * rows.
 *
 * @param props - {@link DomainListProps}
 */
const DomainList = ({ domains, onAddDomain, onOpenDomain, isSkeleton = false, labels }: DomainListProps) => {
    const rows = isSkeleton ? SKELETON_DOMAINS : domains
    return (
        <div data-tier="block" data-component="DomainList">
            <SurfaceCard
                padding={3}
                label={labels.title}
                isSkeleton={isSkeleton}
                action={isSkeleton ? undefined : () => (
                    <Button
                        variant="secondary"
                        size="sm"
                        prefixIcon={PlusIcon}
                        label={labels.addLabel}
                        onPress={onAddDomain}
                    />
                )}
                body={() =>
                    !isSkeleton && domains.length === 0 ? (
                        <EmptyState
                            icon={GlobeIcon}
                            title={labels.emptyTitle}
                            description={labels.emptyDescription}
                        />
                    ) : (
                        <StackV
                            gap={2}
                            isSkeleton={isSkeleton}
                            items={rows.map((domain) => () => (
                                <DomainRowItem domain={domain} labels={labels} onOpenDomain={onOpenDomain} isSkeleton={isSkeleton} />
                            ))}
                        />
                    )
                }
            />
        </div>
    )
}

export { DomainList }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "DomainList" } as const
