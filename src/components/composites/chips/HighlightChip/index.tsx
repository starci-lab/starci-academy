import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { Chip, type ChipTone, type IconComponent } from "@/components/atoms/chips/Chip"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/chips/HighlightChip`. Authored in Storybook (not
 * `src`); synced to `src` later. The shared `WithClassNames` base is inlined
 * locally to keep the port free of `@/` imports.
 */

/** Local mirror of the shared `WithClassNames` base (avoids a `@/` import). */
interface WithClassNames<T> {
    classNames?: T
}

/**
 * Semantic tone of the highlight chip — drives the soft tint
 * (`bg-<tone>/10 text-<tone>`). Neutral maps to the default color.
 *
 * Alias, not a redeclaration (decided 2026-07-29): the atom {@link ChipTone}
 * already carries these exact five values in this exact order — a hand-typed
 * copy here was a second source of truth for the same vocabulary.
 */
export type HighlightChipTone = ChipTone

/** Props every {@link HighlightChip} carries regardless of loading state. */
interface HighlightChipOwnProps extends WithClassNames<Array<AllowedClassName>> {
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
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "HighlightChip" } as const

/** A soft-tinted pill pairing a bold `value` with a `label`, e.g. "24 Modules". */
export const HighlightChip = ({ tone = "default", icon, value, label, isSkeleton = false, classNames }: HighlightChipProps) => (
    // Wrapping span exists only to carry the composite's own position (`classNames`)
    // and its tier tags — `Chip` (the house atom) is the one real element rendered,
    // one render path whether loading or not (COMPOSITE-10: the atom draws its own
    // shimmer, sized to the same box, this composite only forwards the flag).
    <span
        className={cn("inline-flex", classNames)}
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
