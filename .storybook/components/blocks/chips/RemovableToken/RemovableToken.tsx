import React from "react"
import type { ReactNode } from "react"
import { Button, Typography, cn } from "@heroui/react"
import { XIcon } from "@phosphor-icons/react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — the target `RemovableToken`. Authored in
 * Storybook (not `src`); synced to `src` later. NO `@/components` imports.
 *
 * Grounded in the hand-rolled "picked company" row in
 * `CompanySection` (`src/components/features/careers/Jobs/JobPostForm/CompanySection/index.tsx`):
 * a bordered `rounded-2xl` flex row — a label on the left, a tertiary
 * `Button` (× icon + "Change" text) on the right that clears the pick. This
 * primitive generalises that ONE hand-rolled row into a reusable
 * selected-item token: any label/icon in, an optional remove (×) and/or
 * edit ("Change"-style) affordance out.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for the {@link RemovableToken} primitive. */
export interface RemovableTokenProps {
    /** Token label content. */
    label: ReactNode
    /**
     * Optional LEADING glyph before the label. The PRIMITIVE owns the size
     * (§4) — pass the icon TRẦN (no `size-*`); it's forced to `size-4` here.
     */
    icon?: ReactNode
    /**
     * Renders a trailing edit affordance — a small tertiary `Button` (× icon +
     * {@link RemovableTokenProps.editLabel}), mirroring the ground-truth
     * "Change" button that clears a picked company so the user can re-search.
     * Use this when removing the token means "go pick a different one", not
     * "delete it".
     */
    onEdit?: () => void
    /** Label for the edit affordance's button text. Defaults to "Change". */
    editLabel?: ReactNode
    /**
     * Renders a trailing COMPACT close (×) — click it to remove the token
     * outright (no re-pick flow). Own compact scale (size-6 hit, size-4
     * glyph), like a chip's cancel-×, not the button-scale edit affordance.
     */
    onRemove?: () => void
    /** Accessible label for the remove (×) button. Falls back to "Remove". */
    removeLabel?: string
    /** Disables both affordances and dims the token. */
    isDisabled?: boolean
    /** Extra classes on the row. */
    className?: string
    /** `true` → render the skeleton mirror (row frame + placeholder bars). */
    isSkeleton?: boolean
}

/**
 * Generic selected-item token: a bordered `rounded-2xl` row holding an
 * optional leading icon + label, with an optional trailing remove (×) and/or
 * edit ("Change"-style) affordance. Compact — one line, no wrapping content.
 * Presentational; the only callbacks it takes are the two trailing
 * affordances.
 *
 * @param props - {@link RemovableTokenProps}
 */
export const RemovableToken = ({
    label,
    icon,
    onEdit,
    editLabel = "Change",
    onRemove,
    removeLabel = "Remove",
    isDisabled = false,
    className,
    isSkeleton = false,
}: RemovableTokenProps) => {
    if (isSkeleton) {
        return (
            <div
                className={cn(
                    "flex items-center justify-between gap-3 rounded-2xl border border-default px-4 py-3",
                    className,
                )}
            >
                <div className="flex min-w-0 items-center gap-2">
                    <Skeleton className="size-4 shrink-0 rounded" />
                    <Skeleton className="my-[5px] h-[14px] w-32 rounded" />
                </div>
                <Skeleton className="h-9 w-20 shrink-0 rounded-full" />
            </div>
        )
    }

    return (
        <div
            aria-disabled={isDisabled}
            className={cn(
                "flex items-center justify-between gap-3 rounded-2xl border border-default px-4 py-3",
                isDisabled && "opacity-50",
                className,
            )}
        >
            <div className="flex min-w-0 items-center gap-2">
                {icon ? (
                    // PRIMITIVE owns the size (§4) — force the caller's bare icon
                    // down to the row's glyph scale (matches the body-sm label).
                    <span aria-hidden className="inline-flex shrink-0 [&_svg]:size-4">
                        {icon}
                    </span>
                ) : null}
                <Typography type="body-sm" weight="medium" className="truncate">
                    {label}
                </Typography>
            </div>

            {(onEdit || onRemove) && (
                <div className="flex shrink-0 items-center gap-2">
                    {onEdit ? (
                        <Button variant="tertiary" size="sm" isDisabled={isDisabled} onPress={onEdit}>
                            <XIcon aria-hidden focusable="false" className="size-4" />
                            {editLabel}
                        </Button>
                    ) : null}
                    {onRemove ? (
                        // Compact chip-scale close × (NOT the button-scale edit
                        // affordance above) — a real <button> for a11y.
                        <button
                            type="button"
                            aria-label={removeLabel}
                            disabled={isDisabled}
                            onClick={onRemove}
                            className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted outline-none transition hover:bg-default hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed [&_svg]:size-4"
                        >
                            <XIcon aria-hidden focusable="false" />
                        </button>
                    ) : null}
                </div>
            )}
        </div>
    )
}
