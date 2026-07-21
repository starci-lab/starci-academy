import React, { useState } from "react"
import { FlexWrapButtonRadio, type FlexWrapButtonRadioItem } from "@/components/blocks/navigation/FlexWrapButtonRadio"

/** Difficulty-picker items — mirrors a real config-row caller (plain text content). */
export const DIFFICULTY_ITEMS: Array<FlexWrapButtonRadioItem<string>> = [
    { value: "easy", content: "Easy" },
    { value: "medium", content: "Medium" },
    { value: "hard", content: "Hard" },
    { value: "expert", content: "Expert" },
]

/** Attempt-picker items — realistic candidate for `itemAction`. */
export const ATTEMPT_ITEMS: Array<FlexWrapButtonRadioItem<string>> = [
    { value: "attempt-1", content: "Attempt 1 · 6/10" },
    { value: "attempt-2", content: "Attempt 2 · 8/10" },
    { value: "attempt-3", content: "Attempt 3 · 9/10" },
]

/** Items including one disabled option (locked tier). */
export const TIER_ITEMS: Array<FlexWrapButtonRadioItem<string>> = [
    { value: "free", content: "Free" },
    { value: "economy", content: "Economy" },
    { value: "balanced", content: "Balanced" },
    { value: "premium", content: "Premium", isDisabled: true },
]

/** Language-picker items — mirrors the Mock Interview setup's multi-select caller. */
export const LANGUAGE_ITEMS: Array<FlexWrapButtonRadioItem<string>> = [
    { value: "typescript", content: "TypeScript" },
    { value: "java", content: "Java" },
    { value: "csharp", content: "C#" },
    { value: "go", content: "Go" },
]

/**
 * Wrapper that owns selection state so the story is truly interactive in the
 * Storybook canvas (the block itself is fully controlled — `value`/`onChange`).
 */
export const Controlled = <T extends string>(props: {
    items: Array<FlexWrapButtonRadioItem<T>>
    initialValue: T
    ariaLabel: string
    trailing?: React.ReactNode
    itemAction?: (item: FlexWrapButtonRadioItem<T>) => React.ReactNode
}) => {
    const [value, setValue] = useState<T>(props.initialValue)
    return (
        <FlexWrapButtonRadio
            items={props.items}
            value={value}
            onChange={setValue}
            ariaLabel={props.ariaLabel}
            trailing={props.trailing}
            itemAction={props.itemAction}
        />
    )
}

/**
 * Multi-select variant — owns a SET of selected values and enforces "keep at least
 * one selected" (deselecting the last one is a no-op), exactly like the Mock
 * Interview setup's language picker that this mode was built for.
 */
export const ControlledMulti = <T extends string>(props: {
    items: Array<FlexWrapButtonRadioItem<T>>
    initialValues: Array<T>
    ariaLabel: string
}) => {
    const [values, setValues] = useState<Array<T>>(props.initialValues)
    const toggle = (value: T): void => {
        setValues((previous) => {
            if (previous.includes(value)) {
                return previous.length === 1 ? previous : previous.filter((entry) => entry !== value)
            }
            return [...previous, value]
        })
    }
    return (
        <FlexWrapButtonRadio
            multiple
            items={props.items}
            values={values}
            onToggle={toggle}
            ariaLabel={props.ariaLabel}
        />
    )
}
