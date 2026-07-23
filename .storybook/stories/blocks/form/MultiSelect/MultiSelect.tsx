import React, { useId, useState } from "react"
import {
    ComboBox as HeroMultiSelect,
    Input,
    ListBox,
    ListBoxItem,
    Typography,
} from "@heroui/react"
import { FieldShell } from "../FieldShell/FieldShell"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { StatusChip } from "../../chips/StatusChip/StatusChip"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — searchable multi-select. Authored in Storybook
 * (not `src`); synced to `src` later. No `@/components` import — self-contained.
 *
 * MultiSelect composes {@link FieldShell} (label / hint / error / skeleton
 * column, canon §4/§8) with HeroUI's `ComboBox` (aliased `HeroMultiSelect` —
 * the wrapper name collides with the export). The consumer passes a bare
 * `value: string[]` + `onValueChange` (canon §4 Ownership) — never structure.
 *
 * NOTE — true multi-selection assumption: HeroUI's typed `ComboBox` compound
 * (`ComboBoxRoot<T>` in `@heroui/react`'s `combo-box.d.ts`) fixes the
 * underlying `react-aria-components` `ComboBox<T, M>` generic to the default
 * `M = "single"` — it never surfaces the primitive's `selectionMode:
 * "multiple"` in its public prop types. So a *type-safe* multi-select can't
 * drive HeroUI's ComboBox in native multi-selection mode. Instead this
 * composes the SAME free-text single-pick anatomy as `SearchAutocomplete`
 * (`ComboBox.InputGroup` + `Input` + `ComboBox.Popover` > `ListBox`) and
 * layers multi-selection OURSELVES: picking a row appends its id to the
 * external `value` array (filtering it out of the dropdown so it can't be
 * picked twice) and clears the search text; each pick renders as a removable
 * {@link StatusChip} above the field.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One selectable option in a {@link MultiSelect} dropdown. */
export interface MultiSelectOption {
    /** Stable id — the value stored in the controlled `value` array. */
    id: string
    /** Primary label shown on the option row and on its chosen chip. */
    label: string
    /** Optional secondary line, rendered small and muted below the label. */
    description?: string
}

/** Props for {@link MultiSelect}. */
export interface MultiSelectProps {
    /** Label rendered above the field (`text-sm font-medium`). */
    label?: React.ReactNode
    /** Hint under the label (`text-xs text-muted`). */
    description?: React.ReactNode
    /**
     * Error line under the field (`text-sm text-danger-soft-foreground`). When
     * present the field is rendered invalid (HeroUI `isInvalid`).
     */
    errorMessage?: React.ReactNode
    /** The full option list to search/pick from. */
    options: Array<MultiSelectOption>
    /** Currently chosen option ids (controlled). */
    value: Array<string>
    /** Fires with the new id array whenever a chip is picked or removed. */
    onValueChange: (value: Array<string>) => void
    /** Placeholder inside the empty search field. */
    placeholder?: string
    /** Message shown when every option has already been picked. Defaults to "Không còn lựa chọn nào". */
    emptyLabel?: string
    /** Disables the field (search input + existing chips' remove buttons). */
    isDisabled?: boolean
    /** Renders the loading mirror — label bar + field-box skeleton (canon §8). */
    isSkeleton?: boolean
    /** Extra classes on the outer column. */
    className?: string
}

/**
 * MultiSelect is a searchable multi-select field wrapped in {@link FieldShell}
 * so its label, hint, error, and loading skeleton all come for free. It reuses
 * the {@link StatusChip} removable-chip pattern to show the chosen options and
 * a HeroUI `ComboBox` (see the module NOTE above) to search + add more.
 *
 * @param props - {@link MultiSelectProps}
 */
export const MultiSelect = ({
    label,
    description,
    errorMessage,
    options,
    value,
    onValueChange,
    placeholder = "Tìm và chọn...",
    emptyLabel = "Không còn lựa chọn nào",
    isDisabled,
    isSkeleton,
    className,
}: MultiSelectProps) => {
    // one id shared by the FieldShell label (htmlFor) and the search Input (focus wiring)
    const id = useId()
    const isInvalid = errorMessage != null

    // the ComboBox's own typed text — cleared right after a pick so the field
    // is always ready to search for the NEXT option
    const [query, setQuery] = useState("")

    const chosen = options.filter((option) => value.includes(option.id))
    // already-chosen rows are removed from the pickable list — a picked option
    // can't be picked twice
    const pickable = options.filter((option) => !value.includes(option.id))

    const onPick = (key: React.Key | null) => {
        if (key === null) {
            return
        }
        const nextId = String(key)
        if (!value.includes(nextId)) {
            onValueChange([...value, nextId])
        }
        setQuery("")
    }

    const onRemove = (removedId: string) => {
        onValueChange(value.filter((existingId) => existingId !== removedId))
    }

    return (
        <FieldShell
            label={label}
            description={description}
            errorMessage={errorMessage}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            skeletonControl={<Skeleton.Select />}
            id={id}
            className={className}
        >
            <div className="flex flex-col gap-2">
                {chosen.length > 0 ? (
                    <div className="flex flex-wrap gap-2" role="list" aria-label={typeof label === "string" ? label : undefined}>
                        {chosen.map((option) => (
                            <StatusChip
                                key={option.id}
                                onCancel={isDisabled ? undefined : () => onRemove(option.id)}
                                cancelLabel={`Bỏ chọn ${option.label}`}
                            >
                                {option.label}
                            </StatusChip>
                        ))}
                    </div>
                ) : null}

                {/* HeroUI ComboBox owns invalid/disabled state; Input is the search box. */}
                <HeroMultiSelect
                    aria-label={typeof label === "string" ? label : placeholder}
                    className="w-full"
                    variant="secondary"
                    fullWidth
                    allowsEmptyCollection
                    items={pickable}
                    inputValue={query}
                    onInputChange={setQuery}
                    onSelectionChange={onPick}
                    isDisabled={isDisabled}
                    isInvalid={isInvalid}
                >
                    <HeroMultiSelect.InputGroup className="relative">
                        <Input
                            id={id}
                            placeholder={placeholder}
                            className="w-full"
                        />
                    </HeroMultiSelect.InputGroup>
                    <HeroMultiSelect.Popover>
                        <ListBox
                            items={pickable}
                            className="max-h-72 overflow-auto p-1"
                            renderEmptyState={() => (
                                <div className="px-3 py-6 text-center">
                                    <Typography type="body-sm" color="muted">
                                        {emptyLabel}
                                    </Typography>
                                </div>
                            )}
                        >
                            {(option: MultiSelectOption) => (
                                <ListBoxItem
                                    id={option.id}
                                    textValue={option.label}
                                    className="flex flex-col items-start"
                                >
                                    <Typography type="body-sm">{option.label}</Typography>
                                    {option.description ? (
                                        <Typography type="body-xs" color="muted">
                                            {option.description}
                                        </Typography>
                                    ) : null}
                                </ListBoxItem>
                            )}
                        </ListBox>
                    </HeroMultiSelect.Popover>
                </HeroMultiSelect>
            </div>
        </FieldShell>
    )
}
