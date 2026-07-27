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
import { SKELETON_TEXT_BAR } from "@sb-components/atoms/_skeleton-bar"
import { FieldFrame } from "@sb-components/atoms/forms/_field/FieldFrame"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Choice.*`: the boolean / single-select control atom namespace (wraps
 * HeroUI Checkbox · Radio · RadioGroup · Switch).
 *
 * These are INLINE controls — the label sits BESIDE the control (Checkbox.Content /
 * Radio.Content owns the native label; Switch's label = sibling `<Label>` per house note).
 * It's a BARE field (no group heading / hint / error) — the atom field (FieldShell)
 * COMPOSES this atom to add a group label / description / error.
 *
 * Shared rules (Chip/Input):
 *   • Wrap HeroUI to the MAX (Checkbox/RadioGroup/Radio/Switch), alias `Hero*`.
 *   • STRICT §4: `isSelected|value` + `onValueChange` BARE — the consumer doesn't touch
 *     structure (no manual Checkbox.Control/Indicator/Content).
 *   • NO `children` (rule decided 2026-07-25): the control doesn't wrap any element
 *     so the label goes via the `label` prop; a radio group is described via `options` DATA.
 *   • `isSkeleton` → control-shaped skeleton co-located (hybrid C, `HeroSkeleton`
 *     sized to the control — NO importing the `Skeleton.*` compound).
 *   • Anatomy tier `atom` (part `Control` · `Label`; loading state = `Skeleton`).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Extra field-frame props INLINE controls take (decided 2026-07-25): `hint` +
 * `errorMessage` render via FieldFrame around the control (the main label stays
 * INLINE next to the control — NOT passed into FieldFrame's `label`). `isRequired`
 * attaches a `*` mark to the inline label. Leave them all off → the control stays
 * bare as before (FieldFrame renders children straight through).
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
    className?: string
}

/** `Choice.Checkbox` — single boolean checkbox with an inline label (HeroUI Checkbox compound). */
const ChoiceCheckbox = ({ isSelected, onValueChange, label, isDisabled, isInvalid, isSkeleton, showAnatomy, className, hint, errorMessage, isRequired }: ChoiceCheckboxProps) => {
    const invalid = isInvalid || errorMessage != null
    // Control = size-4 rounded-md · label = body-sm glyph bar (14/24), row gap-3 (matches Checkbox.Content gap).
    const skeletonControl = (
        <div className={cn("flex items-center gap-3", className)} data-anat-part={showAnatomy ? "Skeleton" : undefined}>
            <HeroSkeleton className="size-4 shrink-0 rounded-md" />
            <HeroSkeleton className={cn(SKELETON_TEXT_BAR, "w-32")} />
        </div>
    )
    return (
        <FieldFrame.Base hint={hint} errorMessage={errorMessage} isDisabled={isDisabled} isSkeleton={isSkeleton} showAnatomy={showAnatomy} skeletonControl={skeletonControl}>
            <HeroCheckbox isSelected={isSelected} onChange={onValueChange} isInvalid={invalid} isDisabled={isDisabled} className={className}>
                <HeroCheckbox.Control data-anat-part={showAnatomy ? "Control" : undefined}>
                    <HeroCheckbox.Indicator />
                </HeroCheckbox.Control>
                <HeroCheckbox.Content data-anat-part={showAnatomy ? "Label" : undefined}>{withRequired(label, isRequired)}</HeroCheckbox.Content>
            </HeroCheckbox>
        </FieldFrame.Base>
    )
}

/* ── Radio ─────────────────────────────────────────────────────────────────── */

/**
 * Props for {@link ChoiceRadio} — ONE option row; must live inside a
 * {@link ChoiceRadioGroup}.
 *
 * ⚠️ NO `hint`/`errorMessage`/`isRequired` (decided 2026-07-25): a lone radio
 * can't stand on its own — description · error · required are the GROUP's
 * business, so those 3 props live on {@link ChoiceRadioGroup}.
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
    /** `true` → tag `Control` · `Label` for BlockAnatomy. */
    showAnatomy?: boolean
    className?: string
}

/** `Choice.Radio` — one radio option row (HeroUI Radio compound). Renders inside `Choice.RadioGroup`. */
const ChoiceRadio = ({ value, label, isDisabled, isSkeleton, showAnatomy, className }: ChoiceRadioProps) => {
    if (isSkeleton) {
        // One row: size-4 rounded-full dot + body-sm label bar, gap-3 (co-located, hybrid C).
        return (
            <div className={cn("flex items-center gap-3", className)} data-anat-part={showAnatomy ? "Skeleton" : undefined}>
                <HeroSkeleton className="size-4 shrink-0 rounded-full" />
                <HeroSkeleton className={cn(SKELETON_TEXT_BAR, "w-32")} />
            </div>
        )
    }
    return (
        <HeroRadio value={value} isDisabled={isDisabled} className={className}>
            <HeroRadio.Content>
                <HeroRadio.Control data-anat-part={showAnatomy ? "Control" : undefined}>
                    <HeroRadio.Indicator />
                </HeroRadio.Control>
                <span className="min-w-0" data-anat-part={showAnatomy ? "Label" : undefined}>
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
     * List of options as DATA — the atom builds one {@link ChoiceRadio} per
     * entry. NO `children`: the consumer doesn't attach child JSX (§4 STRICT).
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
    /** `true` → tag each option's `Control` · `Label` for BlockAnatomy. */
    showAnatomy?: boolean
    className?: string
}

/** `Choice.RadioGroup` — mutually-exclusive single-select group (HeroUI RadioGroup + `Choice.Radio` rows). */
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
    hint,
    errorMessage,
    isRequired,
}: ChoiceRadioGroupProps) => {
    const invalid = isInvalid || errorMessage != null
    const rows = skeletonRows ?? options.length
    // Each row: size-4 rounded-full dot + body-sm label bar, gap-3; group stacks gap-2.
    const skeletonControl = (
        <div className={cn("flex flex-col gap-2", className)} data-anat-part={showAnatomy ? "Skeleton" : undefined}>
            {Array.from({ length: rows }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                    <HeroSkeleton className="size-4 shrink-0 rounded-full" />
                    <HeroSkeleton className={cn(SKELETON_TEXT_BAR, "w-32")} />
                </div>
            ))}
        </div>
    )
    return (
        <FieldFrame.Base
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
                className={cn("flex flex-col gap-2", className)}
            >
                {options.map((option) => (
                    <ChoiceRadio key={option.value} value={option.value} label={option.label} isDisabled={option.isDisabled} showAnatomy={showAnatomy} />
                ))}
            </HeroRadioGroup>
        </FieldFrame.Base>
    )
}

/* ── Switch ────────────────────────────────────────────────────────────────── */

/** Props for {@link ChoiceSwitch}. */
export interface ChoiceSwitchProps extends InlineFrameProps {
    /**
     * Anatomy tag for THIS control itself — so the PARENT can badge it as ONE node (§11a.1).
     * Without this prop the parent is forced to pass `showAnatomy` down, i.e. OPEN UP the child's insides.
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
    /** `true` → tag `Control` · `Label` for BlockAnatomy. */
    showAnatomy?: boolean
    className?: string
}

/** `Choice.Switch` — boolean toggle with the label BESIDE the track (HeroUI Switch compound). */
const ChoiceSwitch = ({ isSelected, onValueChange, label, isDisabled, isInvalid, size, isSkeleton, showAnatomy, anatPart, className, hint, errorMessage, isRequired }: ChoiceSwitchProps) => {
    const invalid = isInvalid || errorMessage != null
    // Track = h-9 w-16 pill (app override) · optional label bar (body-sm).
    const skeletonControl = (
        <div className={cn("flex items-center gap-3", className)} data-anat-part={anatPart ?? (showAnatomy ? "Skeleton" : undefined)}>
            <HeroSkeleton className="h-9 w-16 shrink-0 rounded-full" />
            {label != null ? <HeroSkeleton className={cn(SKELETON_TEXT_BAR, "w-32")} /> : null}
        </div>
    )
    return (
        <FieldFrame.Base hint={hint} errorMessage={errorMessage} isDisabled={isDisabled} isSkeleton={isSkeleton} showAnatomy={showAnatomy} skeletonControl={skeletonControl}>
            <div data-anat-part={anatPart} className={cn("flex items-center gap-3", className)}>
                <HeroSwitch
                    data-anat-part={showAnatomy ? "Control" : undefined}
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
        </FieldFrame.Base>
    )
}

/**
 * `Choice.*` — boolean / single-select control atom namespace. Each member is the
 * bare inline control; atom fields (FieldShell) compose them for the group
 * heading / hint / error column.
 *
 * §12a: declared via `Object.assign` like the other 42 atoms (NOT a bare object
 * literal) — the root must be a callable namespace. Calling the root directly =
 * `Choice.Checkbox`, the most basic shape of the family (same approach as
 * `Select` taking `Select.Single` as its root). Every member's API STAYS THE
 * SAME, only the export SHAPE changes.
 */
export const Choice = Object.assign(ChoiceCheckbox, {
    Checkbox: ChoiceCheckbox,
    Radio: ChoiceRadio,
    RadioGroup: ChoiceRadioGroup,
    Switch: ChoiceSwitch,
})
