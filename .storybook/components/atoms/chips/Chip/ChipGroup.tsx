import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { Tooltip } from "@sb-components/atoms/overlay/Tooltip/Tooltip"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { ChipBase, type ChipTone } from "./ChipBase"
/**
 * `ChipGroup` — a row of chips described by `items` data, truncated when it overflows.
 *
 * The only member of the chip family with dependencies: it imports `ChipBase` and
 * `Tooltip`. Shows up to `maxVisible` chips; the rest collapse into a single `+N` chip
 * whose tooltip lists the full set.
 *
 * The group carries no meaning of its own — just layout gap plus `ChipBase` instances.
 * Per-chip state (`icon`/`onRemove`/dot color) belongs to `ChipBase`; the group's story
 * doesn't repeat it.
 */
/** One chip in {@link ChipGroup} — described as data, not JSX. */
export interface ChipGroupItem {
    /** React key. Set explicitly so two chips with identical text don't collide. */
    key: string
    /** Chip label. */
    text: ReactNode
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
    /** `true` → skeleton mirrors the resting-state cell count (each cell is its own `ChipBase`). */
    isSkeleton?: boolean
    showAnatomy?: boolean
    /** `data-anat-part` name on the row's root, so a wrapping component can name this cluster. */
    anatPart?: string
    /** @deprecated pass `classNames` instead — a free string cannot be constrained. */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}
export const ChipGroup = ({
    items,
    maxVisible = 3,
    tone = "default",
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
    className,
    classNames,
}: ChipGroupProps) => {
    // Dependency-tree label: the tree is built from the DOM, so the group must name
    // what it renders.
    const chipPart = showAnatomy ? "Chip" : undefined
    if (isSkeleton) {
        return (
            <div className={cn("flex flex-wrap items-center gap-2", className, classNames)} data-anat-part={anatPart}>
                {/* Matches the resting footprint: `maxVisible` cells, each drawing its own
                    shimmer — the group doesn't draw it for them, or the two shapes would
                    drift apart. */}
                {Array.from({ length: maxVisible }).map((_, index) => (
                    // Shimmer carries no tone (plain gray), so `tone` isn't passed down —
                    // passing a prop with no effect would make a reader think it does something.
                    <ChipBase key={index} isSkeleton anatPart={chipPart} />
                ))}
            </div>
        )
    }
    const visibleItems = items.slice(0, maxVisible)
    // Only counts real overflow for `+N`; clamped to 0 so a shorter row doesn't go negative.
    const overflowCount = Math.max(0, items.length - maxVisible)
    return (
        <div className={cn("flex flex-wrap items-center gap-2", className, classNames)} data-anat-part={anatPart}>
            {visibleItems.map(({ key, text }) => (
                <ChipBase key={key} text={text} tone={tone} anatPart={chipPart} />
            ))}
            {overflowCount > 0 ? (
                <Tooltip
                    showAnatomy={showAnatomy}
                    label={
                        // Tooltip lists the full row, including the visible part —
                        // opening it shows "everything", not just "what's hidden".
                        <div className="flex max-h-[200px] flex-col gap-2 overflow-y-auto">
                            {items.map(({ key, text }) => (
                                <span key={key}>{text}</span>
                            ))}
                        </div>
                    }
                >
                    <ChipBase text={`+${overflowCount}`} tone={tone} anatPart={chipPart} />
                </Tooltip>
            ) : null}
        </div>
    )
}