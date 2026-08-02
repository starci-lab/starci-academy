import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { DotsThreeVerticalIcon, TrashIcon } from "@phosphor-icons/react"
import { ButtonRadioGroup, type ButtonRadioGroupItem } from "@sb-components/composites/buttons/ButtonRadioGroup/ButtonRadioGroup"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"
/**
 * `Button.RadioGroup` — a flex-wrap row of selectable buttons, single- or multi-select.
 * Leaves: `items` builds N child buttons (`Default`, with per-item `isDisabled`); `multiple`
 * allows ≥2 selected at once; `trailing` appends a non-option button (e.g. "+N"); `itemAction`
 * turns each item into a fused `ButtonGroup` [select | delete | more].
 */
const meta: Meta<typeof ButtonRadioGroup> = {
    title: "Composites/Buttons/ButtonRadioGroup",
    component: ButtonRadioGroup,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}
export default meta
type Story = StoryObj<typeof ButtonRadioGroup>
/** heroui TIER (2026-07-27) — the row's own raw HeroUI renders, tagged with the real identifier imported from `@heroui/react`. */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Button": { tier: "heroui", role: "one selectable option — standalone, or the select segment inside a fused ButtonGroup" },
    "ButtonGroup": { tier: "heroui", role: "fuses one item's select button with its itemAction buttons into one connected row" },
    "ButtonGroup.Separator": { tier: "heroui", role: "the seam between the select segment and an action segment" },
}
/**
 * The ONE item set for leaf `Default`, covering every optional shape of
 * `ButtonRadioGroupItem`: `medium` is SELECTED (contrasting with unselected
 * `easy`/`hard`), `expert` is locked (`isDisabled`). One array, full
 * selected × disabled combination.
 */
const DEFAULT_ITEMS: Array<ButtonRadioGroupItem<string>> = [
    { value: "easy", content: "Easy" },
    { value: "medium", content: "Medium" },
    { value: "hard", content: "Hard" },
    { value: "expert", content: "Expert", isDisabled: true },
]
/** Plain item set (no disabled) for leaf `Trailing` — the focus is the extra button, not `items`. */
const DIFFICULTY_ITEMS: Array<ButtonRadioGroupItem<string>> = [
    { value: "easy", content: "Easy" },
    { value: "medium", content: "Medium" },
    { value: "hard", content: "Hard" },
]
/** Item set for leaf `Multiple` — enough to select ≥2 NON-adjacent values. */
const LANGUAGE_ITEMS: Array<ButtonRadioGroupItem<string>> = [
    { value: "typescript", content: "TypeScript" },
    { value: "java", content: "Java" },
    { value: "csharp", content: "C#" },
    { value: "go", content: "Go" },
]
/** Item set for leaf `ItemAction` — each item is one attempt, a natural fit for a delete button + menu. */
const ATTEMPT_ITEMS: Array<ButtonRadioGroupItem<string>> = [
    { value: "attempt-1", content: "Attempt 1 · 6/10" },
    { value: "attempt-2", content: "Attempt 2 · 8/10" },
    { value: "attempt-3", content: "Attempt 3 · 9/10" },
]
/** Owns single-select state so the story is interactive (the atom is fully controlled). */
const Controlled = <T extends string>(props: {
    items: Array<ButtonRadioGroupItem<T>>
    initialValue: T
    ariaLabel: string
    trailing?: ReactNode
    itemAction?: (item: ButtonRadioGroupItem<T>) => ReactNode
}) => {
    const [value, setValue] = useState<T>(props.initialValue)
    return (
        <ButtonRadioGroup
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
    items: Array<ButtonRadioGroupItem<T>>
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
        <ButtonRadioGroup
            multiple
            items={props.items}
            values={values}
            onToggle={toggle}
            ariaLabel={props.ariaLabel}
           
        />
    )
}
/**
 * Leaf prop `items` — the cluster built from DATA; `isDisabled` (an optional
 * field of ONE item) lives RIGHT INSIDE this data set instead of a separate
 * leaf (§12g.2). Selection flows through `Controlled`, so the
 * selected/unselected contrast is already present right here.
 */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Button.RadioGroup"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `items`"
                reason="Every option renders as a real HeroUI button inside a wrapping flex row, wrapping onto a new line instead of ever scrolling. A selected option fills in as a neutral `tertiary` button rather than `primary`, since a config toggle is never the page's one accent call to action, an unselected option stays a hollow `ghost` outline, and a locked option dims while it stays visible and stops accepting presses."
                states={[
                    {
                        name: "value = \"medium\", items include one isDisabled entry",
                        why: "This one items array renders four buttons, with `medium` filled in as the selected option and `expert` dimmed and inert as the disabled option. `isDisabled` is an optional field of a single item rather than a separate axis, so one data set already covers every shape `items` can take without a second leaf.",
                        code: `<Button.RadioGroup
    items={[
        { value: "easy", content: "Easy" },
        { value: "medium", content: "Medium" },
        { value: "hard", content: "Hard" },
        { value: "expert", content: "Expert", isDisabled: true },
    ]}
    value={value}
    onChange={setValue}
    ariaLabel="Select difficulty"
/>`,
                        render: <Controlled items={DEFAULT_ITEMS} initialValue="medium" ariaLabel="Select difficulty" />,
                    },
                ]}
            />
        </div>
    ),
}
/**
 * Leaf prop `multiple` — renders ≥2 values selected AT ONCE, the pixel
 * single-select can never produce (the `value: T` structure only ever
 * matches exactly one item).
 */
