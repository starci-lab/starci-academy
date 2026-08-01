import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { InputOtp } from "@sb-components/atoms/forms/Input/Input"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta = { title: "Atoms/Forms/Input/InputOtp", tags: ["autodocs"], parameters: { layout: "fullscreen" } }
export default meta
type Story = StoryObj

/**
 * ATOM — `InputOtp`: one-time-code cells (HeroUI InputOTP), `length` slots, wrapped
 * through an internal `FieldFrame` (§12e).
 *
 * No component here has its own story ⇒ `annotate` has no `storyId` —
 * but the heroui `InputOTP.Group` along with `FieldFrame`'s `Label`/`Skeleton` still need
 * the `heroui` tier so the two-rule panel doesn't silently miss them (2026-07-28).
 *
 * a11y: a COMPOUND control (a row of cells, not a single `<input>`) can't wire up `htmlFor`
 * → the atom pours `label`/`ariaLabel` into `aria-label` itself via the `fieldName` helper
 * (§12e) — mandatory, since losing this connection means the screen reader can't read the field's name.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "InputOTP.Group": { tier: "heroui", role: "one-time-code cell group" },
    "Label": { tier: "heroui", role: "field label line" },
    "Skeleton": { tier: "heroui", role: "loading placeholder" },
}

/** Default — six empty cells, no label yet. */
export const Default: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="InputOtp"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Default"
                    states={[
                        {
                            name: "no label, value = \"\"",
                            why: "Six empty cells render with no Label above them. This is the bare shape for a code entry the caller hasn't named yet, relying on the surrounding page to carry the context.",
                            code: "<InputOtp value={v} onValueChange={setV} length={6} />",
                            render: (
                                <div data-tier="fixture" className="w-80">
                                    <InputOtp value={value} onValueChange={setValue} length={6} ariaLabel="Verification code" showAnatomy />
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

/** WithLabel — label above the cells, hint below the label. */
export const WithLabel: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="InputOtp"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="WithLabel"
                    states={[
                        {
                            name: "label and hint passed",
                            why: "FieldFrame grows a Label above the row of cells and a Description line under the label. This is for a code field the caller wants to introduce and explain in the same spot, such as naming where the code was sent.",
                            code: "<InputOtp label=\"Verification code\" hint=\"Sent to your email\" value={v} onValueChange={setV} length={6} />",
                            render: (
                                <div data-tier="fixture" className="w-80">
                                    <InputOtp label="Verification code" hint="Sent to your email" value={value} onValueChange={setValue} length={6} showAnatomy />
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

/** Required — label with the required asterisk. */
export const Required: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("")
            return (
                <BlockAnatomy
                    name="InputOtp"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Required"
                    states={[
                        {
                            name: "isRequired = true",
                            why: "An asterisk is appended right after the Label text, nothing else changes. This tells the learner the code cannot be left blank before they even start typing.",
                            code: "<InputOtp label=\"Verification code\" isRequired value={v} onValueChange={setV} length={6} />",
                            render: (
                                <div data-tier="fixture" className="w-80">
                                    <InputOtp label="Verification code" isRequired value={value} onValueChange={setValue} length={6} showAnatomy />
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

/** Filled — some cells already carry digits, alongside the label. */
export const Filled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("1234")
            return (
                <BlockAnatomy
                    name="InputOtp"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Filled"
                    states={[
                        {
                            name: "value = \"1234\" (length 6)",
                            why: "The first four cells carry their digits while the last two stay empty, same DOM shape as the empty row. This is the mid-typing shape of the same control, not a separate structure.",
                            code: "<InputOtp label=\"Verification code\" value=\"1234\" onValueChange={setV} length={6} />",
                            render: (
                                <div data-tier="fixture" className="w-80">
                                    <InputOtp label="Verification code" value={value} onValueChange={setValue} length={6} showAnatomy />
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

/** Disabled — cells locked, label faded (code already present). */
export const Disabled: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("1234")
            return (
                <BlockAnatomy
                    name="InputOtp"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Disabled"
                    states={[
                        {
                            name: "isDisabled = true, value = \"1234\"",
                            why: "The whole row of cells locks and fades, along with the Label above it. This is for a code the caller has already resolved or blocked from editing, without hiding what was entered.",
                            code: "<InputOtp label=\"Verification code\" isDisabled value=\"1234\" length={6} />",
                            render: (
                                <div data-tier="fixture" className="w-80">
                                    <InputOtp label="Verification code" value={value} onValueChange={setValue} length={6} isDisabled showAnatomy />
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

/** Error — label + errorMessage → label, red message, and invalid border all show. */
export const Error: Story = {
    render: () => {
        const Demo = () => {
            const [value, setValue] = useState("123")
            return (
                <BlockAnatomy
                    name="InputOtp"
                    tier="atom"
                    annotate={ANNOTATE}
                    leaf="Error"
                    states={[
                        {
                            name: "errorMessage set, value = \"123\"",
                            why: "The Label, a red error line, and an invalid border on the cells all appear together, added by `errorMessage` alone. This is the full validation-failed shape after a wrong code is submitted, giving the learner the reason alongside the visual cue.",
                            code: "<InputOtp label=\"Verification code\" errorMessage=\"Incorrect code\" value=\"123\" length={6} />",
                            render: (
                                <div data-tier="fixture" className="w-80">
                                    <InputOtp label="Verification code" errorMessage="Incorrect code" value={value} onValueChange={setValue} length={6} showAnatomy />
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

/** Loading — label skeleton mirrors above a row of cell skeletons matching length. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="InputOtp"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Loading"
                states={[
                    {
                        name: "isSkeleton = true, label passed",
                        why: "A label-shaped bar renders above a row of cell-shaped bars matching the real `length`. This mirrors the exact box the real label and cells will occupy, so the field doesn't jump in size once it's ready.",
                        code: "<InputOtp label=\"Verification code\" isSkeleton length={6} />",
                        render: (
                            <div data-tier="fixture" className="w-80">
                                <InputOtp label="Verification code" value="" onValueChange={() => {}} length={6} isSkeleton showAnatomy />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
