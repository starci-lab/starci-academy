import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { SelectMulti } from "@sb-components/atoms/forms/Select/Select"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `SelectMulti`: MULTI-select dropdown, wrapping HeroUI `Select` directly
 * (`selectionMode="multiple"`).
 * 
 * Leaf atom: the trigger summarizes with text ("n selected", hardcoded in `Select.tsx`, not
 * a `Chip`). It does not compose `Chip` or `Select.Value` for the picked values (just a bare
 * `<span>`), so there's no real dep ⇒ `annotate` carries no `storyId`. But
 * `Select.Trigger`/`Label`/`Skeleton` are real HeroUI and get the `heroui` tier so the
 * two-rule panel doesn't silently miss them.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Select.Trigger": { tier: "heroui", role: "dropdown trigger button" },
    "Label": { tier: "heroui", role: "field label line" },
    "Skeleton": { tier: "heroui", role: "loading placeholder" },
}

const meta: Meta = { title: "Atoms/Forms/Select/SelectMulti", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

const OPTIONS = [
    { value: "js", label: "JavaScript" },
    { value: "ts", label: "TypeScript" },
    { value: "go", label: "Go" },
    { value: "rs", label: "Rust" },
]

/** Bare leaf — no label: nothing picked yet, showing the placeholder. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<Array<string>>([])
            return (
                <BlockAnatomy
                    name="SelectMulti"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Default"
                    states={[
                        {
                            name: "value = [], no prop turned on",
                            why: "The trigger shows the placeholder text and no label sits above it. This is the baseline shape every other leaf differs from by exactly one prop.",
                            code: "<SelectMulti value={v} onValueChange={setV} options={OPTIONS} placeholder=\"Choose languages\" />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <SelectMulti
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        placeholder="Choose languages"
                                        ariaLabel="Language"
                                       
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf for props `label`/`hint` — label + description (FieldFrame Label/Description). */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<Array<string>>([])
            return (
                <BlockAnatomy
                    name="SelectMulti"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Props `label` / `hint`"
                    states={[
                        {
                            name: "label set, hint set",
                            why: "A label heading and a description line grow above the trigger. The pair tells the reader what the field is for and adds a sentence of guidance before they open it.",
                            code: "<SelectMulti label=\"Language\" hint=\"Pick every language you use.\" ... />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <SelectMulti
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        placeholder="Choose languages"
                                        label="Language"
                                        hint="Pick every language you use."
                                       
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf for prop `isRequired` — label + the required `*` mark. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<Array<string>>([])
            return (
                <BlockAnatomy
                    name="SelectMulti"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `isRequired`"
                    states={[
                        {
                            name: "isRequired = true",
                            why: "A `*` mark attaches after the label, nothing else about the trigger changes. The mark flags a field the form will reject as empty before the reader ever opens it.",
                            code: "<SelectMulti label=\"Language\" isRequired ... />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <SelectMulti
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        placeholder="Choose languages"
                                        label="Language"
                                        isRequired
                                       
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/**
 * Leaf for prop `value` — an empty array shows the trigger's `placeholder`; two or
 * more values collapse into a count ("2 selected") instead of a growing list.
 *
 * ⚠️ Renamed 2026-07-26 (from `Labeled`): this leaf used to also carry `label`, but
 * `label` already has a home in the `WithLabel` leaf ⇒ two leaves showing off the
 * same prop, against §12g. Dropped `label`, returning the leaf to only the prop it
 * owns. `isDisabled` was also split out into the `Disabled` leaf the same day.
 */
export const Value: Story = {
    render: () => {
        const Demo = () => {
            const [empty, setEmpty] = useState<Array<string>>([])
            const [filled, setFilled] = useState<Array<string>>(["ts", "go"])
            return (
                <BlockAnatomy
                    name="SelectMulti"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `value`"
                    states={[
                        {
                            name: "value = []",
                            why: "The trigger falls back to the placeholder text. An empty array reads as nothing chosen yet, the same visual as before the reader ever opened the popover.",
                            code: "<SelectMulti value={[]} … />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <SelectMulti value={empty} onValueChange={setEmpty} options={OPTIONS} placeholder="Choose languages" ariaLabel="Language" />
                                </div>
                            ),
                        },
                        {
                            name: "value = [\"ts\", \"go\"]",
                            why: "Two or more picks collapse into a count instead of listing every label. A growing list would push the trigger's width around as the reader keeps picking, so the atom holds the box steady.",
                            code: "<SelectMulti value={[\"ts\", \"go\"]} … />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <SelectMulti value={filled} onValueChange={setFilled} options={OPTIONS} placeholder="Choose languages" ariaLabel="Language" />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf for prop `isDisabled` — dimmed label + locked trigger, blocking the popover from opening. */
export const Disabled: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SelectMulti"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isDisabled`"
                states={[
                    {
                        name: "isDisabled = true",
                        why: "The label and the trigger box dim together and the popover no longer opens. The dimmed pair reads as one locked control instead of a label that looks live above a dead box.",
                        code: "<SelectMulti label=\"Language\" value={[\"js\"]} isDisabled ... />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <SelectMulti
                                    value={["js"]}
                                    onValueChange={() => {}}
                                    options={OPTIONS}
                                    placeholder="Choose languages"
                                    label="Language"
                                    isDisabled
                                   
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `isInvalid` — ONLY switches the border red, no error line. Differs
 * from `errorMessage` (leaf below): setting `errorMessage` gives a red border PLUS
 * an error line; `isInvalid` alone gives just the border, since FieldFrame never
 * generates its own text.
 */
export const Invalid: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SelectMulti"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isInvalid`"
                states={[
                    {
                        name: "isInvalid = true, errorMessage not set",
                        why: "Only the trigger border switches to danger, no error line grows under it. isInvalid alone is a bare visual flag; pass errorMessage as well when the red line should show too.",
                        code: "<SelectMulti label=\"Language\" isInvalid ... />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <SelectMulti
                                    value={[]}
                                    onValueChange={() => {}}
                                    options={OPTIONS}
                                    placeholder="Choose languages"
                                    label="Language"
                                    isInvalid
                                   
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `errorMessage` — label + red error line + invalid border. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<Array<string>>([])
            return (
                <BlockAnatomy
                    name="SelectMulti"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `errorMessage`"
                    states={[
                        {
                            name: "errorMessage set",
                            why: "The trigger border turns invalid and a red line grows below it, under the same label as any other leaf. Setting errorMessage flips the control invalid on its own, so there is no separate isInvalid to remember alongside it.",
                            code: "<SelectMulti label=\"Language\" errorMessage=\"Pick at least one language.\" ... />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <SelectMulti
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        placeholder="Choose languages"
                                        label="Language"
                                        errorMessage="Pick at least one language."
                                       
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            )
        }
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/** Leaf for prop `isSkeleton` — label skeleton above the trigger-box skeleton (mirrors the exact column). */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SelectMulti"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The label swaps for a bar skeleton and the trigger box swaps for a matching box skeleton. Whoever owns the shape owns its resting state, so the atom draws its own shimmer instead of waiting on a shared skeleton component.",
                        code: "<SelectMulti label=\"Language\" isSkeleton />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <SelectMulti value={[]} onValueChange={() => {}} options={OPTIONS} label="Language" isSkeleton />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
