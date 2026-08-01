import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { SelectCombobox } from "@sb-components/atoms/forms/Select/Select"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `SelectCombobox`: a type-to-filter single-select autocomplete, wrapping
 * HeroUI `ComboBox` directly.
 *
 * Leaf atoms: the typed field + caret is HeroUI `Input`/`ComboBox.Trigger`, the
 * label/description/error frame is the INTERNAL `FieldFrame` (no story of its
 * own). No component here has its own story to jump to ⇒ `annotate` has no
 * `storyId` — but the four real heroui parts (`Input`/`ComboBox.Trigger`/
 * `Label`/`Skeleton`) still need `tier: "heroui"` so the two-law panel doesn't
 * silently miss them (2026-07-28).
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Input": { tier: "heroui", role: "typed filter text field" },
    "ComboBox.Trigger": { tier: "heroui", role: "caret button opening the list" },
    "Label": { tier: "heroui", role: "field label line" },
    "Skeleton": { tier: "heroui", role: "loading placeholder" },
}

const meta: Meta = { title: "Atoms/Forms/Select/SelectCombobox", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

const OPTIONS = [
    { value: "hn", label: "Hanoi" },
    { value: "hcm", label: "Ho Chi Minh City" },
    { value: "dn", label: "Da Nang" },
    { value: "ct", label: "Can Tho" },
    { value: "hp", label: "Hai Phong" },
]

/** Bare leaf — no label: an empty box, type to filter suggestions. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string | null>(null)
            return (
                <BlockAnatomy
                    name="SelectCombobox"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Default"
                    states={[
                        {
                            name: "no label, value = null",
                            why: "The field renders an empty box carrying only the `placeholder` text. Typing runs react-aria's own option filter, so a bare combobox is ready to search the moment it mounts, with no label above it.",
                            code: "<SelectCombobox value={v} onValueChange={setV} options={OPTIONS} placeholder=\"Search city or province\" />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <SelectCombobox
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        placeholder="Search city or province"
                                        ariaLabel="City/Province"
                                        showAnatomy
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

/** Leaf props `label`/`hint` — label + description (FieldFrame Label/Description). */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string | null>(null)
            return (
                <BlockAnatomy
                    name="SelectCombobox"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Props `label` / `hint`"
                    states={[
                        {
                            name: "label and hint passed",
                            why: "FieldFrame grows a Label above the box and a Description line below it. This is for a field the caller wants to name and explain on its own, instead of leaving the meaning to a surrounding form section.",
                            code: "<SelectCombobox label=\"City/Province\" hint=\"Type to filter fast.\" ... />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <SelectCombobox
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        placeholder="Search city or province"
                                        label="City/Province"
                                        hint="Type to filter fast."
                                        showAnatomy
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

/** Leaf prop `isRequired` — label plus the required `*` mark. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string | null>(null)
            return (
                <BlockAnatomy
                    name="SelectCombobox"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `isRequired`"
                    states={[
                        {
                            name: "isRequired = true",
                            why: "A `*` is appended right after the Label text, no other node changes. This tells the viewer the field cannot be submitted empty before they even try.",
                            code: "<SelectCombobox label=\"City/Province\" isRequired ... />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <SelectCombobox
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        placeholder="Search city or province"
                                        label="City/Province"
                                        isRequired
                                        showAnatomy
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
 * Leaf prop `value` — an empty box shows the muted `placeholder`; once a
 * selection is made the box carries the chosen option's label.
 *
 * ⚠️ Renamed 2026-07-26 (from `Labeled`): this leaf used to also carry `label`,
 * but `label` already had a home in the `WithLabel` leaf ⇒ two leaves showing off
 * the same prop, against §12g. Dropped `label`, returning the leaf to just the
 * prop it owns. `isDisabled` was also split out into the `Disabled` leaf the same day.
 */
export const Value: Story = {
    render: () => {
        const Demo = () => {
            const [empty, setEmpty] = useState<string | null>(null)
            const [filled, setFilled] = useState<string | null>("dn")
            return (
                <BlockAnatomy
                    name="SelectCombobox"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `value`"
                    states={[
                        {
                            name: "value = null",
                            why: "The box falls back to the muted `placeholder` text, same DOM shape as a filled box. This is the resting state before the learner has picked anything yet.",
                            code: "<SelectCombobox value={null} ... />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <SelectCombobox value={empty} onValueChange={setEmpty} options={OPTIONS} placeholder="Search city or province" ariaLabel="City or province" showAnatomy />
                                </div>
                            ),
                        },
                        {
                            name: "value = \"dn\"",
                            why: "The box swaps the placeholder for the matching option's own label text, same DOM shape as the empty box. This is what the field shows once a real selection has landed.",
                            code: "<SelectCombobox value=\"dn\" ... />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <SelectCombobox value={filled} onValueChange={setFilled} options={OPTIONS} placeholder="Search city or province" ariaLabel="City or province" showAnatomy />
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

/** Leaf prop `isDisabled` — dimmed label + locked input, blocks the popover from opening. */
export const Disabled: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SelectCombobox"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isDisabled`"
                states={[
                    {
                        name: "isDisabled = true",
                        why: "The Label and the input box both dim together, and typing plus opening the popover are both blocked. This is for a field the caller has decided the learner cannot touch right now, without removing it from view.",
                        code: "<SelectCombobox label=\"City/Province\" value=\"hn\" isDisabled ... />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <SelectCombobox
                                    value="hn"
                                    onValueChange={() => {}}
                                    options={OPTIONS}
                                    placeholder="Search city or province"
                                    label="City/Province"
                                    isDisabled
                                    showAnatomy
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
 * Leaf prop `isInvalid` — ONLY turns the border red, no error line. Different
 * from `errorMessage` (leaf below): setting `errorMessage` gives a red border
 * PLUS an error line; `isInvalid` alone gives only the border, since FieldFrame
 * never invents its own error text.
 */
export const Invalid: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SelectCombobox"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isInvalid`"
                states={[
                    {
                        name: "isInvalid = true, no errorMessage",
                        why: "Only the input border switches to the danger tone; no error line appears under it, because FieldFrame never invents error text on its own. Pass `errorMessage` alongside it when the red line should show too.",
                        code: "<SelectCombobox label=\"City/Province\" isInvalid ... />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <SelectCombobox
                                    value={null}
                                    onValueChange={() => {}}
                                    options={OPTIONS}
                                    placeholder="Search city or province"
                                    label="City/Province"
                                    isInvalid
                                    showAnatomy
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `errorMessage` — label + red error line + invalid border. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string | null>(null)
            return (
                <BlockAnatomy
                    name="SelectCombobox"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `errorMessage`"
                    states={[
                        {
                            name: "errorMessage set",
                            why: "The Label, a red message line, and an invalid border all appear together, added by `errorMessage` alone. This is the full validation-failed shape, giving the learner both the visual cue and the reason in one line.",
                            code: "<SelectCombobox label=\"City/Province\" errorMessage=\"Choose a valid city or province.\" ... />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <SelectCombobox
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        placeholder="Search city or province"
                                        label="City/Province"
                                        errorMessage="Choose a valid city or province."
                                        showAnatomy
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

/** Leaf prop `isSkeleton` — a skeleton label above a skeleton trigger box (mirrors the exact column). */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SelectCombobox"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "A label-shaped bar and a trigger-box-shaped bar both swap in for the real field. This mirrors the exact column the real label and box will occupy, so the row doesn't shift once the field is ready.",
                        code: "<SelectCombobox label=\"City/Province\" isSkeleton />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <SelectCombobox value={null} onValueChange={() => {}} options={OPTIONS} label="City/Province" isSkeleton showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
