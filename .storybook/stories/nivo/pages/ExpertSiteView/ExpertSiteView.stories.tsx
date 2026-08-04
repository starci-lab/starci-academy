import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ExpertSiteView,
    type ExpertSiteViewConfig,
    type ExpertSiteViewLabels,
    type ExpertSiteViewOffering,
} from "@sb-components/nivo/pages/ExpertSiteView/ExpertSiteView"
import type { ExpertSiteLeadFormProps } from "@sb-components/nivo/blocks/expert-site/ExpertSiteLeadForm/ExpertSiteLeadForm"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ExpertSiteView` — the PAGE a visitor sees at `<slug>.nivo.vn`. A page is a
 * list of functions: hero, bio, offerings grid, embedded lead form, arranged in
 * frames. `templateKey` picks the section ORDER. A page's story is one complete
 * STATE per story — `loading`, `empty`, `content` — not a leaf-per-prop map.
 * Grounded in the real `ExpertSiteView`; maps onto `ExpertSiteEntity`.
 */
const meta: Meta<typeof ExpertSiteView> = {
    title: "Nivo/Pages/ExpertSiteView/ExpertSiteView",
    component: ExpertSiteView,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ExpertSiteView>

const NOOP = () => {}

const LABELS: ExpertSiteViewLabels = {
    offeringsTitle: "What I offer",
    contactTitle: "Get in touch",
    defaultOfferingCta: "Learn more",
    poweredBy: "Powered by nivo",
    emptyTitle: "This site isn't ready yet",
    emptyDescription: "The owner hasn't published any content here.",
}

const LEAD_FORM: ExpertSiteLeadFormProps = {
    name: "",
    onNameChange: NOOP,
    contact: "",
    onContactChange: NOOP,
    message: "",
    onMessageChange: NOOP,
    onSubmit: NOOP,
    labels: {
        nameLabel: "Your name",
        contactLabel: "Email or phone",
        contactHint: "So we can reach you back",
        messageLabel: "Message",
        submitLabel: "Send enquiry",
        sentLabel: "Thanks — your enquiry is on its way.",
    },
}

const CONFIG: ExpertSiteViewConfig = {
    displayName: "Le Quang",
    headline: "Full-stack mentor · 8 years shipping SaaS",
    bio: "I help mid-level engineers level up to senior through project-based mentoring, code review, and system-design drills.",
    avatarUrl: null,
    accentHue: 265,
    templateKey: "consultant",
}

const OFFERINGS: Array<ExpertSiteViewOffering> = [
    {
        id: "mentoring",
        title: "1:1 Mentoring",
        subtitle: "Weekly 60-min calls",
        description: "Focused on your real project, with homework between sessions.",
        priceText: "2,000,000 VND / month",
        ctaLabel: "Book a slot",
        ctaUrl: "https://cal.com/le-quang",
        onCtaPress: NOOP,
    },
    {
        id: "intensive",
        title: "System Design Intensive",
        subtitle: "4-week cohort",
        description: null,
        priceText: "5,000,000 VND",
        ctaLabel: null,
        ctaUrl: "https://nivo.vn/le-quang/intensive",
        onCtaPress: NOOP,
    },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    StackV: { tier: "frame", role: "the page's vertical rhythm and the hero column" },
    Grid: { tier: "frame", role: "the offerings grid — one column on mobile, two from @app-sm up" },
    SurfaceCard: { tier: "composite", role: "the bio card, each offering card, and the contact card" },
    EmptyState: { tier: "composite", role: "the empty branch when the site has no content" },
    Avatar: { tier: "atom", role: "the hero avatar (initials fallback when no image)" },
    Typography: { tier: "atom", role: "the display name, headline, bio, offering copy, and footer" },
    Button: { tier: "atom", role: "each offering's call-to-action" },
    ExpertSiteLeadForm: {
        tier: "block",
        role: "the embedded public contact form",
        storyId: "nivo-blocks-expertsite-expertsiteleadform-expertsiteleadform--default",
    },
}

/** STATE — the page is still loading; the skeleton mirror holds the resolved shape. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertSiteView"
                tier="screen"
                leaf="Loading"
                annotate={ANNOTATE}
                reason="A page's story is one complete state per render, not a leaf-per-prop map — a page has states to show, not props to enumerate. The skeleton mirrors the loaded shape (hero, bio, two offering cards, form) so nothing jumps when the site resolves."
                states={[
                    {
                        name: "isLoading = true",
                        why: "The site is still being fetched. Every region draws its resting shape — the avatar, name, and headline shimmer above a bio card, a two-up offerings grid, and the lead form — matching the loaded layout exactly.",
                        code: "<ExpertSiteView {...props} isLoading />",
                        render: (
                            <ExpertSiteView
                                slug="le-quang"
                                config={CONFIG}
                                offerings={OFFERINGS}
                                leadForm={LEAD_FORM}
                                labels={LABELS}
                                isLoading
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — a claimed slug the owner has not filled in yet. */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertSiteView"
                tier="screen"
                leaf="Empty"
                annotate={ANNOTATE}
                reason="A slug can be claimed before any content is written, so `config` is `null`. The page shows a full-page empty state rather than a broken hero — the site exists, it just has nothing to render yet."
                states={[
                    {
                        name: "config = null",
                        why: "No presentation content has been saved. Instead of rendering an empty hero with the raw slug, the page falls to a page-sized empty state that reads as intentional.",
                        code: "<ExpertSiteView slug=\"le-quang\" config={null} … />",
                        render: (
                            <ExpertSiteView
                                slug="le-quang"
                                config={null}
                                offerings={[]}
                                leadForm={LEAD_FORM}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the resolved public site (Consultant template: contact leads before offerings). */
export const Content: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertSiteView"
                tier="screen"
                leaf="Content"
                annotate={ANNOTATE}
                reason="The resolved site. `templateKey='consultant'` orders the sections hero → contact → offerings → bio, and `accentHue` is remapped onto the `--accent` token so the headline, price, and CTA all pick up the site's own colour. One offering has no description and no explicit CTA label, so those slots fall back or drop."
                states={[
                    {
                        name: "config set, offerings present, consultant template",
                        why: "The full public page: the hero with an initials avatar, the embedded contact form leading (consultant template), the two-up offerings grid, and the bio last. The accent hue tints every accent atom without any per-element colour being passed.",
                        code: `<ExpertSiteView
    slug="le-quang"
    config={config /* consultant, accentHue 265 */}
    offerings={offerings}
    leadForm={leadForm}
    labels={labels}
/>`,
                        render: (
                            <ExpertSiteView
                                slug="le-quang"
                                config={CONFIG}
                                offerings={OFFERINGS}
                                leadForm={LEAD_FORM}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the same site on the Creator template (offerings lead, contact last). */
export const ContentCreatorTemplate: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertSiteView"
                tier="screen"
                leaf="Content — creator template"
                annotate={ANNOTATE}
                reason="The exact same data as `Content`, only `templateKey='creator'`. The proof that a template is a LAYOUT choice, not a separate renderer: the identical sections reorder to hero → offerings → bio → contact, with the offerings pushed up front."
                states={[
                    {
                        name: "templateKey = creator",
                        why: "The creator layout leads with the offerings straight under the hero, then the bio, then the contact form last — a Substack-style ordering of the same shared sections.",
                        code: "<ExpertSiteView config={{ ...config, templateKey: \"creator\" }} … />",
                        render: (
                            <ExpertSiteView
                                slug="le-quang"
                                config={{ ...CONFIG, templateKey: "creator" }}
                                offerings={OFFERINGS}
                                leadForm={LEAD_FORM}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
