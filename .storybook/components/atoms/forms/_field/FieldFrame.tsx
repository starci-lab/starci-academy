import type { ReactNode } from "react"
import { Label, Skeleton as HeroSkeleton, cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM-INTERNAL — `FieldFrame`: the label · hint · control · error SCAFFOLD that
 * every form atom composes so the atom itself IS the full field (teacher decided
 * 2026-07-25: "label/errorMessage count toward the atom", NO separate Field
 * atom).
 *
 * Self-contained in the atom layer (HeroUI only — NO importing blocks/, since the
 * atom is the lowest layer). Owns the vertical rhythm (`flex flex-col gap-1.5`):
 * label on top, hint below the label, control, error line last — and mirrors the
 * exact shape when `isSkeleton`.
 *
 * "Bare" mode: when there is NO label/hint/errorMessage/required (and not
 * skeleton), FieldFrame renders children DIRECTLY — zero wrapper, so the atom can
 * still be used as a bare cell nested inside something else.
 *
 * Anatomy parts (§11a — an atom badges its own direct parts): Label · Description ·
 * Error. The control cell badges its own part (`Field`/`Skeleton`) — FieldFrame does
 * NOT badge the Control wrapper, to avoid nesting two badge tiers.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export interface FieldFrameProps {
    /** Label above the control (`text-sm font-medium`). Omit → no label. */
    label?: ReactNode
    /** Description below the label (`text-xs text-muted`) — ALWAYS shown (unlike errorMessage). */
    hint?: ReactNode
    /** Error line below the control (`text-sm text-danger`) — set → field invalid. */
    errorMessage?: ReactNode
    /** Adds a `*` mark (text-danger) after the label. */
    isRequired?: boolean
    /** Dims the label (locking the control itself is the atom's job). */
    isDisabled?: boolean
    /** Loading mirror: a label-width skeleton over a control-skeleton, keeping the same column. */
    isSkeleton?: boolean
    /** Control-shaped skeleton for `isSkeleton` (the atom passes its own box). */
    skeletonControl?: ReactNode
    /**
     * The real control (an already-wrapped HeroUI cell). A valid exception under
     * §12b (a true atom-WRAPPER): `FieldFrame` is a wrapping frame that must accept
     * the calling atom's ARBITRARY control as-is (Input/Select/Choice/…) — it can't
     * be swapped for a data prop, since the control isn't "content" but a whole
     * component tree.
     */
    children?: ReactNode
    /** The control's `id` so the label's `htmlFor` points correctly — the atom passes the same id down to the control. */
    id?: string
    /** Class for outside the column. */
    className?: string
    /** Storybook: badges Label/Description/Control/Error for BlockAnatomy. */
    showAnatomy?: boolean
}

/**
 * Accessible NAME for the control: when `label` is a string, use it directly
 * (guarantees the control always has a readable name — even a compound control
 * like Number/Date/Otp that can't wire up `htmlFor`), otherwise falls back to
 * `fallback` (ariaLabel/placeholder). Avoids the a11y gap of an "unnamed control"
 * when a field has a label that can't be associated.
 */
export const fieldName = (label: ReactNode, fallback?: string): string | undefined =>
    typeof label === "string" ? label : fallback

/** Label + `*` mark when required. */
const withRequired = (label: ReactNode, isRequired?: boolean) =>
    isRequired ? (
        <>
            {label} <span className="text-danger">*</span>
        </>
    ) : (
        label
    )

/**
 * `FieldFrame` — label/hint/control/error column shared by every form atom.
 * @param props - {@link FieldFrameProps}
 */
const FieldFrameBase = ({
    label,
    hint,
    errorMessage,
    isRequired,
    isDisabled,
    isSkeleton,
    skeletonControl,
    children,
    id,
    className,
    showAnatomy = false,
}: FieldFrameProps) => {
    const hasFrame = label != null || hint != null || errorMessage != null

    // ── Loading mirror ────────────────────────────────────────────────────────
    if (isSkeleton) {
        // Bare skeleton (no label frame) → just the control skeleton box (badges Skeleton itself).
        if (!hasFrame && label == null) {
            return <>{skeletonControl}</>
        }
        return (
            <div className={cn("flex flex-col gap-1", className)}>
                {label != null ? (
                    // Node name = the REAL component rendered here (heroui `Skeleton`, in its
                    // label-bar look) — NOT the word "Label" (that's the SLOT it stands in for,
                    // not its identity; the atom's own control skeleton is also a `Skeleton`).
                    <HeroSkeleton className="h-4 w-1/3 rounded-md" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
                ) : null}
                {skeletonControl}
            </div>
        )
    }

    // ── "Bare" — no frame → renders the control directly ───────────────────────
    if (!hasFrame) {
        return <>{children}</>
    }

    // ── Full field ─────────────────────────────────────────────────────────────
    return (
        <div className={cn("flex flex-col gap-1", className)}>
            {label != null ? (
                <Label htmlFor={id} isDisabled={isDisabled} className="text-sm font-medium" data-anat-part={showAnatomy ? "Label" : undefined}>
                    {withRequired(label, isRequired)}
                </Label>
            ) : null}

            {hint != null ? (
                <p className="text-muted text-xs" data-anat-part={showAnatomy ? "Description" : undefined}>
                    {hint}
                </p>
            ) : null}

            {children}

            {errorMessage != null ? (
                <p className="text-danger text-sm" data-anat-part={showAnatomy ? "Error" : undefined}>
                    {errorMessage}
                </p>
            ) : null}
        </div>
    )
}

/** `FieldFrame.*` — label/hint/control/error scaffold namespace. */
export const FieldFrame = Object.assign(FieldFrameBase, {
    Base: FieldFrameBase,
})
