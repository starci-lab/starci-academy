import type { ReactNode } from "react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * Field-frame props every form atom accepts to carry its own label, hint,
 * error, and required mark. Omit them all and the atom renders as a bare
 * control (FieldFrame renders the control straight through).
 *
 * Exported so the `InputTags` composite can reuse the same shape.
 */
export interface FrameProps {
    /** Label above the control. */
    label?: ReactNode
    /** Description below the label (always visible). */
    hint?: ReactNode
    /** Error line below the control (set it to show an error border). */
    errorMessage?: ReactNode
    /** Adds a required `*` mark. */
    isRequired?: boolean
}

/** Props for the field-box shimmer owned by input atoms. */
export interface FieldSkeletonProps {
    /** Height class of the bar — matches the real control it stands in for. */
    heightCls?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/** Shared props for text-string members, excluding the value pair and `isSkeleton`. */
export interface StringFieldOwnProps extends FrameProps {
    placeholder?: string
    isDisabled?: boolean
    isInvalid?: boolean
    /** Accessible name used when there's no `label` (otherwise the label handles it). */
    ariaLabel?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * `value`/`onValueChange` are required when the field is live, optional when
 * `isSkeleton` is set — the field-box shimmer doesn't hold a value.
 */
export type StringFieldProps = StringFieldOwnProps &
    (
        | { isSkeleton: true; value?: string; onValueChange?: (value: string) => void }
        | { isSkeleton?: false; value: string; onValueChange: (value: string) => void }
    )
