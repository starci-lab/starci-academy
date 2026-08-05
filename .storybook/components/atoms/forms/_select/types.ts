import type { ReactNode } from "react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

interface FrameProps {
    /** Label above the control. */
    label?: ReactNode
    /** Description below the label (always visible). */
    hint?: ReactNode
    /** Error line below the control (set it to show an error border). */
    errorMessage?: ReactNode
    /** Adds a required `*` mark. */
    isRequired?: boolean
}

/** One selectable option — `value` is the payload, `label` is the rendered text. */
export interface SelectOption {
    /** Option value — what `onValueChange` fires and the React key. */
    value: string
    /** Displayed label (in the trigger when selected, and in the list row). */
    label: ReactNode
}

/** Props for the trigger-box shimmer owned by select atoms. */
export interface TriggerSkeletonProps {
    /** Where this sits inside its parent. Everything about appearance is a prop of its own. */
    classNames?: Array<AllowedClassName>
}

/** Shared props across the select members. */
export interface BaseSelectProps extends FrameProps {
    /** Flat list of options to choose from. */
    options: Array<SelectOption>
    /** Placeholder shown when nothing is selected. */
    placeholder?: string
    /** Disables the control. */
    isDisabled?: boolean
    /** Field invalid (error border) — `errorMessage` also triggers the border via FieldFrame. */
    isInvalid?: boolean
    /** Accessible name used when there's no `label` (otherwise the label handles it). */
    ariaLabel?: string
    /** Renders the trigger-box skeleton instead of the control. */
    isSkeleton?: boolean
    /** Where this sits inside its parent. Everything about appearance is a prop of its own. */
    classNames?: Array<AllowedClassName>
}
