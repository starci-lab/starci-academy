import type {
    SkeletonTextSize,
} from "./index"

/**
 * Maps every {@link SkeletonTextSize} token to the Tailwind height + vertical
 * margin classes that make the skeleton bar occupy the exact line-box of the
 * real text it replaces.
 *
 * Metric rule (Tailwind v4.2.1 default type scale, 1rem = 16px):
 * `height = font-size`, `my = (line-height − font-size) / 2`.
 *
 * Does NOT include `rounded-full` — that pill radius is applied unconditionally
 * by the component, so it stays out of the lookup map.
 */
export const skeletonTextSizeMap: Record<SkeletonTextSize, string> = {
    /** 12px font / 16px line-height. */
    xs: "h-[12px] my-[2px]",
    /** 14px font / 20px line-height. */
    sm: "h-[14px] my-[3px]",
    /** 16px font / 24px line-height. */
    base: "h-[16px] my-[4px]",
    /** 18px font / 28px line-height. */
    lg: "h-[18px] my-[5px]",
    /** 20px font / 28px line-height. */
    xl: "h-[20px] my-[4px]",
    /** 24px font / 32px line-height. */
    "2xl": "h-[24px] my-[4px]",
    /** 30px font / 36px line-height. */
    "3xl": "h-[30px] my-[3px]",
    /** 36px font / 40px line-height. */
    "4xl": "h-[36px] my-[2px]",
    /** 48px font / 48px line-height (no extra margin). */
    "5xl": "h-[48px]",
    /** 60px font / 60px line-height (no extra margin). */
    "6xl": "h-[60px]",
}
