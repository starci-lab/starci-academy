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
