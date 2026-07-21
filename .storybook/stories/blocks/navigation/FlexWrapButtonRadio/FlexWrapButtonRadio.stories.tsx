import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { DotsThreeVerticalIcon, TrashIcon } from "@phosphor-icons/react"
import { FlexWrapButtonRadio, type FlexWrapButtonRadioItem } from "./FlexWrapButtonRadio"

const meta: Meta<typeof FlexWrapButtonRadio> = {
    title: "Primitives/Navigation/FlexWrapButtonRadio",
    component: FlexWrapButtonRadio,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof FlexWrapButtonRadio>

const DIFFICULTY_ITEMS: Array<FlexWrapButtonRadioItem<string>> = [
    { value: "easy", content: "Easy" },
    { value: "medium", content: "Medium" },
    { value: "hard", content: "Hard" },
    { value: "expert", content: "Expert" },
]

const ATTEMPT_ITEMS: Array<FlexWrapButtonRadioItem<string>> = [
    { value: "attempt-1", content: "Attempt 1 · 6/10" },
    { value: "attempt-2", content: "Attempt 2 · 8/10" },
    { value: "attempt-3", content: "Attempt 3 · 9/10" },
]

const TIER_ITEMS: Array<FlexWrapButtonRadioItem<string>> = [
    { value: "free", content: "Free" },
    { value: "economy", content: "Economy" },
    { value: "balanced", content: "Balanced" },
    { value: "premium", content: "Premium", isDisabled: true },
]

const LANGUAGE_ITEMS: Array<FlexWrapButtonRadioItem<string>> = [
    { value: "typescript", content: "TypeScript" },
    { value: "java", content: "Java" },
    { value: "csharp", content: "C#" },
    { value: "go", content: "Go" },
]

/** Owns single-select state so the story is interactive (the block is fully controlled). */
const Controlled = <T extends string>(props: {
    items: Array<FlexWrapButtonRadioItem<T>>
    initialValue: T
    ariaLabel: string
    trailing?: ReactNode
    itemAction?: (item: FlexWrapButtonRadioItem<T>) => ReactNode
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

/** Owns a SET of values and enforces "keep at least one selected" (deselecting the last is a no-op). */
const ControlledMulti = <T extends string>(props: {
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

/** Single-select (default): selected = filled `tertiary`, unselected = hollow `ghost`. */
export const SingleSelect: Story = {
    render: () => (
        <div className="p-8">
            <Controlled items={DIFFICULTY_ITEMS} initialValue="medium" ariaLabel="Select difficulty" />
        </div>
    ),
}

/** Multi-select: `multiple` + `values` + `onToggle`, each button an independent toggle. */
export const MultiSelect: Story = {
    render: () => (
        <div className="p-8">
            <ControlledMulti items={LANGUAGE_ITEMS} initialValues={["typescript"]} ariaLabel="Select languages" />
        </div>
    ),
}

/** A locked option stays visible but non-interactive (`isDisabled`). */
export const WithDisabled: Story = {
    render: () => (
        <div className="p-8">
            <Controlled items={TIER_ITEMS} initialValue="economy" ariaLabel="Select plan" />
        </div>
    ),
}

/** `trailing`: an extra non-option button on the same row (e.g. a "+N" overflow). */
export const WithTrailing: Story = {
    render: () => (
        <div className="p-8">
            <Controlled
                items={DIFFICULTY_ITEMS.slice(0, 3)}
                initialValue="easy"
                ariaLabel="Select difficulty"
                trailing={<Button size="sm" variant="ghost">+2</Button>}
            />
        </div>
    ),
}

/** `itemAction`: each item becomes a connected group `[select | 🗑 | ⋮]`; actions never change selection. */
export const WithItemAction: Story = {
    render: () => (
        <div className="p-8">
            <Controlled
                items={ATTEMPT_ITEMS}
                initialValue="attempt-1"
                ariaLabel="Select attempt"
                itemAction={(item) => [
                    <Button key="delete" size="sm" variant="tertiary" isIconOnly aria-label={`Delete ${item.value}`}>
                        <TrashIcon className="size-4" />
                    </Button>,
                    <Button key="more" size="sm" variant="tertiary" isIconOnly aria-label={`More options for ${item.value}`}>
                        <DotsThreeVerticalIcon className="size-4" />
                    </Button>,
                ]}
            />
        </div>
    ),
}
