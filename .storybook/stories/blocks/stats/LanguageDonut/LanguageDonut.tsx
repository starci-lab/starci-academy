import React, { useMemo } from "react"
import { cn, Typography } from "@heroui/react"
import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/stats/LanguageDonut`. Authored in Storybook (not `src`);
 * synced to `src` later. The language colour/label helpers (`@/modules/utils/
 * language`) are inlined below to keep the spec self-contained — re-point them to
 * the shared util on sync to `src`.
 */

/** GitHub-linguist brand colour per language key (lowercase enum value). */
const LANGUAGE_COLORS: Record<string, string> = {
    typescript: "#3178c6",
    javascript: "#f1e05a",
    python: "#3572a5",
    java: "#b07219",
    go: "#00add8",
    csharp: "#178600",
    cpp: "#f34b7d",
    c: "#555555",
    rust: "#dea584",
    kotlin: "#a97bff",
    php: "#4f5d95",
    ruby: "#701516",
    swift: "#f05138",
    dart: "#00b4ab",
}

/** Display-name overrides where a plain capitalize is wrong (C#, C++, …). */
const LANGUAGE_LABELS: Record<string, string> = {
    csharp: "C#",
    cpp: "C++",
    c: "C",
    php: "PHP",
}

/** Neutral fallback colour for languages without a brand colour. */
const FALLBACK_COLOR = "#8c95a1"

/** Brand colour for a language key, or a neutral fallback when unknown. */
const getLanguageColor = (key: string): string =>
    LANGUAGE_COLORS[key.toLowerCase()] ?? FALLBACK_COLOR

/** Display name for a language key (proper casing: `csharp`→`C#`, `cpp`→`C++`, otherwise title-cased). */
const getLanguageLabel = (key: string): string => {
    const lower = key.toLowerCase()
    return LANGUAGE_LABELS[lower] ?? lower.charAt(0).toUpperCase() + lower.slice(1)
}

/** One language slice: its key + count. */
export interface LanguageDonutItem {
    /** Language enum value (drives colour + label). */
    key: string
    /** Count for this language (slice size). */
    value: number
}

/** Props for {@link LanguageDonut}. */
export interface LanguageDonutProps {
    /** Language buckets to plot. */
    items: Array<LanguageDonutItem>
    /** Centre big-number unit label (e.g. "solved" / "bài"). */
    unitLabel: string
    /** Accessible description of the donut. */
    ariaLabel: string
    /** Donut diameter in px. Defaults to 128. */
    size?: number
    /** Ring thickness in px (outer − inner radius). Defaults to 8 (matches a bar). */
    thickness?: number
    /** Extra classes on the root element. */
    className?: string
}

/**
 * GitHub-style language-mix donut — a recharts ring split by language (brand
 * colours via {@link getLanguageColor}), a centred total, and a colour-dot legend
 * with per-language count + share. Pure/props-only block; owns its look.
 *
 * @param props - {@link LanguageDonutProps}
 */
export const LanguageDonut = ({
    items,
    unitLabel,
    ariaLabel,
    size = 128,
    thickness = 8,
    className,
}: LanguageDonutProps) => {
    // total across languages — denominator for the legend percentages
    const total = useMemo(
        () => items.reduce((sum, item) => sum + item.value, 0),
        [items],
    )

    if (items.length === 0 || total === 0) {
        return null
    }

    // exact px radii → a ring of precisely `thickness` px
    const outerRadius = size / 2
    const innerRadius = Math.max(0, outerRadius - thickness)

    return (
        <div className={cn("flex flex-col items-center gap-6 @app-sm:flex-row", className)}>
            {/* the donut — labelled as an image for screen readers */}
            <div
                role="img"
                aria-label={ariaLabel}
                style={{ width: size, height: size }}
                className="relative shrink-0"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip
                            formatter={(value, name) => [
                                `${value}`,
                                getLanguageLabel(String(name)),
                            ]}
                        />
                        <Pie
                            data={items}
                            dataKey="value"
                            nameKey="key"
                            innerRadius={innerRadius}
                            outerRadius={outerRadius}
                            paddingAngle={2}
                            stroke="none"
                        >
                            {items.map((item) => (
                                <Cell
                                    key={item.key}
                                    fill={getLanguageColor(item.key)}
                                    aria-hidden
                                    focusable="false"
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* centre total */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0">
                    <Typography type="h3" weight="semibold">{total}</Typography>
                    <Typography type="body-xs" color="muted">{unitLabel}</Typography>
                </div>
            </div>

            {/* colour-coded legend with per-language count + share */}
            <div className="flex w-full flex-col gap-3">
                {items.map((item) => (
                    <div key={item.key} className="flex items-center gap-2">
                        <span
                            aria-hidden
                            className="size-3 shrink-0 rounded-full"
                            style={{ backgroundColor: getLanguageColor(item.key) }}
                        />
                        <Typography type="body-xs" color="muted" className="flex-1">
                            {getLanguageLabel(item.key)}
                        </Typography>
                        <Typography type="body-xs" color="muted">{item.value}</Typography>
                        <Typography type="body-xs" color="muted" className="w-10 shrink-0 text-right">
                            {Math.round((item.value / total) * 100)}%
                        </Typography>
                    </div>
                ))}
            </div>
        </div>
    )
}
