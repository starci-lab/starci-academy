/** @noSkeleton renders the brand mark, which is always present and never loading. */
import { cn } from "@heroui/react"

/**
 * ATOM — `OMark`: nivo's Operating-Loop brand mark — a near-closed ring (a
 * muted Slate base arc + a Core Crimson active arc) plus one Signal Coral AI
 * node. Inline SVG, fixed brand colours, transparent background.
 *
 * Its only prop is `size` (plus `classNames`, which produces no leaf of its
 * own) — so the atom has no leaf other than `Default`, no union to enumerate.
 * The side-by-side tiles (both real hosts + a light-surface check) are
 * `states[]` entries of that one leaf, not separate leaves — the same shape
 * `Logo`'s own story takes.
 */

/**
 * The two real hosts this mark sits in: inline beside the wordmark (navbar,
 * footer — `size-6`) and standing alone as the hero's large loop visual
 * (`size-24`). Not a general size scale — a caller in a third context still
 * has neither of these fit and should get a new named value added here, not a
 * raw size passed through `classNames`.
 */
export type OMarkSize = "inline" | "large"

/** `size` → the exact square dimension each host already relies on. */
const SIZE_CLASS: Record<OMarkSize, string> = {
    inline: "size-6",
    large: "size-24",
}

/** Props for the {@link OMark} atom. */
export interface OMarkProps {
    /**
     * Which host this mark sits in — drives the root's square dimension.
     * Defaults to `"inline"` (`size-6`), the navbar/footer lockup.
     */
    size?: OMarkSize
}

/**
 * OMark — the Operating-Loop brand mark: a near-closed ring in two arcs (a
 * muted Slate base + a Core Crimson active segment) with one Signal Coral
 * node marking the AI point, on a transparent background. Square (1:1),
 * fixed colours — no theme dependency, same reasoning as `Logo`.
 *
 * @param props.size - which host bar this sits in; picks the root's dimension.
 */
const OMarkBase = ({ size = "inline" }: OMarkProps) => (
    <svg
        data-tier="atom"
        data-component="OMark"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        className={cn(SIZE_CLASS[size], "shrink-0")}
        role="img"
        aria-label="nivo"
    >
        {/* base ring — near-closed, a muted Slate arc standing in for the whole loop */}
        <circle
            cx="20"
            cy="20"
            r="15"
            fill="none"
            stroke="#64748B"
            strokeOpacity="0.55"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeDasharray="68 26"
            transform="rotate(-96 20 20)"
        />
        {/* active ring — the Core Crimson segment marking the loop's live edge */}
        <circle
            cx="20"
            cy="20"
            r="15"
            fill="none"
            stroke="#E11D48"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeDasharray="22 72"
            transform="rotate(34 20 20)"
        />
        {/* AI node — the Signal Coral point on the loop */}
        <circle cx="31.2" cy="12.6" r="2.7" fill="#FB7185" />
    </svg>
)

export { OMarkBase as OMark }

/** Tier metadata for `OMark`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "OMark" } as const
