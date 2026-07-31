import type { ReactNode } from "react"
import { Label, Skeleton as HeroSkeleton, cn } from "@heroui/react"

/**
 * `FieldFrame` — the label / hint / control / error scaffold every form atom
 * composes so the atom itself is the full field.
 *
 * Self-contained in the atom layer: HeroUI only, no importing from `blocks/`.
 * Owns the vertical rhythm (`flex flex-col`, gap set by `gap` — default
 * `"tight"` = `gap-1`): label on top, hint below the label, control, error
 * line last — and mirrors the exact shape when `isSkeleton`.
 *
 * "Bare" mode: when there is no label/hint/errorMessage/required (and not
 * skeleton), FieldFrame renders `children` directly with zero wrapper, so the
 * atom can still be used as a bare cell nested inside something else.
 */
export interface FieldFrameProps {
    /** Label above the control (`text-sm font-medium`). Omit → no label. */
    label?: ReactNode
    /** Description below the label (`text-xs text-muted`) — ALWAYS shown (unlike errorMessage). */
    hint?: ReactNode
    /** Error line below the control (`text-sm text-danger`) — set → field invalid. */
    errorMessage?: ReactNode
    /**
     * Vertical rhythm between label/hint/control/error. Default `"tight"`
     * (`gap-1`) treats the four parts as one field, not separate regions.
     * `"related"` (`gap-2`) loosens that for a field that needs to breathe
     * more. Mirrors the frame tier's `SeamScale` naming but is redeclared
     * locally rather than imported, since an atom can't import from outside
     * its own layer.
     */
    gap?: "tight" | "related"
    /** Adds a `*` mark (text-danger) after the label. */
    isRequired?: boolean
    /** Dims the label (locking the control itself is the atom's job). */
    isDisabled?: boolean
    /** Loading mirror: a label-width skeleton over a control-skeleton, keeping the same column. */
    isSkeleton?: boolean
    /** Control-shaped skeleton for `isSkeleton` (the atom passes its own box). */
    skeletonControl?: ReactNode
    /**
     * The real control (an already-wrapped HeroUI cell). `FieldFrame` is a
     * wrapping frame that must accept the calling atom's arbitrary control
     * as-is (Input/Select/Choice/…) — it can't be swapped for a data prop,
     * since the control isn't "content" but a whole component tree.
     */
    children?: ReactNode
    /** The control's `id` so the label's `htmlFor` points correctly — the atom passes the same id down to the control. */
    id?: string
    /** Class for outside the column. */
    className?: string
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

/** {@link FieldFrameProps.gap} step → literal class (kept local — see the prop's JSDoc). */
const GAP_CLASS: Record<"tight" | "related", string> = {
    tight: "gap-1",
    related: "gap-2",
}

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
    gap = "tight",
    isRequired,
    isDisabled,
    isSkeleton,
    skeletonControl,
    children,
    id,
    className,
}: FieldFrameProps) => {
    const hasFrame = label != null || hint != null || errorMessage != null

    // ── Loading mirror ────────────────────────────────────────────────────────
    if (isSkeleton) {
        // Bare skeleton (no label frame) → just the control skeleton box (badges Skeleton itself).
        if (!hasFrame && label == null) {
            return <>{skeletonControl}</>
        }
        return (
            <div className={cn("flex flex-col", GAP_CLASS[gap], className)}>
                {label != null ? (
                    <HeroSkeleton className="h-4 w-1/3 rounded-md" />
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
        <div className={cn("flex flex-col", GAP_CLASS[gap], className)}>
            {label != null ? (
                <Label htmlFor={id} isDisabled={isDisabled} className="text-sm font-medium">
                    {withRequired(label, isRequired)}
                </Label>
            ) : null}

            {hint != null ? (
                <p className="text-muted text-xs">
                    {hint}
                </p>
            ) : null}

            {children}

            {errorMessage != null ? (
                <p className="text-danger text-sm">
                    {errorMessage}
                </p>
            ) : null}
        </div>
    )
}

/** `FieldFrame.*` — label/hint/control/error scaffold namespace. */
export { FieldFrameBase as FieldFrame }
