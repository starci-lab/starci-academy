import React from "react"
import type { ReactNode } from "react"
import { Typography, cn } from "@heroui/react"
import { PlusIcon } from "@phosphor-icons/react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from the "create new" tile
 * hand-rolled inside `@/components/features/profile/CV/CvGallery` (the dashed
 * `<button>` that closes out the CV grid). GENERALISED here into a standalone
 * primitive — any grid that ends in an "add new" tile (CV documents, mock-
 * interview sessions, playground workspaces…) composes this instead of
 * hand-rolling its own dashed button. Authored in Storybook (not `src`);
 * synced back to `src` later. NO `@/components` imports.
 *
 * Two deliberate divergences from the CV original:
 * - Colour is MUTED here (generic tile), not the CV's `accent-soft-foreground`
 *   tint — a shared primitive shouldn't bake in one caller's accent choice.
 * - Height is `h-full w-full` (fills whatever cell the grid gives it), not the
 *   CV's hardcoded `h-[19rem]` — the caller's grid controls row height.
 */

/** Props for the {@link DashedPlaceholderCard} primitive. */
export interface DashedPlaceholderCardProps {
    /**
     * Decorative leading icon (a Phosphor icon), rendered TRẦN — the primitive
     * forces it to `size-8` (§4) to match the label's tile-scale footprint.
     * Defaults to {@link PlusIcon}.
     */
    icon?: ReactNode
    /** Caption under the icon (e.g. "Tạo CV mới"). */
    label: ReactNode
    /** Press handler — creates/opens the new item. */
    onPress: () => void
    /**
     * `true` → mark this tile as the CHOSEN one in a selectable grid — an
     * accent `ring-2 ring-accent`, same contract as `PressableCard.isSelected`.
     * Rare (most callers just press it); available for parity with the rest
     * of the card family.
     */
    isSelected?: boolean
    /** Disables interaction and dims the tile (e.g. while the create mutation is in flight). */
    isDisabled?: boolean
    /**
     * `true` → render a generic skeleton mirror (same dashed-tile footprint,
     * icon + label swapped for shimmer) instead of the real press target.
     */
    isSkeleton?: boolean
    /** Extra classes on the tile. */
    className?: string
}

/**
 * Generic "add new" tile — a pressable, dashed-border `rounded-3xl` card with
 * a centered icon + label, muted. Fills the available height of its grid cell
 * (the tile itself is `h-full w-full`; the caller's grid row sets the height).
 *
 * Press contract §7: `active:scale` only, NO hover-bg — a dashed tile stays
 * quiet at rest and on hover, the only feedback is the press itself.
 *
 * @param props - {@link DashedPlaceholderCardProps}
 */
export const DashedPlaceholderCard = ({
    icon,
    label,
    onPress,
    isSelected = false,
    isDisabled = false,
    isSkeleton = false,
    className,
}: DashedPlaceholderCardProps) => {
    // Generic skeleton mirror (§8) — same dashed frame, icon + label swapped
    // for shimmer placeholders so the loading tile shares the real footprint.
    if (isSkeleton) {
        return (
            <div
                className={cn(
                    "flex h-full w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-default p-6",
                    className,
                )}
            >
                <Skeleton className="size-8 rounded-xl" />
                <Skeleton.Typography type="body-sm" width="1/3" />
            </div>
        )
    }

    return (
        <button
            type="button"
            onClick={onPress}
            disabled={isDisabled}
            aria-pressed={isSelected || undefined}
            className={cn(
                "flex h-full w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-default p-6 text-center text-muted outline-none",
                "[-webkit-tap-highlight-color:transparent] transition-[scale] duration-200 ease-out motion-reduce:transition-none",
                "focus-visible:ring-2 focus-visible:ring-accent",
                isSelected && "ring-2 ring-accent",
                isDisabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer active:scale-[0.97]",
                className,
            )}
        >
            {/* §4: the primitive owns icon sizing — force the caller's bare icon to size-8. */}
            <span aria-hidden className="[&>svg]:size-8">
                {icon ?? <PlusIcon />}
            </span>
            <Typography type="body-sm" weight="medium" color="muted">
                {label}
            </Typography>
        </button>
    )
}
