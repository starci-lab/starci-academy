import React from "react"
import {
    CaretUpIcon,
    CaretDownIcon,
    TrashIcon,
    ArrowSquareOutIcon as ExternalLinkIcon,
    SealCheckIcon as VerifiedIcon,
} from "@phosphor-icons/react"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip } from "@/components/atoms/chips/Chip"
import { Cluster } from "@/components/frames/Cluster"
import { MediaCard } from "@/components/blocks/cards/MediaCard"
import { StatusChip } from "@/components/blocks/chips/StatusChip"
import type { QueryUserPinnedProjectItem } from "@/modules/api/graphql/queries/types/user-pinned-projects"

/** Already-translated strings {@link PinnedProjectCard} renders — resolved by the connected caller, never `t()` itself. */
export interface PinnedProjectCardLabels {
    /** Label for the "Verified by StarCi" chip on a verified course pin. */
    verified: string
    /** Accessible name for the move-up control. */
    moveUp: string
    /** Accessible name for the move-down control. */
    moveDown: string
    /** Accessible name for the outbound-link control. */
    open: string
    /** Accessible name for the remove control. */
    remove: string
    /** Fallback title shown when a pin has none. */
    untitled: string
}

/** Props for {@link PinnedProjectCard}. */
export interface PinnedProjectCardProps {
    /** The pinned project to render (list-item data prop — store can't index it). */
    pin: QueryUserPinnedProjectItem
    /**
     * Owner-only management mode. When true the card renders move/remove controls
     * instead of behaving as a plain outbound link.
     */
    manage?: boolean
    /** Whether the move-up control is enabled (false for the first pin). */
    canMoveUp?: boolean
    /** Whether the move-down control is enabled (false for the last pin). */
    canMoveDown?: boolean
    /** True while a mutation touching this pin is in flight (disables controls). */
    isBusy?: boolean
    /** Move this pin one slot earlier. */
    onMoveUp?: (id: string) => void
    /** Move this pin one slot later. */
    onMoveDown?: (id: string) => void
    /** Remove this pin. */
    onRemove?: (id: string) => void
    /** Already-translated strings — see {@link PinnedProjectCardLabels}. */
    labels: PinnedProjectCardLabels
}

/**
 * Presentational card for a single pinned project. In display mode the whole
 * card is an outbound link (when the pin has a URL); in `manage` mode it exposes
 * reorder + remove controls. Built on the {@link MediaCard} block — title via
 * {@link MediaCard}'s own `title` slot, tech stack as {@link Chip} atoms, and a
 * success-toned "Verified by StarCi" {@link StatusChip} for verified course pins.
 *
 * Pure list-item: receives its `pin` + callbacks + already-translated
 * {@link PinnedProjectCardLabels} from the parent, holds no store and calls no `t()`.
 *
 * @param props - {@link PinnedProjectCardProps}
 */
export const PinnedProjectCard = ({
    pin,
    manage = false,
    canMoveUp = false,
    canMoveDown = false,
    isBusy = false,
    onMoveUp,
    onMoveDown,
    onRemove,
    labels,
}: PinnedProjectCardProps) => {
    // verified badge + tech-stack chips share the meta row
    const hasMeta = pin.isVerified || (pin.techStack?.length ?? 0) > 0
    const meta = hasMeta ? (
        <Cluster
            gap={2}
            items={[
                ...(pin.isVerified ? [() => (
                    <StatusChip
                        tone="success"
                        icon={<VerifiedIcon className="size-3" aria-hidden="true" focusable="false" />}
                    >
                        {labels.verified}
                    </StatusChip>
                )] : []),
                ...(pin.techStack ?? []).map((tech) => () => (
                    <Chip key={tech} tone="default" text={tech} />
                )),
            ]}
        />
    ) : undefined

    // owner controls (manage mode) — reorder + remove, no outbound navigation
    const manageFooter = manage ? (
        <Cluster
            gap={2}
            items={[
                () => (
                    <Button
                        size="sm"
                        variant="secondary"
                        isIconOnly
                        isDisabled={isBusy || !canMoveUp}
                        ariaLabel={labels.moveUp}
                        prefixIcon={CaretUpIcon}
                        onPress={() => onMoveUp?.(pin.id)}
                    />
                ),
                () => (
                    <Button
                        size="sm"
                        variant="secondary"
                        isIconOnly
                        isDisabled={isBusy || !canMoveDown}
                        ariaLabel={labels.moveDown}
                        prefixIcon={CaretDownIcon}
                        onPress={() => onMoveDown?.(pin.id)}
                    />
                ),
                ...(pin.url ? [() => (
                    <Button
                        size="sm"
                        variant="secondary"
                        isIconOnly
                        ariaLabel={labels.open}
                        prefixIcon={ExternalLinkIcon}
                        onPress={() => window.open(pin.url as string, "_blank", "noopener,noreferrer")}
                    />
                )] : []),
                () => (
                    <Button
                        size="sm"
                        variant="danger"
                        isIconOnly
                        isPending={isBusy}
                        ariaLabel={labels.remove}
                        prefixIcon={TrashIcon}
                        onPress={() => onRemove?.(pin.id)}
                    />
                ),
            ]}
        />
    ) : undefined

    return (
        <MediaCard
            title={pin.title ?? labels.untitled}
            meta={meta}
            description={pin.description ?? undefined}
            footer={manageFooter}
            // display mode: the whole card is the outbound link (only when it has one)
            href={!manage && pin.url ? pin.url : undefined}
        />
    )
}
