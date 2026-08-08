import React, { type ComponentType } from "react"
import { CheckCircleIcon } from "@phosphor-icons/react"
import {
    IdentityTile,
    type IdentityTileIcon,
} from "@/components/atoms/display/IdentityTile"
import { ListRow } from "@/components/composites/lists/List"
import { StatusChip } from "@/components/blocks/chips/StatusChip"
import { StackV } from "@/components/frames/Stack"
import type { ComponentTypeWithSkeleton, SkeletonProps } from "@/components/frames/_slot"

/** One row of a {@link ReadinessChecklist}. */
export interface ReadinessChecklistItem {
    /** Stable row key. */
    id: string
    /**
     * Icon shown when the item is NOT ready (a `ready` row swaps it for a check).
     * A COMPONENT reference — never a built ReactNode — so {@link IdentityTile}
     * owns icon scale.
     */
    icon: IdentityTileIcon
    /** Row title — the thing being checked (e.g. "Ollama agent"). */
    label: string
    /** Subtitle shown when {@link ReadinessChecklistItem.ready} is true. */
    readyDescription: string
    /** Subtitle shown when {@link ReadinessChecklistItem.ready} is false. */
    pendingDescription: string
    /** Whether this prerequisite/step is satisfied. */
    ready: boolean
}

/** Props for the {@link ReadinessChecklist} block. */
export interface ReadinessChecklistProps {
    /** Rows, top to bottom. */
    items: Array<ReadinessChecklistItem>
    /** Trailing chip label for a ready row (i18n-driven by the caller). */
    readyLabel: string
    /** Trailing chip label for a pending row (i18n-driven by the caller). */
    pendingLabel: string
}

/** Stable leading for every ready row — one identity, never recreated per render. */
const ReadyLeading = ({ isSkeleton }: SkeletonProps) => (
    <IdentityTile
        icon={CheckCircleIcon}
        tone="success"
        size="sm"
        {...(isSkeleton ? { isSkeleton: true as const } : {})}
    />
)

/** Cache of pending-leading adapters keyed by icon component identity. */
const pendingLeadingCache = new WeakMap<IdentityTileIcon, ComponentTypeWithSkeleton>()

/** Return a stable pending leading for `Icon` (one adapter per icon component). */
const pendingLeading = (Icon: IdentityTileIcon): ComponentTypeWithSkeleton => {
    const cached = pendingLeadingCache.get(Icon)
    if (cached) {
        return cached
    }
    const PendingLeading = ({ isSkeleton }: SkeletonProps) => (
        <IdentityTile
            icon={Icon}
            tone="neutral"
            size="sm"
            {...(isSkeleton ? { isSkeleton: true as const } : {})}
        />
    )
    pendingLeadingCache.set(Icon, PendingLeading)
    return PendingLeading
}

/** Cache of trailing chip adapters keyed by ready flag + label pair. */
const trailingCache = new Map<string, ComponentType>()

/** Return a stable trailing StatusChip for the ready/pending labels. */
const statusTrailing = (
    ready: boolean,
    readyLabel: string,
    pendingLabel: string,
): ComponentType => {
    const key = `${ready ? "ready" : "pending"}:${readyLabel}:${pendingLabel}`
    const cached = trailingCache.get(key)
    if (cached) {
        return cached
    }
    const Trailing = () => (
        <StatusChip tone={ready ? "success" : "neutral"}>
            {ready ? readyLabel : pendingLabel}
        </StatusChip>
    )
    trailingCache.set(key, Trailing)
    return Trailing
}

/**
 * A vertical list of prerequisite/setup checks, each rendered as a
 * {@link ListRow}: a leading {@link IdentityTile} (success-toned check when ready,
 * the caller's own icon in neutral tone while pending), the item's label as
 * title, a ready/pending description as subtitle, and a trailing
 * {@link StatusChip} spelling out the state. Purely presentational — the
 * caller owns readiness (e.g. polling an agent's health) and all copy,
 * including the two trailing-chip labels, so the block carries no hardcoded
 * strings.
 *
 * @param props - See {@link ReadinessChecklistProps}.
 */
export const ReadinessChecklist = ({ items, readyLabel, pendingLabel }: ReadinessChecklistProps) => {
    const Rows = () => (
        <>
            {items.map((item, index) => (
                <ListRow
                    key={item.id}
                    density="comfortable"
                    divider={index < items.length - 1}
                    leading={item.ready ? ReadyLeading : pendingLeading(item.icon)}
                    title={item.label}
                    subtitle={item.ready ? item.readyDescription : item.pendingDescription}
                    trailing={statusTrailing(item.ready, readyLabel, pendingLabel)}
                />
            ))}
        </>
    )

    return (
        <StackV
            identity={{ tier: "block", component: "ReadinessChecklist" }}
            gap={1}
            principle="sibling-stack"
            explain="Same-kind peer stack of checklist rows — not group-boundary, because these are repeating sibling rows rather than section groups."
            items={[Rows]}
        />
    )
}
