import React, { useId } from "react"
import { Label, Typography, cn } from "@heroui/react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — the field-wrapper FOUNDATION for the form family.
 * Authored in Storybook (not `src`); synced to `src` later. No `@/components`
 * import — self-contained.
 *
 * FieldShell OWNS the label / hint / error / skeleton LAYOUT (canon §4 Ownership,
 * §8 isSkeleton) so every input composes it instead of re-implementing that
 * scaffolding. A concrete input (TextField, Select, TextArea…) passes a bare
 * control as {@link FieldShellProps.children} and a matching control-shaped
 * skeleton as {@link FieldShellProps.skeletonControl}; FieldShell renders the
 * label on top, the description under it, the control, and the error line below —
 * and mirrors that exact shape while loading.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link FieldShell}. */
export interface FieldShellProps {
    /**
     * Field label rendered above the control (`text-sm font-medium`). Omit for a
     * bare field, or for an INLINE boolean input whose label sits beside its
     * control — see the composition note below.
     */
    label?: React.ReactNode
    /**
     * Hint under the label (`text-xs text-muted`) explaining the field. Distinct
     * from {@link errorMessage}: descriptions are always shown, errors only when
     * something is wrong.
     */
    description?: React.ReactNode
    /**
     * Error line shown below the control (`text-sm text-danger-soft-foreground`).
     * When present the field reads as invalid; the consuming input also wires this
     * into its control's `isInvalid`.
     */
    errorMessage?: React.ReactNode
    /** Disables the label styling (control disabling is the consumer's job). */
    isDisabled?: boolean
    /**
     * Renders the loading MIRROR (canon §8): a label-width text skeleton over the
     * control skeleton. Keeps the exact `gap-2` column so nothing shifts when data
     * arrives.
     */
    isSkeleton?: boolean
    /**
     * The control-shaped skeleton shown while {@link isSkeleton} — each input
     * passes its own (e.g. `<Skeleton.Select/>`, `<Skeleton.TextArea/>`). Defaults
     * to `<Skeleton.Input/>` (a single-line field box).
     */
    skeletonControl?: React.ReactNode
    /** The real control (e.g. a HeroUI `<TextField>`/`<Select>`), rendered live. */
    children?: React.ReactNode
    /**
     * `id` of the control this label describes. When set, the label gets a
     * matching `htmlFor` so clicking it focuses the control; the consuming input
     * should pass the SAME id to its control. Auto-generated when omitted.
     */
    id?: string
    /** Extra classes on the outer column. */
    className?: string
}

/**
 * FieldShell is the shared field wrapper every form input composes. It owns the
 * vertical rhythm — label, description, control, error — as a `flex flex-col
 * gap-2` column and, while {@link FieldShellProps.isSkeleton} is set, swaps the
 * label + control for a shape-matched skeleton so the loading box shares the
 * field's exact footprint.
 *
 * INLINE / BOOLEAN inputs (Checkbox, Switch, RadioGroup) whose label sits BESIDE
 * the control keep rendering that beside-label THEMSELVES (HeroUI's Checkbox/Radio
 * carry their own label slot). They compose FieldShell WITHOUT the `label` prop —
 * passing the labelled control(s) as `children` — and use FieldShell only for the
 * optional GROUP `description` + `errorMessage` + skeleton column. Pass `label`
 * only when you want a group heading above the row(s).
 *
 * @param props - {@link FieldShellProps}
 */
export const FieldShell = ({
    label,
    description,
    errorMessage,
    isDisabled,
    isSkeleton,
    skeletonControl,
    children,
    id,
    className,
}: FieldShellProps) => {
    // stable id so the label can point at the control the consumer wires up
    const autoId = useId()
    const controlId = id ?? autoId

    if (isSkeleton) {
        return (
            <div className={cn("flex flex-col gap-2", className)}>
                {/* Label bar — a body-sm text skeleton at a label-ish width */}
                {label != null ? <Skeleton.Typography type="body-sm" width="1/3" /> : null}
                {/* Control mirror — the input's own control-shaped skeleton, or a field box */}
                {skeletonControl ?? <Skeleton.Input />}
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            {/* Label (text-sm font-medium) — htmlFor points at the consumer's control id */}
            {label != null ? (
                <Label htmlFor={controlId} isDisabled={isDisabled} className="text-sm font-medium">
                    {label}
                </Label>
            ) : null}

            {/* Hint under the label — always shown, unlike the error line */}
            {description != null ? (
                <Typography type="body-xs" className="text-muted">
                    {description}
                </Typography>
            ) : null}

            {/* The live control */}
            {children}

            {/* Error line — danger token, only when invalid */}
            {errorMessage != null ? (
                <Typography type="body-sm" className="text-danger-soft-foreground">
                    {errorMessage}
                </Typography>
            ) : null}
        </div>
    )
}
