import { cn } from "@heroui/react"
import { Tooltip } from "@sb-components/atoms/overlay/Tooltip/Tooltip"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
/**
 * `ChipGroup` — a row of chips built from `items` data, cut at `maxVisible`, the overflow
 * gathered into a `+N` chip that opens a Tooltip. Owns cluster-level state (`items`,
 * `maxVisible`, `tone`, `isSkeleton`); each pill is a real `Chip`, whose per-chip state (glyph,
 * color dot, × button) lives in the `Chip` story.
 */
/** One chip in {@link ChipGroup} — described as data, not JSX. */
export interface ChipGroupItem {
    /** React key. Set explicitly so two chips with identical text don't collide. */
    key: string
    /** Chip label. */
    text: string
}
/** Props for {@link ChipGroup} — a row of chips that collapses overflow into "+N". */
export interface ChipGroupProps {
    /**
     * The row of chips, described as data — not structure or child JSX.
     */
    items: Array<ChipGroupItem>
    /**
     * How many chips show before the rest collapse into `+N`. Default `3`.
     */
    maxVisible?: number
    /**
     * Tone for the whole row (default `default`) — a row reads as one set only when
     * every chip shares a color; one tone per item would look like a rainbow. So `tone`
     * lives on the group, not on each item.
     */
    tone?: ChipTone
    /** `true` → skeleton mirrors the resting-state cell count (each cell is its own `Chip`). */
    isSkeleton?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "ChipGroup" } as const

export const ChipGroup = ({
    items,
    maxVisible = 3,
    tone = "default",
    isSkeleton = false,
    classNames,
}: ChipGroupProps) => {
    if (isSkeleton) {
        return (
            <div
                className={cn("flex flex-wrap items-center gap-2", classNames)}

                data-tier="composite"
                data-component="ChipGroup"
                data-principles="chip-row"
            >
                {/* Matches the resting footprint: `maxVisible` cells, each drawing its own
                    shimmer — the group doesn't draw it for them, or the two shapes would
                    drift apart. */}
                {Array.from({ length: maxVisible }).map((_, index) => (
                    // Shimmer carries no tone (plain gray), so `tone` isn't passed down —
                    // passing a prop with no effect would make a reader think it does something.
                    <Chip key={index} isSkeleton />
                ))}
            </div>
        )
    }
    const visibleItems = items.slice(0, maxVisible)
    // Only counts real overflow for `+N`; clamped to 0 so a shorter row doesn't go negative.
    const overflowCount = Math.max(0, items.length - maxVisible)
    return (
        <div
            className={cn("flex flex-wrap items-center gap-2", classNames)}

            data-tier="composite"
            data-component="ChipGroup"
            data-principles="chip-row"
        >
            {visibleItems.map(({ key, text }) => (
                <Chip key={key} text={text} tone={tone} />
            ))}
            {overflowCount > 0 ? (
                <Tooltip

                    label={
                        // Tooltip lists the full row, including the visible part —
                        // opening it shows "everything", not just "what's hidden".
                        <div data-principles="sibling-stack" className="flex max-h-[200px] flex-col gap-2 overflow-y-auto">
                            {items.map(({ key, text }) => (
                                <span key={key}>{text}</span>
                            ))}
                        </div>
                    }
                >
                    <Chip text={`+${overflowCount}`} tone={tone} />
                </Tooltip>
            ) : null}
        </div>
    )
}