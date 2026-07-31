import type { ReactNode } from "react"
import {
    Checkbox as HeroCheckbox,
    RadioGroup as HeroRadioGroup,
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
 * HeroUI Checkbox · Radio · RadioGroup · Switch).
 *
 * These are inline controls: the label sits beside the control (Checkbox.Content /
 * Radio.Content own the native label; Switch's label is a sibling `<Label>`). Each
 * is a bare field with no group heading, hint, or error — `FieldShell` composes
 * this atom to add those.
 *
 * There is no `children` prop: the label goes via the `label` prop, and a radio
 * group is described via `options` data. `isSkeleton` renders a control-shaped
 * skeleton sized to match, without importing the `Skeleton.*` compound. Each
 * composed HeroUI part badges under its own real name (`Checkbox.Control`/
 * `Checkbox.Content`, `Radio.Control`/`Radio.Content`, `Switch`, `Label`) when
 * `showAnatomy` is set.
 */

/**
 * Extra field-frame props inline controls take: `hint` and `errorMessage` render
 * via FieldFrame around the control (the main label stays inline next to the
 * control, not passed into FieldFrame's `label`). `isRequired` attaches a `*`
 * mark to the inline label. Leave them all off and the control renders bare.
 */
interface InlineFrameProps {
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
    /** `true` → tag each part with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    /** @deprecated pass `classNames` instead — a free string cannot be constrained. */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/** `ChoiceCheckbox` — single boolean checkbox with an inline label (HeroUI Checkbox compound). */
const ChoiceCheckbox = ({ isSelected, onValueChange, label, isDisabled, isInvalid, isSkeleton, showAnatomy, className, classNames, hint, errorMessage, isRequired }: ChoiceCheckboxProps) => {
    const invalid = isInvalid || errorMessage != null
    // Control = size-4 rounded-md · label = body-sm glyph bar (14/24), row gap-3 (matches Checkbox.Content gap).
    const skeletonControl = (
        <div className={cn("flex items-center gap-3", className, classNames)} data-anat-part={showAnatomy ? "Skeleton" : undefined}>
            <HeroSkeleton className="size-4 shrink-0 rounded-md" />
            <HeroSkeleton className={cn(SKELETON_TEXT_BAR, "w-1/2")} />
        </div>
    )
    return (
        <FieldFrame hint={hint} errorMessage={errorMessage} isDisabled={isDisabled} isSkeleton={isSkeleton} showAnatomy={showAnatomy} skeletonControl={skeletonControl}>
            <HeroCheckbox isSelected={isSelected} onChange={onValueChange} isInvalid={invalid} isDisabled={isDisabled} className={cn(className, classNames)}>
                {/* data-anat-part uses the real HeroUI component name (`Checkbox.Control`/
                    `Checkbox.Content`), not a generic slot word. */}
                <HeroCheckbox.Control data-anat-part={showAnatomy ? "Checkbox.Control" : undefined}>
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
                <HeroCheckbox.Content data-anat-part={showAnatomy ? "Checkbox.Content" : undefined}>{withRequired(label, isRequired)}</HeroCheckbox.Content>
            </HeroCheckbox>
        </FieldFrame>
    )
}

/* ── Radio ─────────────────────────────────────────────────────────────────── */

/**
 * Props for {@link ChoiceRadio} — one option row; must live inside a
 * {@link ChoiceRadioGroup}.
 *
 * No `hint`/`errorMessage`/`isRequired`: those describe the group, not a single
 * option, so they live on {@link ChoiceRadioGroup} instead.
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
    /** `true` → tag `Radio.Content` · `Radio.Control` for BlockAnatomy. */
    showAnatomy?: boolean
    /** @deprecated pass `classNames` instead — a free string cannot be constrained. */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/** `ChoiceRadio` — one radio option row (HeroUI Radio compound). Renders inside `ChoiceRadioGroup`. */
const ChoiceRadio = ({ value, label, isDisabled, isSkeleton, showAnatomy, className, classNames }: ChoiceRadioProps) => {
    if (isSkeleton) {
        // Row: size-4 rounded-full dot + body-sm label bar, gap-3.
        return (
            <div className={cn("flex items-center gap-3", className, classNames)} data-anat-part={showAnatomy ? "Skeleton" : undefined}>
                <HeroSkeleton className="size-4 shrink-0 rounded-full" />
                <HeroSkeleton className={cn(SKELETON_TEXT_BAR, "w-1/3")} />
            </div>
        )
    }
    return (
        <HeroRadio value={value} isDisabled={isDisabled} className={cn(className, classNames)}>
            {/* data-anat-part uses the real HeroUI component names (`Radio.Content` wraps
                `Radio.Control` + the label span), not generic slot words. */}
            <HeroRadio.Content data-anat-part={showAnatomy ? "Radio.Content" : undefined}>
                <HeroRadio.Control data-anat-part={showAnatomy ? "Radio.Control" : undefined}>
                    <HeroRadio.Indicator />
                </HeroRadio.Control>
                <span className="min-w-0">
                    {label}
                </span>
            </HeroRadio.Content>
        </HeroRadio>
    )
}

/* ── RadioGroup ────────────────────────────────────────────────────────────── */

/** One selectable option for {@link ChoiceRadioGroup}'s `options` shorthand. */
export interface ChoiceRadioOption {
    value: string
    label: ReactNode
    isDisabled?: boolean
}

/** Props for {@link ChoiceRadioGroup}. */
export interface ChoiceRadioGroupProps extends InlineFrameProps {
    /** Currently selected value (controlled). */
    value: string
    /** Fires with the newly selected option's value. */
    onValueChange: (value: string) => void
    /**
     * List of options as data — the atom builds one {@link ChoiceRadio} per
     * entry; there is no `children` prop for attaching JSX directly.
     */
    options: Array<ChoiceRadioOption>
    /** Heading label ABOVE the group (maps to FieldFrame's `label`) — leave blank → `ariaLabel` only. */
    groupLabel?: ReactNode
    /** Accessible name for the group (used when there's no visible `groupLabel`). */
    ariaLabel?: string
    isDisabled?: boolean
    isInvalid?: boolean
    /** Render the control-shaped skeleton — stacked radio-row shimmers. */
    isSkeleton?: boolean
    /** Row count for the skeleton mirror (default = `options.length`). */
    skeletonRows?: number
    /** `true` → tag each option's `Radio.Content` · `Radio.Control` for BlockAnatomy. */
    showAnatomy?: boolean
    /** @deprecated pass `classNames` instead — a free string cannot be constrained. */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/** `ChoiceRadioGroup` — mutually-exclusive single-select group (HeroUI RadioGroup + `ChoiceRadio` rows). */
const ChoiceRadioGroup = ({
    value,
    onValueChange,
    options,
    groupLabel,
    ariaLabel = "Choice group",
    isDisabled,
    isInvalid,
    isSkeleton,
    skeletonRows,
    showAnatomy,
    className,
    classNames,
    hint,
    errorMessage,
    isRequired,
}: ChoiceRadioGroupProps) => {
    const invalid = isInvalid || errorMessage != null
    const rows = skeletonRows ?? options.length
    // Each row: size-4 rounded-full dot + body-sm label bar, gap-3; group stacks gap-2.
    const skeletonControl = (
        <div className={cn("flex flex-col gap-2", className, classNames)} data-anat-part={showAnatomy ? "Skeleton" : undefined}>
            {Array.from({ length: rows }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                    <HeroSkeleton className="size-4 shrink-0 rounded-full" />
                    <HeroSkeleton className={cn(SKELETON_TEXT_BAR, "w-1/3")} />
                </div>
            ))}
        </div>
    )
    return (
        <FieldFrame
            label={groupLabel}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            showAnatomy={showAnatomy}
            skeletonControl={skeletonControl}
        >
            <HeroRadioGroup
                aria-label={typeof groupLabel === "string" ? groupLabel : ariaLabel}
                value={value}
                onChange={onValueChange}
                isInvalid={invalid}
                isDisabled={isDisabled}
                className={cn("flex flex-col gap-2", className, classNames)}
            >
                {options.map((option) => (
                    <ChoiceRadio key={option.value} value={option.value} label={option.label} isDisabled={option.isDisabled} showAnatomy={showAnatomy} />
                ))}
            </HeroRadioGroup>
        </FieldFrame>
    )
}

/* ── Switch ────────────────────────────────────────────────────────────────── */

/** Props for {@link ChoiceSwitch}. */
export interface ChoiceSwitchProps extends InlineFrameProps {
    /**
     * Anatomy tag for this control as a single node, so a parent can badge it
     * without passing `showAnatomy` down into its internals.
     */
    anatPart?: string
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
    /** `true` → tag `Switch` · `Label` for BlockAnatomy. */
    showAnatomy?: boolean
    /** @deprecated pass `classNames` instead — a free string cannot be constrained. */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/** `ChoiceSwitch` — boolean toggle with the label BESIDE the track (HeroUI Switch compound). */
const ChoiceSwitch = ({ isSelected, onValueChange, label, isDisabled, isInvalid, size, isSkeleton, showAnatomy, anatPart, className, classNames, hint, errorMessage, isRequired }: ChoiceSwitchProps) => {
    const invalid = isInvalid || errorMessage != null
    // Track = h-9 w-16 pill (overrides HeroUI's default size) · optional label bar (body-sm).
    const skeletonControl = (
        <div className={cn("flex items-center gap-3", className, classNames)} data-anat-part={anatPart ?? (showAnatomy ? "Skeleton" : undefined)}>
            <HeroSkeleton className="h-9 w-16 shrink-0 rounded-full" />
            {label != null ? <HeroSkeleton className={cn(SKELETON_TEXT_BAR, "w-1/2")} /> : null}
        </div>
    )
    return (
        <FieldFrame hint={hint} errorMessage={errorMessage} isDisabled={isDisabled} isSkeleton={isSkeleton} showAnatomy={showAnatomy} skeletonControl={skeletonControl}>
            <div data-anat-part={anatPart} className={cn("flex items-center gap-3", className, classNames)}>
                <HeroSwitch
                    // data-anat-part uses the real HeroUI component name (`Switch`), not a slot word.
                    data-anat-part={showAnatomy ? "Switch" : undefined}
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
                    <HeroLabel isDisabled={isDisabled} data-anat-part={showAnatomy ? "Label" : undefined} className="text-sm font-medium">
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
 * heading, hint, and error column.
 */
export { ChoiceCheckbox, ChoiceRadio, ChoiceRadioGroup, ChoiceSwitch }
