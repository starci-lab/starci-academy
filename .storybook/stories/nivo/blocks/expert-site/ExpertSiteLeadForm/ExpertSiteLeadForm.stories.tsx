import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ExpertSiteLeadForm,
    type ExpertSiteLeadFormLabels,
} from "@sb-components/nivo/blocks/expert-site/ExpertSiteLeadForm/ExpertSiteLeadForm"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ExpertSiteLeadForm` — the public contact form on an expert's site. One
 * composition: name + contact + message above a submit button. The three phases
 * — `idle`, `isSubmitting`, `isSubmitted` — are DATA, so they are STATES of the
 * single shape. Grounded in the real `ExpertSiteLeadForm`; maps onto the
 * `ExpertSiteLeadEntity` fields a visitor supplies.
 */
const meta: Meta<typeof ExpertSiteLeadForm> = {
    title: "Nivo/Blocks/ExpertSite/ExpertSiteLeadForm/ExpertSiteLeadForm",
    component: ExpertSiteLeadForm,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ExpertSiteLeadForm>

const LABELS: ExpertSiteLeadFormLabels = {
    nameLabel: "Your name",
    contactLabel: "Email or phone",
    contactHint: "So we can reach you back",
    messageLabel: "Message",
    submitLabel: "Send enquiry",
    sentLabel: "Thanks — your enquiry is on its way.",
}

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    InputText: { tier: "atom", role: "the name and contact fields" },
    InputTextarea: { tier: "atom", role: "the multi-line message field" },
    Button: { tier: "atom", role: "the submit action; shows a spinner while submitting" },
    Typography: { tier: "atom", role: "the thank-you line shown once the enquiry is sent" },
}

/** LEAF — the form has one shape; the three phases are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertSiteLeadForm"
                tier="block"
                leaf="Lead form"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                reason="Blocks take no `className`: the form owns its entity (the `name`/`contact`/`message` a visitor gives), so a site places the WHOLE form rather than restyling it. The three interaction phases are states of one shape, not separate leaves — the fields, the busy button, and the thank-you line are the same block reading different data."
                states={[
                    {
                        name: "idle — fields open",
                        why: "The resting form a visitor first meets: name and contact required, message optional. Submit is disabled until name and contact both carry text — presentation logic the block derives, not a request it makes.",
                        code: `<ExpertSiteLeadForm
    name={name} onNameChange={setName}
    contact={contact} onContactChange={setContact}
    message={message} onMessageChange={setMessage}
    onSubmit={submit}
    labels={labels}
/>`,
                        render: (
                            <ExpertSiteLeadForm
                                name="Mai Anh"
                                onNameChange={NOOP}
                                contact="maianh@example.com"
                                onContactChange={NOOP}
                                message="I'd love to join your next cohort — is there a waitlist?"
                                onMessageChange={NOOP}
                                onSubmit={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSubmitting = true",
                        why: "The enquiry is in flight: the submit button shows a spinner and the fields lock, so the visitor cannot double-send while the mutation runs.",
                        code: "<ExpertSiteLeadForm {...props} isSubmitting />",
                        render: (
                            <ExpertSiteLeadForm
                                name="Mai Anh"
                                onNameChange={NOOP}
                                contact="maianh@example.com"
                                onContactChange={NOOP}
                                message="I'd love to join your next cohort — is there a waitlist?"
                                onMessageChange={NOOP}
                                onSubmit={NOOP}
                                labels={LABELS}
                                isSubmitting
                            />
                        ),
                    },
                    {
                        name: "isSubmitted = true",
                        why: "The enquiry landed. The fields are replaced by a single success line — the same confirmation shown whether the transport succeeded or was silently absorbed, so a visitor is never handed an error they cannot fix.",
                        code: "<ExpertSiteLeadForm {...props} isSubmitted />",
                        render: (
                            <ExpertSiteLeadForm
                                name="Mai Anh"
                                onNameChange={NOOP}
                                contact="maianh@example.com"
                                onContactChange={NOOP}
                                message=""
                                onMessageChange={NOOP}
                                onSubmit={NOOP}
                                labels={LABELS}
                                isSubmitted
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
