import React from "react"
import { cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * @noSkeleton the reactions are a fixed set the caller declares, not a value fetched behind this
 * component. There is nothing standing behind the row to wait for, so a shimmer here would be a
 * shimmer for nothing.
 *
 * ATOM — `ReactionPicker`: a row of image buttons, each scaling up and lifting
 * with its name floating above on hover, staggered pop-in on mount. Genuinely
 * generic — no "reaction"/"lesson" domain knowledge, only `items`/`activeKey`/
 * `onSelect`. Real consumer: `ContentReaction` (block), which supplies the six
 * emotion images.
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
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
}

/**
 * The reaction-picker row atom. See the file header for the full contract.
 *
 * @param props - {@link ReactionPickerProps}
 */
const ReactionPicker = ({ items, activeKey = null, onSelect, classNames }: ReactionPickerProps) => (
    <div data-tier="atom" data-component="ReactionPicker" className={cn("flex items-center gap-1", classNames)}>
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

export const meta = { tier: "atom", name: "ReactionPicker" } as const
