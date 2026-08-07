import type { ComponentType } from "react"
import { cn } from "@heroui/react"
import { ChoiceRadio, type InlineFrameProps } from "@/components/atoms/forms"
import { RadioGroup } from "@/components/atoms/forms/RadioGroup"
import { FieldFrame } from "@/components/composites/form/_field/FieldFrame"

/**
 * `ChoiceRadioGroup` — a radio group that rebuilds the house `ChoiceRadio` atom once per
 * `options` entry. `ChoiceRadio` takes no name-prop of its own, so the composite badges the
 * wrapping `<span>` around each one to link the dep to `ChoiceRadio`'s story. The internal
 * `FieldFrame`'s `Label` (heroui) shows only when `groupLabel` is passed.
 */

/** One selectable option for {@link ChoiceRadioGroup}'s `options` shorthand. */
export interface ChoiceRadioOption {
    value: string
    /** `string`, not `ReactNode` — a repeated item's text field, the same trap one level in (COMPOSITE-8). */
    label: string
    isDisabled?: boolean
}

/** Props for {@link ChoiceRadioGroup}. */
export interface ChoiceRadioGroupProps extends InlineFrameProps {
    /** Currently selected value (controlled). */
    value: string
    /** Fires with the newly selected option's value. */
    onValueChange: (value: string) => void
    /**
     * List of options as data — the composite builds one {@link ChoiceRadio} per
     * entry; there is no `children` prop for attaching JSX directly.
     */
    options: Array<ChoiceRadioOption>
    /**
     * Heading label ABOVE the group (maps to FieldFrame's `label`) — leave blank
     * → `ariaLabel` only. `string`, not `ReactNode` — the composite must be able
     * to build it (and reuse it verbatim as the group's accessible name).
     */
    groupLabel?: string
    /** Accessible name for the group (used when there's no visible `groupLabel`). */
    ariaLabel?: string
    isDisabled?: boolean
    isInvalid?: boolean
    /** Render the control-shaped skeleton — stacked radio-row shimmers, one `ChoiceRadio` per row. */
    isSkeleton?: boolean
    /** Row count for the skeleton mirror (default = `options.length`). */
    skeletonRows?: number
}

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "ChoiceRadioGroup" } as const

/**
 * Stable zero-prop skeleton components keyed by row count so ChoiceRadioGroup can
 * pass `skeletonControl={choiceRadioGroupSkeleton(rows)}` without ReactNode while
 * preserving the loaded row count.
 */
const skeletonCache = new Map<number, ComponentType>()

const choiceRadioGroupSkeleton = (rows: number): ComponentType => {
    const count = Math.max(0, rows)
    const cached = skeletonCache.get(count)
    if (cached) return cached

    const ChoiceRadioGroupSkeleton = () => (
        <div data-principle="sibling-stack" className={cn("flex flex-col gap-2")}>
            {Array.from({ length: count }, (_, index) => (
                <ChoiceRadio key={index} value={String(index)} label="" isSkeleton />
            ))}
        </div>
    )
    ChoiceRadioGroupSkeleton.displayName = `ChoiceRadioGroupSkeleton(${count})`
    skeletonCache.set(count, ChoiceRadioGroupSkeleton)
    return ChoiceRadioGroupSkeleton
}

/** `ChoiceRadioGroup` — mutually-exclusive single-select group (house RadioGroup + `ChoiceRadio` rows). */
export const ChoiceRadioGroup = ({
    value,
    onValueChange,
    options,
    groupLabel,
    ariaLabel = "Choice group",
    isDisabled,
    isInvalid,
    isSkeleton,
    skeletonRows,
    hint,
    errorMessage,
    isRequired,
}: ChoiceRadioGroupProps) => {
    const invalid = isInvalid || errorMessage != null
    const rows = skeletonRows ?? options.length
    return (
        <FieldFrame
            label={groupLabel}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            skeletonControl={choiceRadioGroupSkeleton(rows)}
        >
            {/* House `RadioGroup` omits `className` — stack layout rides a plain wrapper. */}
            <div data-principle="sibling-stack" className={cn("flex flex-col gap-2")}>
                <RadioGroup
                    aria-label={groupLabel ?? ariaLabel}
                    value={value}
                    onChange={onValueChange}
                    isInvalid={invalid}
                    isDisabled={isDisabled}
                >
                    {options.map((option) => (
                        // Deps tree is built from the DOM: `ChoiceRadio` takes no name-prop of its
                        // own (ATOM-10 — an atom writes its own name, never a caller's), so the
                        // composite badges the wrapper instead — the same technique `AvatarGroup`
                        // uses to name each `Avatar` it rebuilds.
                        <span key={option.value}>
                            <ChoiceRadio value={option.value} label={option.label} isDisabled={option.isDisabled} />
                        </span>
                    ))}
                </RadioGroup>
            </div>
        </FieldFrame>
    )
}
