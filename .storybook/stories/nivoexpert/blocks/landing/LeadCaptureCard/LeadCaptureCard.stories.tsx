import type { Meta, StoryObj } from "@storybook/nextjs"
import { LeadCaptureCard, type LeadCaptureCardLabels } from "@sb-components/nivoexpert/blocks/landing/LeadCaptureCard/LeadCaptureCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `LeadCaptureCard` — the closing "Contact" card of the tenant landing: name +
 * contact + optional message, one submit action, and a sent confirmation. It
 * is the universal onward path present in EVERY page state — never omitted,
 * only its heading copy changes with `intent`. Restyle, not rewrite, of the
 * real `apps/expert/app/LeadForm.tsx`, grounded in `LeadEntity`
 * (`name`, `contact`, `message`) and the real `submitLead` mutation — the
 * real form has no error slot (a thrown mutation still flips to the sent
 * message, since there is nothing the visitor could fix), so none is modelled
 * here either. Built on the shared HeroUI atom system
 * (`SurfaceCard`/`Input.*`/`Button`/`Typography`/`Container`/`Stack`),
 * re-themed per tenant through `apps/expert/app/globals.css`'s `--nivo-*` ->
 * HeroUI CSS-var bridge — see the component's own file header for the full
 * contract.
 */
const meta: Meta<typeof LeadCaptureCard> = {
    title: "NivoExpert/Blocks/Landing/LeadCaptureCard/LeadCaptureCard",
    component: LeadCaptureCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LeadCaptureCard>

const LABELS: LeadCaptureCardLabels = {
    eyebrow: "Contact",
    heading: "Ready to start?",
    subheadingPopulated: "Leave your details — the expert will follow up with the right course for you.",
    subheadingEmpty: "Leave your details — the expert will notify you the moment the first course opens.",
    namePlaceholder: "Your name",
    contactPlaceholder: "Email or phone number",
    messagePlaceholder: "What do you need help with?",
    submitLabel: "Send",
    submittingLabel: "Sending…",
    sentMessage: "Sent. The expert will get back to you soon.",
}

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the card face holding the sub-heading, fields, and submit action" },
    InputText: { tier: "atom", role: "the name and contact fields", storyId: "atoms-forms-input-inputtext--default" },
    InputTextarea: { tier: "atom", role: "the optional message field", storyId: "atoms-forms-input-inputtextarea--default" },
    Button: { tier: "atom", role: "the submit action — busy label + disabled while isSubmitting" },
    Typography: { tier: "atom", role: "eyebrow, heading, sub-heading, and the sent confirmation line" },
}

/** LEAF — one shape; `intent`, `isSkeleton`, `isSubmitting`, and `isSent` are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LeadCaptureCard"
                tier="block"
                leaf="Lead capture card"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                reason="Blocks take no `className`: the card owns the whole contact form, so a route places the WHOLE card rather than restyling it. `intent` is a discriminating prop — it does not change the fields, only which heading copy applies, mirroring the same course-count state that decides the catalog region above it. The card is present in every page state (0-course tenant, populated catalog, first-load) — the one component the state matrix never omits. Only the sub-heading takes `isSkeleton`: the fields and submit action are static, never data-dependent, and stay live throughout, matching the real page's first-load behaviour."
                states={[
                    {
                        name: "intent = empty",
                        why: "The brand-new tenant (0 courses) — the copy asks the visitor to leave contact details so the expert can notify them once the first course opens, rather than assuming there is something to buy yet.",
                        code: `<LeadCaptureCard intent="empty"
    name={name} onNameChange={setName}
    contact={contact} onContactChange={setContact}
    message={message} onMessageChange={setMessage}
    onSubmit={submitLead}
    labels={labels}
/>`,
                        render: (
                            <LeadCaptureCard
                                intent="empty"
                                name=""
                                onNameChange={NOOP}
                                contact=""
                                onContactChange={NOOP}
                                message=""
                                onMessageChange={NOOP}
                                onSubmit={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "intent = populated",
                        why: "A tenant with a real catalog — the copy asks the visitor to leave contact details for course advice, the resting state most visitors meet once the shell has content.",
                        code: `<LeadCaptureCard intent="populated"
    name={name} onNameChange={setName}
    contact={contact} onContactChange={setContact}
    message={message} onMessageChange={setMessage}
    onSubmit={submitLead}
    labels={labels}
/>`,
                        render: (
                            <LeadCaptureCard
                                intent="populated"
                                name=""
                                onNameChange={NOOP}
                                contact=""
                                onContactChange={NOOP}
                                message=""
                                onMessageChange={NOOP}
                                onSubmit={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The page's brand/course-count data has not resolved yet, so the card cannot yet know whether `intent` is empty or populated — only the sub-heading shimmers. The fields and submit action are static, never data-dependent, and stay live throughout, matching the real page's first-load behaviour.",
                        code: "<LeadCaptureCard {...props} isSkeleton />",
                        render: (
                            <LeadCaptureCard
                                intent="populated"
                                isSkeleton
                                name=""
                                onNameChange={NOOP}
                                contact=""
                                onContactChange={NOOP}
                                message=""
                                onMessageChange={NOOP}
                                onSubmit={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSubmitting = true",
                        why: "The `submitLead` mutation is in flight: the button shows its busy label and every field locks, so a double-click cannot fire the mutation twice.",
                        code: "<LeadCaptureCard {...props} isSubmitting />",
                        render: (
                            <LeadCaptureCard
                                intent="populated"
                                isSubmitting
                                name="Alex Rivera"
                                onNameChange={NOOP}
                                contact="alex@example.com"
                                onContactChange={NOOP}
                                message="I'd like to know more about the founder cohort."
                                onMessageChange={NOOP}
                                onSubmit={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSent = true",
                        why: "`submitLead` has resolved — or the real form has calmly swallowed a transport error, since there is nothing the visitor could fix. The fields are replaced by the confirmation line; this is the terminal state of the card in the current visit.",
                        code: "<LeadCaptureCard {...props} isSent />",
                        render: (
                            <LeadCaptureCard
                                intent="populated"
                                isSent
                                name="Alex Rivera"
                                onNameChange={NOOP}
                                contact="alex@example.com"
                                onContactChange={NOOP}
                                message=""
                                onMessageChange={NOOP}
                                onSubmit={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
