import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { InputText } from "@sb-components/atoms/forms/Input/Input"
import { Form, FormActions, FormSection } from "@sb-components/composites/form/Form/Form"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * SHELL (composite tier §13) — `Form`: a REAL `<form>` shell (submit on ENTER)
 * + a content column following the `gap` rhythm (§10c) + an `actions` slot at
 * the bottom.
 *
 * ⚠️ STATE SCOPE (§12f): the stories here only render state that the shell
 * ITSELF produces — `isDisabled` (locks the whole form via `<fieldset
 * disabled>`) and how it lays out `body`/`actions`. A field's label/hint/error/
 * required is the ATOM's state (`Atoms/Forms/Input/*`, §12e) — NOT repeated
 * here. Each button's pending state belongs to `Atoms/Buttons/Button` — here it
 * only shows up as ONE PART of the "submitting" state the shell owns.
 */
const meta: Meta<typeof Form> = {
    title: "Composites/Form/Form/Form",
    component: Form,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Form>

/**
 * The shell does NOT badge `Body`/`Actions` (2026-07-28, §11a.1 CASE 3): both
 * wrap an ARBITRARY node the caller supplies (any field, or `actions` —
 * usually a `FormActions` but never enforced), so there is no ONE fixed
 * component for a panel link to point to — the component has dropped both
 * badges entirely. There is no part left that belongs to `Form` alone to
 * declare here; the REAL nodes that show up in the canvas below (e.g. the
 * `Typography` inside `FormSection`) already have a `storyId` declared in
 * `FormSection.stories.tsx`.
 */

/** A real fixture field — the `Input.*` atom carries its OWN label/hint/required (§12e). */
const AccountFields = () => {
    const [name, setName] = useState("Quang Nguyen")
    const [email, setEmail] = useState("quang@starci.dev")
    return (
        <>
            <InputText label="Full name" isRequired value={name} onValueChange={setName} placeholder="Full name" />
            <InputText label="Email" hint="Where course notifications are sent." value={email} onValueChange={setEmail} placeholder="you@example.com" />
        </>
    )
}

/** Default — `children` is the shorthand for `body`; `actions` is its own slot at the bottom. */
export const Default: Story = {
    render: () => {
        const Demo = () => (
            <BlockAnatomy
                name="Form"
                tier="composite"
                leaf="Default"
                reason="The form frame of the composite tier: it builds a real `<form>` (ENTER inside a field submits, a11y), stacks content into a column on the `gap` rhythm (§10c), and keeps one `actions` slot at the bottom. The frame knows nothing about the fields inside, no validation, no values, no errors (that is the block tier); labels and errors come from the form atoms themselves (§12e)."
                states={[
                    {
                        name: "isDisabled not set, children shorthand fills body",
                        why: "The frame renders as a live, editable form: the fieldset stays enabled and `children` fills the `body` slot as the shorthand for it, while `actions` sits in its own slot at the bottom. This is the resting shape a reader lands on before anything is submitted or locked.",
                        code: `<Form
  gap={6}
  onSubmit={() => save()}
  actions={<FormActions items={[{ key: "cancel", label: "Cancel", variant: "secondary" }, { key: "save", label: "Save" }]} />}
>
  <FormSection title="Account">
    <InputText label="Full name" isRequired value={name} onValueChange={setName} />
    <InputText label="Email" value={email} onValueChange={setEmail} />
  </FormSection>
</Form>`,
                        render: (
                            <div data-tier="fixture" className="w-96">
                                <Form
                                   
                                    onSubmit={() => {}}
                                    actions={(
                                        <FormActions
                                            items={[
                                                { key: "cancel", label: "Cancel", variant: "secondary" },
                                                { key: "save", label: "Save changes" },
                                            ]}
                                        />
                                    )}
                                >
                                    <FormSection title="Account">
                                        <AccountFields />
                                    </FormSection>
                                </Form>
                            </div>
                        ),
                    },
                ]}
            />
        )
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/**
 * Submitting — mid-send: the shell locks the WHOLE form (`isDisabled`) while
 * the primary button spins. This is the SHELL's state (one `<fieldset
 * disabled>` covering every control), not a state private to the button.
 */
export const Submitting: Story = {
    render: () => {
        const Demo = () => (
            <BlockAnatomy
                name="Form"
                tier="composite"
                leaf="Submitting"
                states={[
                    {
                        name: "isDisabled = true, one action isPending",
                        why: "Every control inside locks at once, because `isDisabled` maps to a native `<fieldset disabled>` covering both fields and buttons, while the save button's own spinner marks which action is running. The frame never threads a flag down to each field individually, so this single switch is what keeps the whole form from being edited mid-submit.",
                        code: `<Form
  isDisabled
  actions={<FormActions items={[{ key: "cancel", label: "Cancel", variant: "secondary" }, { key: "save", label: "Saving", isPending: true }]} />}
>
  …
</Form>`,
                        render: (
                            <div data-tier="fixture" className="w-96">
                                <Form
                                   
                                    isDisabled
                                    onSubmit={() => {}}
                                    actions={(
                                        <FormActions
                                            items={[
                                                { key: "cancel", label: "Cancel", variant: "secondary" },
                                                { key: "save", label: "Saving", isPending: true },
                                            ]}
                                        />
                                    )}
                                >
                                    <FormSection title="Account">
                                        <AccountFields />
                                    </FormSection>
                                </Form>
                            </div>
                        ),
                    },
                ]}
            />
        )
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}

/**
 * Disabled — the form is locked while NOTHING is running (not enough
 * permission yet, waiting on an unlock condition). Same `<fieldset disabled>`
 * mechanism, the difference being no button is pending.
 */
export const Disabled: Story = {
    render: () => {
        const Demo = () => (
            <BlockAnatomy
                name="Form"
                tier="composite"
                leaf="Disabled"
                states={[
                    {
                        name: "isDisabled = true, no action isPending",
                        why: "Every control locks through the same `<fieldset disabled>` as the Submitting leaf, but none of the buttons carries a spinner. This is a static lock, not an in-flight one: the form reads and nothing on it is currently running, such as a step upstream that has not cleared yet.",
                        code: `<Form isDisabled actions={<FormActions items={[…]} />}>
  …
</Form>`,
                        render: (
                            <div data-tier="fixture" className="w-96">
                                <Form
                                   
                                    isDisabled
                                    onSubmit={() => {}}
                                    actions={(
                                        <FormActions
                                            items={[
                                                { key: "cancel", label: "Cancel", variant: "secondary" },
                                                { key: "save", label: "Save changes" },
                                            ]}
                                        />
                                    )}
                                >
                                    <FormSection title="Account" description="Only an administrator can edit this profile.">
                                        <AccountFields />
                                    </FormSection>
                                </Form>
                            </div>
                        ),
                    },
                ]}
            />
        )
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}