export const Multiple: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Button.RadioGroup"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `multiple`"
                reason="Flipping `multiple` turns the group into a set of independent toggles instead of one radio, producing the one pixel signature single-select can never reach: two or more buttons filled at once."
                states={[
                    {
                        name: "multiple, values = [\"typescript\", \"go\"]",
                        why: "TypeScript and Go both render filled and selected at the same time while Java and C# stay hollow, a combination the `value: T` structure of single-select can never produce. The caller owns the whole set through `values`/`onToggle`, this story only enforces \"keep at least one selected\" to show a realistic caller, not a rule the component itself imposes.",
                        code: `<Button.RadioGroup
    multiple
    items={languageItems}
    values={["typescript", "go"]}
    onToggle={toggle}
    ariaLabel="Select languages"
/>`,
                        render: <ControlledMulti items={LANGUAGE_ITEMS} initialValues={["typescript", "go"]} ariaLabel="Select languages" />,
                    },
                ]}
            />
        </div>
    ),
}
/**
 * Leaf prop `trailing` — an extra button that is NOT an option, sitting at
 * the end of the flex-wrap row.
 */
export const Trailing: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Button.RadioGroup"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `trailing`"
                reason="`trailing` is an escape hatch for one non-option action that must sit on the same row as the buttons, for example a `+N` overflow trigger. It is not part of the group's value: the component never treats it as an item, so pressing it never fires `onChange`."
                states={[
                    {
                        name: "trailing != null",
                        why: "An extra `+2` button renders right after the last option, inside the same flex-wrap row, so it wraps together with the buttons instead of floating on a line of its own. It never joins the selectable set, so its press only fires its own handler and leaves the current selection untouched.",
                        code: `<Button.RadioGroup
    items={difficultyItems}
    value={value}
    onChange={setValue}
    ariaLabel="Select difficulty"
    trailing={<Button size="sm" variant="ghost">+2</Button>}
/>`,
                        render: (
                            <Controlled
                                items={DIFFICULTY_ITEMS}
                                initialValue="easy"
                                ariaLabel="Select difficulty"
                                trailing={<Button data-tier="fixture" size="sm" variant="ghost">+2</Button>}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
/**
 * Leaf prop `itemAction` — each item switches from a single `<Button>` into
 * one fused `ButtonGroup` `[select | 🗑 | ⋮]`.
 */
export const ItemAction: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Button.RadioGroup"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `itemAction`"
                reason="Giving an item action buttons stops it from being a standalone `Button`: the select button plus every action fuse into one connected `ButtonGroup`, so the actions read as belonging to that option instead of floating beside it as separate controls. The seam between segments is HeroUI's `ButtonGroup.Separator`, recoloured to the border token and forced full height."
                states={[
                    {
                        name: "itemAction != null (delete + more per item)",
                        why: "Each attempt row fuses into one ButtonGroup of three segments: the select button, a trash icon, and a kebab menu trigger, all sharing one continuous outline. Pressing the trash or the kebab fires its own handler rather than `onChange`, so an action can never change which attempt is selected.",
                        code: `<Button.RadioGroup
    items={attemptItems}
    value={value}
    onChange={setValue}
    ariaLabel="Select attempt"
    itemAction={(item) => [
        <Button key="delete" size="sm" variant="tertiary" isIconOnly aria-label={\`Delete \${item.value}\`}>
            <TrashIcon className="size-4" />
        </Button>,
        <Button key="more" size="sm" variant="tertiary" isIconOnly aria-label={\`More options for \${item.value}\`}>
            <DotsThreeVerticalIcon className="size-4" />
        </Button>,
    ]}
/>`,
                        render: (
                            <Controlled
                                items={ATTEMPT_ITEMS}
                                initialValue="attempt-1"
                                ariaLabel="Select attempt"
                                itemAction={(item) => [
                                    <Button data-tier="fixture" key="delete" size="sm" variant="tertiary" isIconOnly aria-label={`Delete ${item.value}`}>
                                        <TrashIcon className="size-4" />
                                    </Button>,
                                    <Button data-tier="fixture" key="more" size="sm" variant="tertiary" isIconOnly aria-label={`More options for ${item.value}`}>
                                        <DotsThreeVerticalIcon className="size-4" />
                                    </Button>,
                                ]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}