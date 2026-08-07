import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { Chip, type ChipTone, type IconComponent } from "@sb-components/atoms/chips/Chip/Chip"

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "HighlightChip" } as const

/** Neutral (default): value + label, no leading icon — the plain figure pill. */

/**
 * Semantic tone of the highlight chip — drives the soft tint
 * (`bg-<tone>/10 text-<tone>`). Neutral maps to the default color.
 *
 * Alias, not a redeclaration: the atom {@link ChipTone} already carries these
 * exact five values in this exact order.
 */
export type HighlightChipTone = ChipTone

/** Props every {@link HighlightChip} carries regardless of loading state. */
interface HighlightChipOwnProps {
    /**
     * Semantic tone driving the soft-tinted color. Defaults to "default" (neutral).
     */
    tone?: HighlightChipTone
    /**
     * Optional leading icon, passed as a COMPONENT reference (e.g. `icon={BookIcon}`),
     * never JSX — the house `Chip` atom renders it, at its own glyph scale (COMPOSITE-8:
     * a node arrives already called, so this composite could not hand it `isSkeleton`).
     */
    icon?: IconComponent
}

/**
 * Props for the {@link HighlightChip} block. `value`/`label` are REQUIRED unless
 * `isSkeleton` (§12b) — a shimmer pill has no figure to show yet.
 */
export type HighlightChipProps = HighlightChipOwnProps &
    (
        | { isSkeleton: true; value?: ReactNode; label?: ReactNode }
        | { isSkeleton?: false; value: ReactNode; label: ReactNode }
    )

/**
 * Stat / meta chip with a highlighted value: a soft-tinted pill rendering an
 * optional leading icon, a bold `value`, then a `label` — e.g. "24 Modules",
 * "276 Practice exercises". Pure and props-only (tone drives the color). Used in the
 * `PageHeader` meta row to show a course's figures.
 */
export const HighlightChip = ({ tone = "default", icon, value, label, isSkeleton = false }: HighlightChipProps) => (
    // Wrapping span exists only to carry the composite's own position (`classNames`)
    // and its tier tags — `Chip` (the house atom) is the one real element rendered,
    // one render path whether loading or not (COMPOSITE-10: the atom draws its own
    // shimmer, sized to the same box, this composite only forwards the flag).
    <span
        className={cn("inline-flex")}
        data-tier="composite"
        data-component="HighlightChip"
    >
        <Chip
            tone={tone}
            icon={icon}
            isSkeleton={isSkeleton}
            text={
                isSkeleton ? undefined : (
                    <>
                        <span className="font-medium">{value}</span> {label}
                    </>
                )
            }
        />
    </span>
)
