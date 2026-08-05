import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { InputText } from "@sb-components/atoms/forms"
import { FormSection } from "@sb-components/composites/form/Form/Form"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"
/**
 * SHELL (composite tier §13) — `FormSection`: a TITLED group of fields. A
 * header block (title + optional description, tight `gap-1` because they're a
 * PAIR) followed by the field column, at the `gap` rhythm (§10c).
 *
 * WARNING: STATE SCOPE (§12f): this shell only produces TWO shapes — with
 * `description` and without. A field's label/hint/error/required is the
 * atom's state (`Atoms/Forms/Input/*`, §12e) — the shell doesn't touch it, so
 * there is NO `Error`/`Required` story here. The `errorMessage` field in the
 * fixture only shows that the shell leaves the error line to the atom.
 */
const meta: Meta<typeof FormSection> = {
    title: "Composites/Form/Form/FormSection",
    component: FormSection,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}
export default meta
type Story = StoryObj<typeof FormSection>
/**
 * Only `Typography` is declared — the one REAL component this shell has its
 * own story to point to. The shell does not badge `Header`/`Body`:
 * `Header` is just a div gathering title+description that the two
 * `Typography` nodes below already say in full, and `Body` wraps whatever
 * field the caller passes in — neither has ONE fixed component to point to.
 * `Typography` surfaces as a top-level node instead of a child of `Header`.
 */
const TITLE_ONLY_PARTS: Array<AnatomyNode> = [
    {
        name: "Typography",
        tier: "atom",
        role: "the group title (Sm medium, §9b)",
        storyId: "atoms-text-typography-typography--overview",
    },
]
const WITH_DESCRIPTION_PARTS: Array<AnatomyNode> = [
    {
        name: "Typography",
        tier: "atom",
        role: "the title (Sm medium) and the description (Xs muted, §9a) — same real component, two props",
        storyId: "atoms-text-typography-typography--colors",
    },
]
/** A real fixture field — the atom carries its own label/hint/errorMessage/isRequired (§12e). */
const BillingFields = () => {
    const [company, setCompany] = useState("StarCi Academy")
    const [taxCode, setTaxCode] = useState("")
    return (
        <>
            <InputText label="Company name" isRequired value={company} onValueChange={setCompany} placeholder="Name printed on the invoice" />
            <InputText
                label="Tax code"
                errorMessage="A tax code must be 10 or 13 digits."
                value={taxCode}
                onValueChange={setTaxCode}
                placeholder="0123456789"
            />
        </>
    )
}
/** Default — title only: the field group needs no further explanation. */
export const Default: Story = {
    render: () => {
        const Demo = () => (
            <BlockAnatomy
                name="FormSection"
                tier="composite"
                leaf="Default"
                parts={TITLE_ONLY_PARTS}
                reason="The frame that gathers fields into a named group draws layout plus text through the Typography atom (§9c) and nothing else. The title here is not a field `label`; label, hint, error, and required all belong to the form atoms (§12e), and the frame never grows its own copy of them."
                states={[
                    {
                        name: "description unset",
                        why: "The Header block carries only the Title node, so the group opens with a single line before the field column starts. This is the shape a group reaches for when its title already says everything the reader needs.",
                        code: `<FormSection title="Billing details">
  <InputText label="Company name" isRequired value={company} onValueChange={setCompany} />
  <InputText label="Tax code" errorMessage="A tax code must be 10 or 13 digits." value={taxCode} onValueChange={setTaxCode} />
</FormSection>`,
                        render: (
                            <div data-tier="fixture" className="w-96">
                                <FormSection title="Billing details" body={() => <BillingFields />} />
                            </div>
                        ),
                    },
                ]}
            />
        )
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}
/** WithDescription — adds a muted description line under the title (context for the whole group). */
export const WithDescription: Story = {
    render: () => {
        const Demo = () => (
            <BlockAnatomy
                name="FormSection"
                tier="composite"
                leaf="WithDescription"
                states={[
                    {
                        name: "description = \"These details are printed on the e-invoice...\"",
                        why: "Passing `description` opens exactly one more node inside Header, a muted line sitting on a tight `gap-1` under the title. The group's own `gap` rhythm toward the field column below does not change, because the new line only grows the header block.",
                        code: `<FormSection
  title="Billing details"
  description="These details are printed on the e-invoice; changing them later means requesting a reissue."
>
  …
</FormSection>`,
                        render: (
                            <div data-tier="fixture" className="w-96">
                                <FormSection

                                    title="Billing details"
                                    description="These details are printed on the e-invoice; changing them later means requesting a reissue."
                                    body={() => <BillingFields />}
                                />
                            </div>
                        ),
                    },
                ]}
                parts={WITH_DESCRIPTION_PARTS}
            />
        )
        return <div data-tier="fixture" className="p-8"><Demo /></div>
    },
}
