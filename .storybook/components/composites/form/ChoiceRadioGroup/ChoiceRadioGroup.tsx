import { RadioGroup as HeroRadioGroup, cn } from "@heroui/react"
import { ChoiceRadio, type InlineFrameProps } from "@sb-components/atoms/forms/Choice/Choice"
import { FieldFrame } from "@sb-components/atoms/forms/_field/FieldFrame"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * `ChoiceRadioGroup` — a mutually-exclusive pick-one row, built from `options` DATA.
 * It renders one `ChoiceRadio` per entry and adds the group's layout,
 * heading/hint/error frame, and row count; `ChoiceRadio` itself owns each row's
 * checked/skeleton state.
 *
 * `HeroRadioGroup` is the one vendor import kept here: a bare HeroUI `Radio` reads
 * its selection/name context from the surrounding `RadioGroup`, so `ChoiceRadio`
 * cannot form a mutually-exclusive set without it, and no house atom wraps that
 * context alone today. This is the same documented exception
 * `composites/buttons/ButtonRadioGroup` takes with raw HeroUI `Button`.
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
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "ChoiceRadioGroup" } as const

/** `ChoiceRadioGroup` — mutually-exclusive single-select group (HeroUI RadioGroup + `ChoiceRadio` rows). */
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
    classNames,
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

            skeletonControl={
                // COMPOSITE-10: the composite only decides HOW MANY rows shimmer — each row
                // draws its own shimmer via `ChoiceRadio`'s own `isSkeleton` branch, the same
                // shape ButtonGroup/ChipGroup delegate to `Button`/`Chip` while loading.
                <div data-principles="sibling-stack" className={cn("flex flex-col gap-2", classNames)}>
                    {Array.from({ length: rows }, (_, index) => (
                        <ChoiceRadio key={index} value={String(index)} label="" isSkeleton />
                    ))}
                </div>
            }
        >
            <HeroRadioGroup
                aria-label={groupLabel ?? ariaLabel}
                value={value}
                onChange={onValueChange}
                isInvalid={invalid}
                isDisabled={isDisabled}
                data-principles="sibling-stack"
                className={cn("flex flex-col gap-2", classNames)}
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
            </HeroRadioGroup>
        </FieldFrame>
    )
}
