"use client"

import React, { useEffect } from "react"
import { Chip, Typography, cn } from "@heroui/react"
import type { ReactNode } from "react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — the target `RatingBar`. Authored in Storybook
 * (not `src`); synced to `src` later. NO `@/components` imports.
 *
 * The real `RatingBar` composes `@/components/blocks/cards/GroupPressableCard`
 * (itself over `PressableCard` + the shared `verdict-band`). No local port of that
 * primitive exists yet under `.storybook/stories`, so a faithful minimal copy of
 * the pieces RatingBar actually uses (container-query grid, tile chrome, verdict
 * left-band, pressable surface) is inlined below.
 * TODO: swap the inlined `GroupPressableCard`/`PressableCard`/verdict band for the
 * local ports once the cards category is ported.
 */

// ── Inlined verdict left-band (from cards/verdict-band) ──────────────────────
/** Semantic verdict tones with a literal Tailwind class. */
type VerdictBandVariant = "accent" | "success" | "warning" | "danger"

interface VerdictBand {
    /** Turn the left band on. */
    enable: boolean
    /** Semantic tone — resolves via a literal lookup, no Tailwind safelist needed. */
    variant?: VerdictBandVariant
    /** Escape hatch: a raw Tailwind color + shade (e.g. `"amber-500"`). */
    color?: string
}

/** Literal per-variant inset-shadow class — MUST stay literal for Tailwind's scanner. */
const VERDICT_VARIANT_CLASS: Record<VerdictBandVariant, string> = {
    accent: "inset-shadow-[2px_0_0_0_var(--accent)]",
    success: "inset-shadow-[2px_0_0_0_var(--success)]",
    warning: "inset-shadow-[2px_0_0_0_var(--warning)]",
    danger: "inset-shadow-[2px_0_0_0_var(--danger)]",
}

/** Resolves a {@link VerdictBand} into a 2px left-edge inset-shadow band, or `undefined`. */
const verdictBandClassName = (withVerdict?: VerdictBand): string | undefined => {
    if (!withVerdict?.enable) {
        return undefined
    }
    const shadowClass = withVerdict.variant
        ? VERDICT_VARIANT_CLASS[withVerdict.variant]
        : withVerdict.color
            ? `inset-shadow-[2px_0_0_0_var(--color-${withVerdict.color})]`
            : undefined
    return cn("pl-4", shadowClass)
}

// ── Inlined PressableCard surface (from cards/PressableCard) ──────────────────
interface PressableCardProps {
    children: ReactNode
    onPress?: () => void
    href?: string
    isDisabled?: boolean
    label?: string
    className?: string
}

const PressableCard = ({ children, onPress, href, isDisabled = false, label, className }: PressableCardProps) => {
    const surface = cn(
        "rounded-3xl bg-surface px-4 py-3 text-left shadow-surface transition-colors hover:bg-surface-secondary",
        isDisabled && "cursor-not-allowed opacity-60",
        className,
    )
    const base = cn(
        "block w-full outline-none focus-visible:ring-2 focus-visible:ring-accent",
        surface,
    )
    if (href && !isDisabled) {
        return (
            <a href={href} aria-label={label} className={base}>
                {children}
            </a>
        )
    }
    return (
        <button
            type="button"
            onClick={onPress}
            disabled={isDisabled}
            aria-label={label}
            className={cn(base, !isDisabled && "cursor-pointer")}
        >
            {children}
        </button>
    )
}

// ── Inlined GroupPressableCard (from cards/GroupPressableCard) ────────────────
interface GroupPressableCardColumns {
    base?: 1 | 2
    sm?: 2 | 3 | 4
}

interface GroupPressableCardItem {
    key: string
    content: ReactNode
    onPress?: () => void
    isDisabled?: boolean
    className?: string
    withVerdict?: VerdictBand
}

interface GroupPressableCardProps {
    items: Array<GroupPressableCardItem>
    ariaLabel: string
    columns?: GroupPressableCardColumns
    gap?: 2 | 3
    keyboardShortcut?: boolean
    className?: string
}

// Compact grid cell chrome: one nấc down from PressableCard's rounded-3xl default.
const TILE_CHROME = "rounded-2xl shadow-field"
const BASE_COLUMNS_CLASS: Record<1 | 2, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
}
const SM_COLUMNS_CLASS: Record<2 | 3 | 4, string> = {
    2: "@sm:grid-cols-2",
    3: "@sm:grid-cols-3",
    4: "@sm:grid-cols-4",
}
const GAP_CLASS: Record<2 | 3, string> = {
    2: "gap-2",
    3: "gap-3",
}

