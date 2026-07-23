import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — new GENERIC `SegmentedToggle` primitive.
 * Authored in Storybook (not `src`); synced to `src` later.
 *
 * Grounded on 5 hand-rolled single-select pill patterns that all reimplement the
 * same contract with slightly different classes (drift risk — "đổi 1 = đổi hết"):
 * - `LeaderboardCategoryRail` (`variant="chips"`) — horizontal scroll of category pills
 * - practice editor's language toggle (Sandpack panel)
 * - `SettingsLayout`'s mobile fallback pill nav (hidden desktop sidebar → horizontal pills)
 * - `Appearance`'s ambient-effect swatch grid (`EFFECT_OPTIONS.map(...)`)
 * - `AdminMpegDashTest/ConfigCard/RendererTypeButton` (renderer-type selector)
 *
 * This primitive replaces all 5: the caller supplies `options` + controlled
 * `value`/`onChange`, nothing else. NO hover-bg (§7 — press-only feedback, matches
 * `PressableCard`/`MediaCard`'s press-scale contract): selected = accent-soft tint
 * + accent ring, unselected = a plain default-bordered pill. Idle state never
 * tints on hover — only `active:scale-[0.97]` on press.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type SegmentedToggleSize = "sm" | "md"

/** One selectable option in a {@link SegmentedToggle}. */
export interface SegmentedToggleOption<T extends string> {
    /** Value reported to `onChange` when this option is pressed. */
    value: T
    /** Label content. */
    label: ReactNode
    /**
     * Optional leading glyph. PRIMITIVE owns the size (§4) — pass the icon TRẦN
     * (no `size-*`); it's forced to match the pill's text scale (§5:
     * sm → `size-4`, md → `size-5`).
     */
    icon?: ReactNode
    /** When true this option is dimmed and not selectable. */
    isDisabled?: boolean
}

/** Props for the {@link SegmentedToggle} primitive. */
export interface SegmentedToggleProps<T extends string> {
    /** The selectable options. */
    options: Array<SegmentedToggleOption<T>>
    /** Currently selected value (controlled). */
    value: T
    /** Fired with the newly selected value when an option is pressed. */
    onChange: (value: T) => void
    /** Pill scale — `sm` (text-xs) or `md` (text-sm, default). */
    size?: SegmentedToggleSize
    /** `true` → the row stretches full-width, each pill sharing it equally (`flex-1`). */
    fullWidth?: boolean
    /** Accessible name for the group (`role="group"`). */
    ariaLabel?: string
    /** `true` → render the skeleton mirror (a row of pill placeholders). Consumer just flips the flag. */
    isSkeleton?: boolean
    /** Extra classes on the row. */
    className?: string
}

/** Pill padding + text/icon scale per {@link SegmentedToggleSize}. Spacing scale: 0·2·3·6·8 only. */
const SIZE_PILL: Record<SegmentedToggleSize, string> = {
    sm: "gap-2 px-3 py-2 text-xs [&_svg]:size-4",
    md: "gap-2 px-3 py-3 text-sm [&_svg]:size-5",
}

/** Skeleton pill height per size (mirrors the real pill's rendered box). */
const SIZE_SKELETON_H: Record<SegmentedToggleSize, string> = { sm: "h-8", md: "h-9" }
const SIZE_SKELETON_W: Record<SegmentedToggleSize, string> = { sm: "w-16", md: "w-20" }

/**
 * Generic single-select segmented control — a row of pressable pills, exactly
 * one selected. Presentational + controlled: the caller owns `value` and
 * receives the new value via `onChange`; this component only renders + reports
 * presses. `role="group"` + `aria-pressed` per pill (native `<button>`, not the
 * `Button` port — the port doesn't forward `aria-pressed`, same call as
 * `FlexWrapButtonRadio`).
 *
 * @param props - {@link SegmentedToggleProps}
 */
export const SegmentedToggle = <T extends string>({
    options,
    value,
    onChange,
    size = "md",
    fullWidth = false,
    ariaLabel,
    isSkeleton = false,
    className,
}: SegmentedToggleProps<T>) => {
    if (isSkeleton) {
        return (
            <div className={cn("flex items-center gap-2", fullWidth && "w-full", className)}>
                {options.map((option, index) => (
                    <Skeleton
                        key={option.value ?? index}
                        className={cn(
                            "rounded-full",
                            SIZE_SKELETON_H[size],
                            fullWidth ? "flex-1" : SIZE_SKELETON_W[size],
                        )}
                    />
                ))}
            </div>
        )
    }

    return (
        <div
            role="group"
            aria-label={ariaLabel}
            className={cn("flex items-center gap-2", fullWidth && "w-full", className)}
        >
            {options.map((option) => {
                const isSelected = option.value === value
                return (
                    <button
                        key={option.value}
                        type="button"
                        aria-pressed={isSelected}
                        disabled={option.isDisabled}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "inline-flex items-center justify-center rounded-full border font-medium",
                            "outline-none transition-[scale] duration-200 ease-out motion-reduce:transition-none",
                            "[-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-accent",
                            SIZE_PILL[size],
                            fullWidth && "flex-1",
                            isSelected
                                ? "border-transparent bg-accent-soft text-accent-soft-foreground ring-2 ring-accent"
                                : "border-default text-muted",
                            option.isDisabled ? "cursor-not-allowed opacity-55" : "active:scale-[0.97]",
                        )}
                    >
                        {option.icon ? (
                            <span aria-hidden className="inline-flex shrink-0">{option.icon}</span>
                        ) : null}
                        <span className="truncate">{option.label}</span>
                    </button>
                )
            })}
        </div>
    )
}
