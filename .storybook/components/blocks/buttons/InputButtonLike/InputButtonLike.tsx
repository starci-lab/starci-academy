import React from "react"
import type { ReactNode } from "react"
import { Button, cn } from "@heroui/react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — the target `InputButtonLike`. Authored in
 * Storybook (not `src`); synced to `src` later. NO `@/components` imports.
 */

export type InputButtonLikeSize = "sm" | "md" | "lg"

// Field height + min-height theo size (§6: field-shape riêng, không compose base Button).
const HEIGHT_CLS: Record<InputButtonLikeSize, string> = {
    sm: "h-8 min-h-8",
    md: "h-9 min-h-9",
    lg: "h-10 min-h-10",
}
// Placeholder text-size theo size.
const TEXT_CLS: Record<InputButtonLikeSize, string> = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
}
// icon-size §5a: block TỰ ép size cho icon/suffix svg — story chỉ truyền icon TRẦN.
const ICON_CLS: Record<InputButtonLikeSize, string> = {
    sm: "[&_svg]:size-4",
    md: "[&_svg]:size-4",
    lg: "[&_svg]:size-5",
}

/**
 * Props for the {@link InputButtonLike} block.
 */
export interface InputButtonLikeProps {
    /**
     * Placeholder-style label, rendered muted like an empty input value.
     */
    placeholder: ReactNode
    /**
     * Optional leading icon (e.g. a magnifier). Pass the RAW icon node — the block
     * owns its size (§5a) and muted color; do NOT set `size`/`className` on it.
     */
    icon?: ReactNode
    /**
     * Optional trailing content pinned to the right (e.g. a Kbd shortcut hint).
     */
    suffix?: ReactNode
    /** Control height/typography scale. Defaults to `md` (field height h-9). */
    size?: InputButtonLikeSize
    /**
     * Accessible label for the control. Falls back to {@link placeholder} when it
     * is a plain string.
     */
    ariaLabel?: string
    /**
     * Press handler — opens whatever the field stands in for (e.g. a search overlay).
     */
    onPress: () => void
    /** `true` → skeleton mirror (field-shaped bar, same height per size). */
    isSkeleton?: boolean
    /** Extra classes on the control (also placement). */
    className?: string
}

/**
 * A button disguised as an input field ("button trá hình"). It carries the
 * native HeroUI field look — rounded-field shell, field background + border,
 * muted placeholder text — but behaves as a single press target with no inner
 * dividers, so it can trigger an overlay/command palette instead of accepting
 * typed input. Pure and props-only: the block owns the entire look — including
 * icon size (§5a) and muted color; consumers pass only RAW content + a press
 * handler (and placement via className).
 */
export const InputButtonLike = ({
    placeholder,
    icon,
    suffix,
    size = "md",
    ariaLabel,
    onPress,
    isSkeleton = false,
    className,
}: InputButtonLikeProps) => {
    if (isSkeleton) {
        // Skeleton mirror: field-shaped bar, SAME height/rounding as the real control.
        return <Skeleton className={cn("w-full rounded-field", HEIGHT_CLS[size], className)} />
    }
    // NOTE: left as raw HeroUI <Button> (not the Button port,
    // ../../buttons/Button/Button.tsx) — three real gaps vs the port's API:
    //  1. `variant="outline"` isn't in the port's ButtonVariant union (only
    //     primary/secondary/tertiary/ghost/danger) — no value maps onto it.
    //  2. This control needs a LEADING icon + a separate trailing `suffix`
    //     section; the port's `icon` slot is trailing-only (single icon next
    //     to the label), it has no leading-icon or third-slot concept.
    //  3. The port auto-sizes descendant svgs via §5a (`[&_svg]:size-4/5/6`
    //     keyed to button `size`), which would override this component's own
    //     ICON_CLS scale (sm/md→size-4, lg→size-5) at higher CSS specificity.
    // Deferred — swapping would change rendered variant/icon-size/layout.
    return (
        <Button
            variant="outline"
            aria-label={ariaLabel ?? (typeof placeholder === "string" ? placeholder : undefined)}
            onPress={onPress}
            className={cn(
                "w-full justify-between gap-2 rounded-field border-[var(--field-border)] bg-field px-3 font-normal text-field-foreground shadow-[var(--field-shadow)] hover:bg-field",
                HEIGHT_CLS[size],
                ICON_CLS[size],
                className,
            )}
        >
            <span className="inline-flex min-w-0 items-center gap-2">
                {icon ? (
                    <span className="inline-flex shrink-0 items-center text-field-placeholder">
                        {icon}
                    </span>
                ) : null}
                <span className={cn("truncate text-field-placeholder", TEXT_CLS[size])}>
                    {placeholder}
                </span>
            </span>
            {suffix ? (
                <span className="inline-flex shrink-0 items-center gap-2">
                    {suffix}
                </span>
            ) : null}
        </Button>
    )
}