const GroupPressableCard = ({
    items,
    ariaLabel,
    columns = {},
    gap = 3,
    keyboardShortcut = false,
    className,
}: GroupPressableCardProps) => {
    const itemsRef = React.useRef(items)
    useEffect(() => {
        itemsRef.current = items
    }, [items])

    useEffect(() => {
        if (!keyboardShortcut) {
            return
        }
        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null
            if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
                return
            }
            const position = Number(event.key) - 1
            const current = itemsRef.current
            if (!Number.isInteger(position) || position < 0 || position >= current.length) {
                return
            }
            const item = current[position]
            if (item.isDisabled || !item.onPress) {
                return
            }
            event.preventDefault()
            item.onPress()
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [keyboardShortcut])

    if (items.length === 0) {
        return null
    }

    return (
        <div className={cn("@container", className)}>
            <div
                role="group"
                aria-label={ariaLabel}
                className={cn(
                    "grid",
                    GAP_CLASS[gap],
                    BASE_COLUMNS_CLASS[columns.base ?? 1],
                    columns.sm === undefined ? undefined : SM_COLUMNS_CLASS[columns.sm],
                )}
            >
                {items.map((item) => (
                    <PressableCard
                        key={item.key}
                        onPress={item.onPress}
                        isDisabled={item.isDisabled}
                        className={cn(
                            TILE_CHROME,
                            verdictBandClassName(item.withVerdict),
                            item.className,
                        )}
                    >
                        {item.content}
                    </PressableCard>
                ))}
            </div>
        </div>
    )
}

// ── RatingBar ────────────────────────────────────────────────────────────────
/** One selectable recall grade in a {@link RatingBar}. */
export interface RatingOption {
    /** SM-2 grade value reported to {@link RatingBarProps.onRate} (0=Again … 3=Easy). */
    grade: number
    /** Localized button label (resolved by the caller — blocks carry no i18n). */
    label: ReactNode
    /** Optional secondary line under the label (e.g. the next-interval preview). */
    hint?: ReactNode
}

/** Props for the {@link RatingBar} block. */
export interface RatingBarProps {
    /** Ordered grades to offer, weakest recall first (Again → Easy). */
    options: Array<RatingOption>
    /** Called with the chosen grade. */
    onRate: (grade: number) => void
    /**
     * Accessible name for the grade group, localized by the caller (blocks carry
     * no i18n) — e.g. "Chọn mức độ nhớ". Without it a screen reader hears four
     * loose buttons with nothing tying them together.
     */
    ariaLabel: string
    /** Disables every button while a review is in flight. */
    isPending?: boolean
    /** Extra classes on the group. */
    className?: string
}

/**
 * Grade → RAW palette colour for the shared verdict band's `color` escape hatch.
 * A grade is a TIER (like a difficulty level), not a status/alert, so it uses the
 * difficulty HUE ramp (rose→emerald). Runs weakest→strongest RECALL: grade 0 (Quên)
 * = rose, grade 3 (Dễ) = emerald.
 */
const GRADE_COLOR: Record<number, string> = {
    0: "rose-500",
    1: "orange-500",
    2: "amber-500",
    3: "emerald-500",
}

/**
 * The SM-2 recall-rating bar: a row of FOUR equal-width grade TILES (Again / Hard
 * / Good / Easy) the learner taps — or presses `1`–`4` — after revealing a
 * flashcard's answer. Each tile carries a tier-colored LEFT BAND (the shared
 * `withVerdict` band, colours from {@link GRADE_COLOR}), a keyboard-key hint (a
 * neutral `Chip`), and an optional next-interval preview.
 *
 * The tiles + their grid + the 1–4 shortcut are a `GroupPressableCard`, so this
 * block only owns the tile ANATOMY. Grading is an ACTION — nothing stays selected,
 * no ring, no outline. Labels/hints arrive localized from the caller.
 *
 * @param props - {@link RatingBarProps}
 */
export const RatingBar = ({ options, onRate, ariaLabel, isPending = false, className }: RatingBarProps) => (
    <GroupPressableCard
        ariaLabel={ariaLabel}
        columns={{ base: 2, sm: 4 }}
        gap={3}
        keyboardShortcut
        className={className}
        items={options.map((option, position) => ({
            key: String(option.grade),
            onPress: () => onRate(option.grade),
            isDisabled: isPending,
            withVerdict: { enable: true, color: GRADE_COLOR[option.grade] },
            className: "flex flex-col gap-2 py-2 pr-3 pl-4",
            content: (
                <>
                    <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-foreground">{option.label}</span>
                        <Chip size="sm" variant="soft" color="default">
                            <Chip.Label>{position + 1}</Chip.Label>
                        </Chip>
                    </span>
                    {option.hint !== undefined ? (
                        <Typography type="body-xs" color="muted">
                            {option.hint}
                        </Typography>
                    ) : null}
                </>
            ),
        }))}
    />
)
