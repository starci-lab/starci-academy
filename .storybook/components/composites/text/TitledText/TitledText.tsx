import React from "react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "TitledText" } as const

/**
 * `TitledText` — a primary line + optional muted secondary (and optional hint) stacked
 * vertically as one composite; a title↔subtitle pair is a single semantic unit rather than raw
 * `<Typography>` hand-rolled at every row. The composite owns the type scale per `size`; the
 * caller passes nodes only. Leaves: `subtitle`, `hint`, `size`, `weight`, `truncate`, `isSkeleton`.
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
    /** Primary line (title / name / label / stat value), rendered through `Typography`. */
    title: string
    /** Optional secondary line beneath the title (subtitle / role / description / stat label). */
    subtitle?: string
    /** Optional third muted line (only meaningful for `size="stat"`, e.g. a delta hint). */
    hint?: string
    /** Text-stack scale. Defaults to `"row"`. */
    size?: TitledTextSize
    /** Override the title weight (per-size default otherwise). */
    weight?: "medium" | "semibold" | "bold"
    /** Truncate every line to a single line (needs a bounded parent width). */
    truncate?: boolean
    /** `true` → render the skeleton mirror (bars sized per line). */
    isSkeleton?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
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
    classNames,
}: TitledTextProps) => {
    const cfg = SIZE_CONFIG[size]
    const rootClassNames: Array<AllowedClassName> = ["min-w-0", ...(classNames ?? [])]

    // COMPOSITE-10: ONE render path — same `StackV`, same `gap`, in both states.
    // Text always goes through the `Typography` ATOM; `isSkeleton` just flows
    // straight into it so each line draws its own bar, sized to its own value
    // (§12c) — no second, hand-built skeleton tree to keep in sync with this one.
    return (
        <StackV
            gap={1}
            classNames={rootClassNames}
            isSkeleton={isSkeleton}

            items={[
                () => (
                    <Typography
                        size={cfg.titleSize}
                        weight={isSkeleton ? undefined : (weight ?? cfg.titleWeight)}
                        truncate={isSkeleton ? undefined : truncate}
                        isSkeleton={isSkeleton}
                        text={title}

                    />
                ),
                ...(subtitle ? [() => (
                    <Typography
                        size={cfg.subSize}
                        color={isSkeleton ? undefined : cfg.subColor}
                        weight={isSkeleton ? undefined : cfg.subWeight}
                        truncate={isSkeleton ? undefined : truncate}
                        isSkeleton={isSkeleton}
                        text={subtitle}

                    />
                )] : []),
                ...(hint ? [() => (
                    <Typography
                        size="xs"
                        color={isSkeleton ? undefined : "muted"}
                        truncate={isSkeleton ? undefined : truncate}
                        isSkeleton={isSkeleton}
                        text={hint}

                    />
                )] : []),
            ]}
        />
    )
}
