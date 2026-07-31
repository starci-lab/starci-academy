import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — TitledText: a primary line + optional muted
 * secondary (and optional hint) stacked vertically as ONE composite. A
 * "title↔subtitle" pair is a semantic UNIT, so it is a single component (one
 * anatomy node), NOT two/three raw `<Typography>` hand-rolled at every row.
 *
 * This is the single most-recurring composite in the app (≥16 call-sites, ≥6
 * lanes: SettingToggleRow, ListRow, Stepper, PageHeader, EmptyState,
 * RewardItemCard, PersonaIdentityChip name/role, SummaryCard stat…). The
 * composite OWNS the type scale per `size`; the caller passes nodes only.
 * NO `@/components` imports.
 */

/**
 * Vertical text-stack scale:
 * - `row`    — dense list/setting row (title `sm` medium · subtitle `xs` muted).
 * - `header` — section/page header (title `h3` semibold · subtitle `sm` muted).
 * - `stat`   — a metric (title = big `h3` bold VALUE · subtitle = foreground label · hint muted).
 */
export type TitledTextSize = "row" | "header" | "stat"

/** Typography `size` + tone config resolved per {@link TitledTextSize}. */
/**
 * Skeleton bar width per line. Named so the widths can be typed where they are WRITTEN, not
 * only where they are read: the classes must be literal (`w-1/2`) because Tailwind only emits
 * a class it can see as a literal string in the source.
 */
interface TitledTextSkeletonWidths {
    /** Width class of the title bar. */
    title: AllowedClassName
    /** Width class of the subtitle bar. */
    sub: AllowedClassName
    /** Width class of the hint bar. */
    hint: AllowedClassName
}

interface SizeConfig {
    titleSize: "sm" | "h3"
    titleWeight: "medium" | "semibold" | "bold"
    subSize: "xs" | "sm"
    /** `undefined` → foreground (default); `"muted"` → muted line. */
    subColor?: "muted"
    subWeight?: "medium"
    /**
     * Skeleton bar width for each line — write the class LITERALLY (`w-1/2`), don't
     * build it dynamically (`w-${…}`), since Tailwind only generates a class from a
     * literal string it scans in the source.
     */
    skeleton: TitledTextSkeletonWidths
}

const SIZE_CONFIG: Record<TitledTextSize, SizeConfig> = {
    row: {
        titleSize: "sm",
        titleWeight: "medium",
        subSize: "xs",
        subColor: "muted",
        skeleton: { title: "w-1/2", sub: "w-2/3", hint: "w-1/3" },
    },
    header: {
        titleSize: "h3",
        titleWeight: "semibold",
        subSize: "sm",
        subColor: "muted",
        skeleton: { title: "w-1/3", sub: "w-2/3", hint: "w-1/2" },
    },
    stat: {
        titleSize: "h3",
        titleWeight: "bold",
        // stat's secondary is the LABEL — foreground + medium, not muted.
        subSize: "sm",
        subWeight: "medium",
        skeleton: { title: "w-1/3", sub: "w-2/3", hint: "w-1/2" },
    },
}

/** Props for the {@link TitledText} composite. */
export interface TitledTextProps {
    /** Primary line (title / name / label / stat value). */
    title: ReactNode
    /** Optional secondary line beneath the title (subtitle / role / description / stat label). */
    subtitle?: ReactNode
    /** Optional third muted line (only meaningful for `size="stat"`, e.g. a delta hint). */
    hint?: ReactNode
    /** Text-stack scale. Defaults to `"row"`. */
    size?: TitledTextSize
    /** Override the title weight (per-size default otherwise). */
    weight?: "medium" | "semibold" | "bold"
    /** Truncate every line to a single line (needs a bounded parent width). */
    truncate?: boolean
    /** `true` → render the skeleton mirror (bars sized per line). */
    isSkeleton?: boolean
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /**
     * `true` → EACH inner line also emits `data-anat-part` (`Title` · `Subtitle` ·
     * `Hint`), so the deps tree can go DOWN TO THE ATOM instead of stopping at the frame.
     *
     * ⭐ 2026-07-27 (teacher: "render all the way down to the atom level, including
     * typography, don't skip any component"): the tree ABOVE depends on the tree BELOW,
     * so the frame has to clear the way for its children to show. A frame that swallows
     * its children makes the panel lie about what it actually builds.
     */
    showAnatomy?: boolean
    /** Extra classes on the root (e.g. `flex-1` for row layouts). */
    className?: string
}

/**
 * TitledText renders a primary line over an optional muted secondary (and hint)
 * as one vertical unit. The composite OWNS the type scale + tone per `size`; the
 * caller passes nodes only. Root is `flex min-w-0 flex-col` so truncation works
 * and callers can add `flex-1`.
 *
 * @param props - {@link TitledTextProps}
 */
export const TitledText = ({
    title,
    subtitle,
    hint,
    size = "row",
    weight,
    truncate = false,
    isSkeleton = false,
    anatPart,
    showAnatomy = false,
    className,
}: TitledTextProps) => {
    const cfg = SIZE_CONFIG[size]
    /** Each line is ONE `Typography` — named so the deps tree can go down to the atom. */
    const part = (name: string) => (showAnatomy ? name : undefined)

    if (isSkeleton) {
        return (
            <StackV gap="flush" className={cn("min-w-0", className)} anatPart={anatPart}>
                {/* §12c: whoever owns the shape owns the skeleton — each line draws its own bar with its own atom. */}
                <Typography size={cfg.titleSize} isSkeleton classNames={[cfg.skeleton.title]} anatPart={part("Title")} />
                {subtitle ? <Typography size={cfg.subSize} isSkeleton classNames={[cfg.skeleton.sub]} anatPart={part("Subtitle")} /> : null}
                {hint ? <Typography size="xs" isSkeleton classNames={[cfg.skeleton.hint]} anatPart={part("Hint")} /> : null}
            </StackV>
        )
    }

    return (
        <StackV gap="flush" className={cn("min-w-0", className)} anatPart={anatPart}>
            {/* Text goes through the `Typography` ATOM (same `size` axis as the skeleton branch above), not raw HeroUI. */}
            <Typography size={cfg.titleSize} weight={weight ?? cfg.titleWeight} truncate={truncate} text={title} anatPart={part("Title")} />
            {subtitle ? (
                <Typography size={cfg.subSize} color={cfg.subColor} weight={cfg.subWeight} truncate={truncate} text={subtitle} anatPart={part("Subtitle")} />
            ) : null}
            {hint ? (
                <Typography size="xs" color="muted" truncate={truncate} text={hint} anatPart={part("Hint")} />
            ) : null}
        </StackV>
    )
}
