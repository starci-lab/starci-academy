import { PencilSimpleIcon, PlusIcon, StorefrontIcon, TrashIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ExpertSiteOfferingsEditor` — the owner-side manager for the offerings an
 * expert publishes. One composition: a titled card with an Add action holding a
 * row per offering (title + price, edit + remove). Two DATA states of the single
 * shape: `empty` and `with-items`. Grounded in the real
 * `ExpertSiteOfferingsEditor`; maps onto `ExpertSiteOfferingEntity`.
 */

/** One offering row — a subset of `ExpertSiteOfferingEntity`. */
export interface ExpertSiteOfferingRow {
    /** Offering id. */
    id: string
    /** Offering title (`ExpertSiteOfferingEntity.title`). */
    title: string
    /** Display price, or null when none (`ExpertSiteOfferingEntity.priceText`). */
    priceText?: string | null
}

/** Props for {@link ExpertSiteOfferingsEditor}. */
export interface ExpertSiteOfferingsEditorProps {
    /** The offerings, in display order (`sortIndex`). */
    offerings: Array<ExpertSiteOfferingRow>
    /** Open the add-offering flow. */
    onAdd: () => void
    /** Open the edit flow for one offering. */
    onEdit: (offeringId: string) => void
    /** Remove one offering. */
    onRemove: (offeringId: string) => void
    /**
     * `true` → the list's own first fetch is in flight: the same titled card
     * renders a fixed count of offering-shaped rows with every content node
     * shimmering (§12b). The Add action and per-row edit/remove controls drop
     * while it loads. Threaded straight down — never a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: ExpertSiteOfferingsEditorLabels
}

/** The already-resolved copy the block renders. */
export interface ExpertSiteOfferingsEditorLabels {
    /** Card title (e.g. "Offerings"). */
    title: string
    /** Add-button label. */
    addLabel: string
    /** Accessible name for a row's edit button. */
    editLabel: string
    /** Accessible name for a row's remove button. */
    removeLabel: string
    /** Empty-state title. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** How many placeholder rows the loading mirror draws while `offerings` hasn't landed yet. */
const SKELETON_ROW_COUNT = 3

/** Placeholder rows — sized like a real row so the shimmer mirrors the loaded shape. */
const SKELETON_OFFERINGS: Array<ExpertSiteOfferingRow> = Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    title: "Offering title",
    priceText: "0,000,000 VND",
}))

/**
 * One offering row — title + optional price on the left; edit/remove controls on
 * the right (dropped while loading). The SAME shape drives the loaded and the
 * loading rows; `isSkeleton` threads down so a loading row is the loaded row with
 * its content nodes shimmering.
 */
const OfferingRowItem = ({ offering, onEdit, onRemove, labels, isSkeleton }: {
    offering: ExpertSiteOfferingRow
    onEdit: (offeringId: string) => void
    onRemove: (offeringId: string) => void
    labels: ExpertSiteOfferingsEditorLabels
    isSkeleton: boolean
}) => (
    <SurfaceCard
        variant="nested"
        padding={3}
        isSkeleton={isSkeleton}
        body={() => (
            <StackH
                gap={3}
                principle="flex-action"
                justify="between"
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <StackV
                            gap={1}
                            classNames={["min-w-0"]}
                            isSkeleton={isSkeleton}
                            items={[
                                () => (
                                    <Typography
                                        size="sm"
                                        weight="medium"
                                        truncate
                                        isSkeleton={isSkeleton}
                                        text={offering.title}
                                    />
                                ),
                                ...(offering.priceText
                                    ? [
                                        () => (
                                            <Typography
                                                size="xs"
                                                color="muted"
                                                isSkeleton={isSkeleton}
                                                text={offering.priceText ?? ""}
                                            />
                                        ),
                                    ]
                                    : []),
                            ]}
                        />
                    ),
                    ...(!isSkeleton
                        ? [
                            () => (
                                <StackH
                                    gap={2}
                                    classNames={["shrink-0"]}
                                    items={[
                                        () => (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                isIconOnly
                                                prefixIcon={PencilSimpleIcon}
                                                ariaLabel={labels.editLabel}
                                                onPress={() => onEdit(offering.id)}
                                            />
                                        ),
                                        () => (
                                            <Button
                                                variant="danger-soft"
                                                size="sm"
                                                isIconOnly
                                                prefixIcon={TrashIcon}
                                                ariaLabel={labels.removeLabel}
                                                onPress={() => onRemove(offering.id)}
                                            />
                                        ),
                                    ]}
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
 * The offerings manager. See the file header for why empty vs with-items are
 * states of one shape rather than separate leaves, and how `isSkeleton` mirrors
 * the loaded rows.
 *
 * @param props - {@link ExpertSiteOfferingsEditorProps}
 */
const ExpertSiteOfferingsEditor = ({
    offerings,
    onAdd,
    onEdit,
    onRemove,
    isSkeleton = false,
    labels,
}: ExpertSiteOfferingsEditorProps) => {
    const AddButton = () => (
        <Button variant="secondary" size="sm" prefixIcon={PlusIcon} label={labels.addLabel} onPress={onAdd} />
    )

    const rows = isSkeleton ? SKELETON_OFFERINGS : offerings

    return (
        <div data-tier="block" data-component="ExpertSiteOfferingsEditor">
            <SurfaceCard
                padding={3}
                label={labels.title}
                isSkeleton={isSkeleton}
                action={isSkeleton ? undefined : AddButton}
                body={() =>
                    !isSkeleton && offerings.length === 0 ? (
                        <EmptyState
                            icon={StorefrontIcon}
                            title={labels.emptyTitle}
                            description={labels.emptyDescription}
                        />
                    ) : (
                        <StackV
                            gap={2}
                            isSkeleton={isSkeleton}
                            items={rows.map((offering) => () => (
                                <OfferingRowItem
                                    offering={offering}
                                    onEdit={onEdit}
                                    onRemove={onRemove}
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

export { ExpertSiteOfferingsEditor }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ExpertSiteOfferingsEditor" } as const
