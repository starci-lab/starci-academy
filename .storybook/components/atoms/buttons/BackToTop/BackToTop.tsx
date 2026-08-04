import { cn } from "@heroui/react"
import { ArrowUpIcon } from "@phosphor-icons/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * ATOM — `BackToTop`: one round accent control with a single fixed glyph (an
 * up arrow), that fades between hidden and visible. It composes no other
 * component — the glyph is hard-coded, not a caller-supplied child — so it
 * stays one element rather than the generic icon-button composite
 * (`FloatingActionButton`, whose `icon` IS a caller value).
 *
 * `isVisible` is the one leaf — the atom owns every state its shown/hidden
 * value can be in (ATOM-4). It renders in-flow: WHERE it floats on the page
 * is the host shell's call (nivo's `MarketingLandingShell` wraps it in
 * `fixed bottom-6 end-6 z-40`), not this atom's — position is the one class
 * of decision only the parent can make.
 */

/** Props for the {@link BackToTop} atom. */
export interface BackToTopProps {
    /** `true` → the control fades in and becomes pressable; `false` → faded out, unreachable by tab. */
    isVisible: boolean
    /** Fired when pressed — the caller scrolls the page back to the top. */
    onPress: () => void
    /** Accessible name, announced by screen readers (already resolved by the caller). */
    label: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * The back-to-top control. See the file header for why `isVisible` is the one
 * leaf and why the floating placement is left to the caller.
 *
 * @param props - {@link BackToTopProps}
 */
const BackToTopBase = ({ isVisible, onPress, label, classNames }: BackToTopProps) => (
    <button
        type="button"
        data-tier="atom"
        data-component="BackToTop"
        aria-label={label}
        aria-hidden={!isVisible}
        tabIndex={isVisible ? 0 : -1}
        onClick={onPress}
        className={cn(
            "inline-flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-all duration-200",
            isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
            classNames,
        )}
    >
        <ArrowUpIcon aria-hidden weight="bold" className="size-5" />
    </button>
)

/** `BackToTop.*` — the back-to-top control namespace. */
export { BackToTopBase as BackToTop }

export const meta = { tier: "atom", name: "BackToTop" } as const
