import type { ReactNode } from "react"
import {
    Checkbox as HeroCheckbox,
    Radio as HeroRadio,
    Switch as HeroSwitch,
    Label as HeroLabel,
    Skeleton as HeroSkeleton,
    cn,
} from "@heroui/react"
import { CheckIcon, MinusIcon } from "@phosphor-icons/react"
import { SKELETON_TEXT_BAR } from "@sb-components/atoms/_skeleton-bar"
import { FieldFrame } from "@sb-components/atoms/forms/_field/FieldFrame"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * `Choice.*` — the boolean / single-select control atom namespace (wraps
 * HeroUI Checkbox · Radio · Switch).
 *
 * These are inline controls: the label sits beside the control (Checkbox.Content /
 * Radio.Content own the native label; Switch's label is a sibling `<Label>`). Each
 * is a bare field with no group heading, hint, or error — `FieldShell` composes
 * this atom to add those.
 *
 * There is no `children` prop: the label goes via the `label` prop. `isSkeleton`
 * renders a control-shaped skeleton sized to match, without importing the
 * `Skeleton.*` compound.
 *
 * `ChoiceRadio` is one option row and stops here — the group that rebuilds one
 * `ChoiceRadio` per entry moved to `composites/form/ChoiceRadioGroup` (ATOM-8:
 * rendering another house atom once per item is the composite signal, not the
 * atom one).
 */

/**
 * Extra field-frame props inline controls take: `hint` and `errorMessage` render
 * via FieldFrame around the control (the main label stays inline next to the
 * control, not passed into FieldFrame's `label`). `isRequired` attaches a `*`
 * mark to the inline label. Leave them all off and the control renders bare.
 *
 * Exported so `composites/form/ChoiceRadioGroup` can extend the same shape for
 * its own group-level hint/error/required — it moved out of this file (ATOM-8)
 * but still carries the same frame.
 */
export interface InlineFrameProps {
    /** Secondary description (via FieldFrame). */
    hint?: ReactNode
    /** Error line (via FieldFrame → border + text-danger). */
    errorMessage?: ReactNode
    /** Adds a `*` mark to the inline label. */
    isRequired?: boolean
}

/** Inline label + `*` mark when required (matches FieldFrame). */
const withRequired = (label: ReactNode, isRequired?: boolean) =>
    isRequired ? (
        <>
            {label} <span className="text-danger">*</span>
        </>
    ) : (
        label
    )

/* ── Checkbox ──────────────────────────────────────────────────────────────── */

/** Props for {@link ChoiceCheckbox}. */
export interface ChoiceCheckboxProps extends InlineFrameProps {
    /** Checked state (controlled). */
    isSelected: boolean
    /** Fires with the new checked state. */
    onValueChange: (value: boolean) => void
    /** Label sits BESIDE the box (Checkbox.Content). */
    label: ReactNode
    isDisabled?: boolean
    isInvalid?: boolean
    /** Render the control-shaped skeleton (square + label bar) instead of the checkbox. */
    isSkeleton?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/** `ChoiceCheckbox` — single boolean checkbox with an inline label (HeroUI Checkbox compound). */
const ChoiceCheckbox = ({ isSelected, onValueChange, label, isDisabled, isInvalid, isSkeleton, classNames, hint, errorMessage, isRequired }: ChoiceCheckboxProps) => {
    const invalid = isInvalid || errorMessage != null
    // Control = size-4 rounded-md · label = body-sm glyph bar (14/24), row gap-3 (matches Checkbox.Content gap).
    const skeletonControl = (
        <div data-tier="atom" data-component="ChoiceCheckbox" className={cn("flex items-center gap-3", classNames)}>
            <HeroSkeleton className="size-4 shrink-0 rounded-md" />
            <HeroSkeleton className={cn(SKELETON_TEXT_BAR, "w-1/2")} />
        </div>
    )
    return (
        <FieldFrame hint={hint} errorMessage={errorMessage} isDisabled={isDisabled} isSkeleton={isSkeleton} skeletonControl={skeletonControl}>
            <HeroCheckbox data-tier="atom" data-component="ChoiceCheckbox" isSelected={isSelected} onChange={onValueChange} isInvalid={invalid} isDisabled={isDisabled} className={cn(classNames)}>
                <HeroCheckbox.Control>
                    {/* HeroUI renders a different icon for selected vs indeterminate when this
                        slot is left empty. The override must stay a function — passing a plain
                        node here makes indeterminate render the check icon too, with no
                        compiler or lint error to catch it. */}
                    <HeroCheckbox.Indicator>
                        {({ isIndeterminate }) =>
                            isIndeterminate ? (
                                <MinusIcon weight="bold" aria-hidden focusable="false" />
                            ) : (
                                <CheckIcon weight="bold" aria-hidden focusable="false" />
                            )
                        }
                    </HeroCheckbox.Indicator>
                </HeroCheckbox.Control>
                <HeroCheckbox.Content>{withRequired(label, isRequired)}</HeroCheckbox.Content>
            </HeroCheckbox>
        </FieldFrame>
    )
}

/* ── Radio ─────────────────────────────────────────────────────────────────── */

/**
 * Props for {@link ChoiceRadio} — one option row; must live inside a
 * `ChoiceRadioGroup` (`composites/form/ChoiceRadioGroup`).
 *
 * No `hint`/`errorMessage`/`isRequired`: those describe the group, not a single
 * option, so they live on `ChoiceRadioGroup` instead.
 */
export interface ChoiceRadioProps {
    /** Value reported to the group's `onValueChange` when this option is picked. */
    value: string
    /** Label sits BESIDE the dot (Radio.Content). */
    label: ReactNode
    /** Disable just this option row. */
    isDisabled?: boolean
    /** Render the control-shaped skeleton — one radio-row shimmer (dot + label bar). */
    isSkeleton?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/** `ChoiceRadio` — one radio option row (HeroUI Radio compound). Renders inside `ChoiceRadioGroup`. */
const ChoiceRadio = ({ value, label, isDisabled, isSkeleton, classNames }: ChoiceRadioProps) => {
    if (isSkeleton) {
        // Row: size-4 rounded-full dot + body-sm label bar, gap-3.
        return (
            <div data-tier="atom" data-component="ChoiceRadio" className={cn("flex items-center gap-3", classNames)}>
                <HeroSkeleton className="size-4 shrink-0 rounded-full" />
                <HeroSkeleton className={cn(SKELETON_TEXT_BAR, "w-1/3")} />
            </div>
        )
    }
    return (
        <HeroRadio data-tier="atom" data-component="ChoiceRadio" value={value} isDisabled={isDisabled} className={cn(classNames)}>
            <HeroRadio.Content>
                <HeroRadio.Control>
                    <HeroRadio.Indicator />
                </HeroRadio.Control>
                <span className="min-w-0">
                    {label}
                </span>
            </HeroRadio.Content>
        </HeroRadio>
    )
}

/* ── Switch ────────────────────────────────────────────────────────────────── */

/** Props for {@link ChoiceSwitch}. */
export interface ChoiceSwitchProps extends InlineFrameProps {
    /** On/off state (controlled). */
    isSelected: boolean
    /** Fires with the new on/off state. */
    onValueChange: (value: boolean) => void
    /** Label sits BESIDE the track (sibling `<Label>` — NOT via Switch.Content, per house note). */
    label?: ReactNode
    isDisabled?: boolean
    isInvalid?: boolean
    /** Track size — HeroUI Switch supports sm/md/lg. */
    size?: "sm" | "md" | "lg"
    /** Render the control-shaped skeleton — a switch-track pill (+ label bar). */
    isSkeleton?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/** `ChoiceSwitch` — boolean toggle with the label BESIDE the track (HeroUI Switch compound). */
const ChoiceSwitch = ({ isSelected, onValueChange, label, isDisabled, isInvalid, size, isSkeleton, classNames, hint, errorMessage, isRequired }: ChoiceSwitchProps) => {
    const invalid = isInvalid || errorMessage != null
    // Track = h-9 w-16 pill (overrides HeroUI's default size) · optional label bar (body-sm).
    const skeletonControl = (
        <div data-tier="atom" data-component="ChoiceSwitch" className={cn("flex items-center gap-3", classNames)}>
            <HeroSkeleton className="h-9 w-16 shrink-0 rounded-full" />
            {label != null ? <HeroSkeleton className={cn(SKELETON_TEXT_BAR, "w-1/2")} /> : null}
        </div>
    )
    return (
        <FieldFrame hint={hint} errorMessage={errorMessage} isDisabled={isDisabled} isSkeleton={isSkeleton} skeletonControl={skeletonControl}>
            <div data-tier="atom" data-component="ChoiceSwitch" className={cn("flex items-center gap-3", classNames)}>
                <HeroSwitch

                    size={size}
                    isSelected={isSelected}
                    onChange={onValueChange}
                    isDisabled={isDisabled}
                    isInvalid={invalid}
                    aria-label={typeof label === "string" ? label : undefined}
                >
                    <HeroSwitch.Content>
                        <HeroSwitch.Control>
                            <HeroSwitch.Thumb />
                        </HeroSwitch.Control>
                    </HeroSwitch.Content>
                </HeroSwitch>
                {label != null ? (
                    <HeroLabel isDisabled={isDisabled} className="text-sm font-medium">
                        {withRequired(label, isRequired)}
                    </HeroLabel>
                ) : null}
            </div>
        </FieldFrame>
    )
}

/**
 * `Choice.*` — boolean / single-select control atom namespace. Each member is a
 * bare inline control; atom fields (FieldShell) compose them for the group
 * heading, hint, and error column. `ChoiceRadioGroup` is not a member here
 * anymore — it moved to `composites/form/ChoiceRadioGroup` (ATOM-8).
 */
export { ChoiceCheckbox, ChoiceRadio, ChoiceSwitch }

export const meta = [
    { tier: "atom", name: "ChoiceCheckbox" },
    { tier: "atom", name: "ChoiceRadio" },
    { tier: "atom", name: "ChoiceSwitch" },
] as const
