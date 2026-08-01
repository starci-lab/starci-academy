import type { ReactNode } from "react"
import { Label, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * `FieldFrame` — the label / hint / control / error scaffold every form atom
 * composes so the atom itself is the full field.
 *
 * Self-contained in the atom layer: HeroUI only, no importing from `blocks/`.
 * Owns the vertical rhythm (`flex flex-col`, a fixed `gap-3` — the label rule,
 * see `FIELD_SEAM`): label on top, hint below the label, control, error line
 * last — and mirrors the exact shape when `isSkeleton`.
 *
 * "Bare" mode: when there is no label/hint/errorMessage/required (and not
 * skeleton), FieldFrame renders `children` directly with zero wrapper, so the
 * atom can still be used as a bare cell nested inside something else.
 *
 * Only `Label` and the label-bar `Skeleton` carry `data-anat-part` — both are
 * HeroUI's own components. `Description`/`Error` stay unbadged: they're plain
 * hand-rolled `<p>`s, not real components, and `FieldFrame` has no story of
 * its own to declare them against. The control cell badges its own part;
 * `FieldFrame` doesn't badge the control wrapper, to avoid nesting two badge
 * tiers.
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
     * The real control (an already-wrapped HeroUI cell). `FieldFrame` is a
     * wrapping frame that must accept the calling atom's arbitrary control
     * as-is (Input/Select/Choice/…) — it can't be swapped for a data prop,
     * since the control isn't "content" but a whole component tree.
     */
    children?: ReactNode
    /** The control's `id` so the label's `htmlFor` points correctly — the atom passes the same id down to the control. */
    id?: string
    /** Where this sits inside its parent (the outer column). Everything about appearance is a prop of its own. */
    classNames?: Array<AllowedClassName>
    /** Storybook: badges Label/Description/Control/Error for BlockAnatomy. */
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

/**
 * The seam between a label and the control it names is step 4 (`gap-3`, 12px) — a label names its
 * subject across a change of register, and `principles/gap.md`'s label rule sits that boundary at
 * step 4. It is fixed, not a prop: the old `tight`/`related` choice let one field breathe at a
 * different rhythm than the next for no reason a reader could name, which is the ambiguity the
 * numeric scale exists to end. Every field in the system now stacks at the same seam.
 */
const FIELD_SEAM = "gap-3"

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
    classNames}: FieldFrameProps) => {
    const hasFrame = label != null || hint != null || errorMessage != null

    // ── Loading mirror ────────────────────────────────────────────────────────
    if (isSkeleton) {
        // Bare skeleton (no label frame) → just the control skeleton box (badges Skeleton itself).
        if (!hasFrame && label == null) {
            return <>{skeletonControl}</>
        }
        return (
            <div data-tier="atom" data-component="FieldFrame" data-principles="label-field" className={cn("flex flex-col", FIELD_SEAM, classNames)}>
                {label != null ? (
                    // label-bar look), not the slot word "Label" it stands in for.
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
        <div data-tier="atom" data-component="FieldFrame" className={cn("flex flex-col", FIELD_SEAM, classNames)}>
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

export const meta = { tier: "atom", name: "FieldFrame" } as const
