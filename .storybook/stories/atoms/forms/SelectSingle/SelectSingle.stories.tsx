import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { SelectSingle } from "@sb-components/atoms/forms"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `SelectSingle`: a single-pick dropdown, wraps HeroUI `Select` directly.
 *
 * Leaf atom: the bare control is HeroUI `Select.Trigger`/`Select.Value`/`Select.Popover`, the
 * label/description/error frame is the internal `FieldFrame` (no story of its own). No
 * component here has its own story ⇒ `annotate` carries no `storyId` — but the four real
 * HeroUI parts (`Select.Trigger`/`Select.Value`/`Label`/`Skeleton`) get the `heroui` tier so
 * the two-rule panel doesn't silently drop them.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Select.Trigger": { tier: "heroui", role: "dropdown trigger button" },
    "Select.Value": { tier: "heroui", role: "trigger's selected-value text" },
    "Label": { tier: "heroui", role: "field label line" },
    "Skeleton": { tier: "heroui", role: "loading placeholder" },
}

const meta: Meta = { title: "Atoms/Forms/SelectSingle", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

const OPTIONS = [
    { value: "fs", label: "Fullstack Mastery" },
    { value: "sd", label: "System Design Mastery" },
    { value: "do", label: "DevOps Mastery" },
]

/** BARE leaf — no label: value empty, placeholder shows. FieldFrame renders the trigger directly. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string | null>(null)
            return (
                <BlockAnatomy
                    name="SelectSingle"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Default"
                    states={[
                        {
                            name: "value = null, no label",
                            why: "The trigger shows only the muted placeholder text and FieldFrame renders no label or description around it. This is the bare control, so a caller checking the raw trigger shape does not have to scroll past a heading first.",
                            code: "<SelectSingle value={v} onValueChange={setV} options={OPTIONS} placeholder=\"Choose a course\" />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <SelectSingle
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        placeholder="Choose a course"
                                        ariaLabel="Course"

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

/** Leaf prop `label`/`hint` — label + description (FieldFrame Label/Description). */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string | null>(null)
            return (
                <BlockAnatomy
                    name="SelectSingle"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Props `label` / `hint`"
                    states={[
                        {
                            name: "label = \"Course\", hint set",
                            why: "FieldFrame adds a label line above the trigger and a hint line below it, on top of the same bare trigger from Default. Both come from the same internal frame, so a caller reaches for label and hint together rather than composing two separate wrappers.",
                            code: "<SelectSingle label=\"Course\" hint=\"Pick the track you want to follow.\" ... />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <SelectSingle
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        placeholder="Choose a course"
                                        label="Course"
                                        hint="Pick the track you want to follow."

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

/** Leaf prop `isRequired` — label + a required `*` mark. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string | null>(null)
            return (
                <BlockAnatomy
                    name="SelectSingle"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `isRequired`"
                    states={[
                        {
                            name: "isRequired = true",
                            why: "A red asterisk is appended right after the label text, with nothing else in the composition changing. The mark tells the reader this field cannot be left blank before they ever open the popover.",
                            code: "<SelectSingle label=\"Course\" isRequired ... />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <SelectSingle
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        placeholder="Choose a course"
                                        label="Course"
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
 * Leaf prop `value` — the trigger's shape follows where the data stands: empty
 * shows the muted `placeholder`, a value shows the picked option's own label.
 */
export const Value: Story = {
    render: () => {
        const Demo = () => {
            const [empty, setEmpty] = useState<string | null>(null)
            const [filled, setFilled] = useState<string | null>("sd")
            return (
                <BlockAnatomy
                    name="SelectSingle"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `value`"
                    states={[
                        {
                            name: "value = null",
                            why: "The trigger falls back to the muted placeholder text, using the exact same DOM as the picked state below. An empty value has to read as visibly unset, not as a stray blank box.",
                            code: "<SelectSingle value={null} onValueChange={setV} options={OPTIONS} placeholder=\"Choose a course\" ariaLabel=\"Course\" />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <SelectSingle value={empty} onValueChange={setEmpty} options={OPTIONS} placeholder="Choose a course" ariaLabel="Course" />
                                </div>
                            ),
                        },
                        {
                            name: "value = \"sd\"",
                            why: "The trigger swaps in the matching option's own label, System Design Mastery, in the same node the placeholder just occupied. The trigger is controlled, so it can never drift from whatever value the caller holds in state.",
                            code: "<SelectSingle value=\"sd\" onValueChange={setV} options={OPTIONS} placeholder=\"Choose a course\" ariaLabel=\"Course\" />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <SelectSingle value={filled} onValueChange={setFilled} options={OPTIONS} placeholder="Choose a course" ariaLabel="Course" />
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

/** Leaf prop `isDisabled` — label dims + trigger locks, blocking the popover from opening. */
export const Disabled: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SelectSingle"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isDisabled`"
                states={[
                    {
                        name: "isDisabled = true, value = \"fs\"",
                        why: "The label and the trigger box both dim together and the popover no longer opens on click. Disabling has to read at a glance across the whole field, not just on the box the pointer happens to hover.",
                        code: "<SelectSingle label=\"Course\" value=\"fs\" isDisabled ... />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <SelectSingle
                                    value="fs"
                                    onValueChange={() => {}}
                                    options={OPTIONS}
                                    placeholder="Choose a course"
                                    label="Course"
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
 * Leaf prop `isInvalid` — ONLY switches the border to red, no error line. Different
 * from `errorMessage` (leaf below): setting `errorMessage` gives a red border PLUS
 * an error line; `isInvalid` alone gives only the border, since FieldFrame never
 * invents text of its own.
 */
export const Invalid: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SelectSingle"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isInvalid`"
                states={[
                    {
                        name: "isInvalid = true, errorMessage not set",
                        why: "Only the trigger's border switches to the danger colour, with no error line underneath it. FieldFrame never invents error text on its own, so isInvalid alone marks the field wrong without saying why.",
                        code: "<SelectSingle label=\"Course\" isInvalid ... />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <SelectSingle
                                    value={null}
                                    onValueChange={() => {}}
                                    options={OPTIONS}
                                    placeholder="Choose a course"
                                    label="Course"
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

/** Leaf prop `errorMessage` — label + a red error line + invalid border. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState<string | null>(null)
            return (
                <BlockAnatomy
                    name="SelectSingle"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Prop `errorMessage`"
                    states={[
                        {
                            name: "errorMessage set",
                            why: "The label stays, the trigger border turns to the danger colour, and a red line with the message text appears beneath it. Passing errorMessage is enough on its own to flip the field invalid, there is no separate flag to remember alongside it.",
                            code: "<SelectSingle label=\"Course\" errorMessage=\"Please choose a course.\" ... />",
                            render: (
                                <div data-tier="fixture" className="w-72">
                                    <SelectSingle
                                        value={value}
                                        onValueChange={setValue}
                                        options={OPTIONS}
                                        placeholder="Choose a course"
                                        label="Course"
                                        errorMessage="Please choose a course."

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

/** Leaf prop `isSkeleton` — skeleton label above the trigger-box skeleton (mirrors the right column). */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="SelectSingle"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Both the label and the trigger box swap for shimmer bars sized to the space the real label and trigger will occupy. The atom draws its own resting shape so the field never jumps once the real options are ready.",
                        code: "<SelectSingle label=\"Course\" isSkeleton />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <SelectSingle value={null} onValueChange={() => {}} options={OPTIONS} label="Course" isSkeleton />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
