import React from "react"
import { cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `ReactionPicker`: a row of image buttons, each scaling up and lifting
 * with its name floating above on hover, popping in with a slight stagger when
 * the row first appears (Facebook-style reaction picker).
 *
 * ⭐⭐ EXTRACTED 2026-07-28 (thầy — a block had written this exact animation
 * CSS itself: `animate-[reactionPop_…]`, `group/fbreact`,
 * `group-hover/fbreact:scale-[1.45]`, `text-[10px]`… CSS phức tạp chỉ được ở
 * atom/frame, không phải composite/block/screen). This atom owns ALL of that
 * CSS; a caller only supplies plain data (`items`, `activeKey`, `onSelect`).
 * It knows NOTHING about what the images mean — no "reaction" enum, no
 * "lesson" — genuinely reusable for any small labeled-icon picker with this
 * exact micro-interaction.
 *
 * `reactionPop` is a real `@keyframes` in `src/app/globals.css` (Storybook's
 * `preview.tsx` imports the same file), not invented here.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One pickable item in a {@link ReactionPicker} row. */
export interface ReactionPickerItem {
    /** Stable key — also the value passed to `onSelect`. */
    key: string
    /** Image shown at rest and enlarged on hover (an emoji SVG, a sticker…). */
    imgSrc: string
    /** Name floating above the image on hover; also the `aria-label`. */
    label: string
}

/** Props for {@link ReactionPicker}. */
export interface ReactionPickerProps {
    /** The pickable items, in display order. */
    items: ReadonlyArray<ReactionPickerItem>
    /** Currently-active key (tinted background), or `null` for none active. */
    activeKey?: string | null
    /** Fired with the picked item's key. */
    onSelect: (key: string) => void
    /** Extra classes on the row. */
    className?: string
}

/**
 * The reaction-picker row atom. See the file header for the full contract.
 *
 * @param props - {@link ReactionPickerProps}
 */
const ReactionPicker = ({ items, activeKey = null, onSelect, className }: ReactionPickerProps) => (
    <div className={cn("flex items-center gap-1", className)}>
        {items.map((item, index) => (
            <button
                key={item.key}
                type="button"
                aria-label={item.label}
                aria-pressed={activeKey === item.key}
                onClick={() => onSelect(item.key)}
                // each item bounces in slightly after the previous one
                style={{ animationDelay: `${index * 35}ms` }}
                className={cn(
                    "group/reactionpick relative flex animate-[reactionPop_220ms_cubic-bezier(0.34,1.56,0.64,1)_both]",
                    "cursor-pointer items-center justify-center rounded-full p-1 outline-none",
                    "focus-visible:ring-2 focus-visible:ring-accent",
                    activeKey === item.key ? "bg-accent-soft" : undefined,
                )}
            >
                {/* name floats above on hover */}
                <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 scale-90 whitespace-nowrap rounded-full bg-foreground px-2 py-0 text-[10px] font-medium text-background opacity-0 transition-all duration-150 group-hover/reactionpick:scale-100 group-hover/reactionpick:opacity-100">
                    {item.label}
                </span>
                {/* image scales up + lifts on hover (isolated from the pop-in transform) */}
                <span className="block origin-bottom transition-transform duration-150 ease-out group-hover/reactionpick:-translate-y-1 group-hover/reactionpick:scale-[1.45]">
                    <img src={item.imgSrc} alt="" aria-hidden draggable={false} className="inline-block size-7 select-none" />
                </span>
            </button>
        ))}
    </div>
)

export { ReactionPicker }
