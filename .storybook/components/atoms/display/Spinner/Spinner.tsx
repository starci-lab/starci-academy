import { Spinner as HeroSpinner, cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Spinner`: the ONE constrained spinner atom over HeroUI Spinner.
 *
 * Chỉ-báo BUSY (một glyph xoay), phân biệt bằng PROP (leaf = composition):
 *   • mặc định             → `<Spinner />`
 *   • size                  → `<Spinner size="lg" />` (sm · md · lg · xl)
 *   • tone                  → `<Spinner tone="current" />` (theo màu chữ container)
 *
 * KHÔNG có `isSkeleton`: spinner CHÍNH LÀ chỉ-báo tải — skeleton vô nghĩa ở đây.
 * `label` = tên a11y (aria-label); atom tự ép size/tone (§4).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Spinner size preset. */
export type SpinnerSize = "sm" | "md" | "lg" | "xl"

/** Spinner tone. `current` inherits the surrounding text colour (e.g. inside a button). */
export type SpinnerTone = "accent" | "current" | "danger" | "success" | "warning"

/** Props for {@link SpinnerBase}. */
export interface SpinnerBaseProps {
    /** Size preset. Default `md`. */
    size?: SpinnerSize
    /** Tone. Default `accent`; `current` follows the container's text colour. */
    tone?: SpinnerTone
    /** Accessible name (announced by screen readers). Default `"Đang tải"`. */
    label?: string
    /** `true` → tag the spinner with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    className?: string
}

/**
 * The base spinner atom — a busy indicator. See file header for the (no-skeleton) contract.
 *
 * @param props - {@link SpinnerBaseProps}
 */
const SpinnerBase = ({ size = "md", tone = "accent", label = "Loading", showAnatomy = false, className }: SpinnerBaseProps) => (
    <HeroSpinner
        aria-label={label}
        size={size}
        color={tone}
        className={cn(className)}
        data-anat-part={showAnatomy ? "Spinner" : undefined}
    />
)

/**
 * `Spinner.*` — the spinner ATOM namespace. `Spinner` is the single
 * constrained spinner; size / tone are LEAVES of it (prop-driven).
 */
export { SpinnerBase as Spinner }
