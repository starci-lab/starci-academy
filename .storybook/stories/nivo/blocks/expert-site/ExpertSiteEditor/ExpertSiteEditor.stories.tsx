import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ExpertSiteEditor,
    type ExpertSiteEditorLabels,
} from "@sb-components/nivo/blocks/expert-site/ExpertSiteEditor/ExpertSiteEditor"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ExpertSiteEditor` — the owner-side content form for one site. One composition
 * of three cards: the address bar (slug + status + publish toggle), the template
 * picker, and the content fields above Save. The publication `status` is DATA, so
 * `draft` and `published` are STATES of the single shape. Grounded in the real
 * `ExpertSiteEditor`; maps onto `ExpertSiteConfig` + `ExpertSiteEntity`.
 */
const meta: Meta<typeof ExpertSiteEditor> = {
    title: "Nivo/Blocks/ExpertSite/ExpertSiteEditor/ExpertSiteEditor",
    component: ExpertSiteEditor,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ExpertSiteEditor>

const LABELS: ExpertSiteEditorLabels = {
    addressLabel: "Your site address",
    statusLabels: { draft: "Draft", live: "Live", suspended: "Suspended" },
    visitLabel: "Visit",
    publishLabel: "Publish",
    unpublishLabel: "Unpublish",
    templateTitle: "Template",
    templateGroupLabel: "Site template",
    templates: {
        minimal: { name: "Minimal", description: "Bio-forward, single column, contact last." },
        creator: { name: "Creator", description: "Offerings up front, then bio, then contact." },
        consultant: { name: "Consultant", description: "Headline + booking lead, offerings as services." },
    },
    contentTitle: "Content",
    displayNameLabel: "Display name",
    headlineLabel: "Headline",
    bioLabel: "Bio",
    saveLabel: "Save",
}

const NOOP = () => {}

const FIELDS = {
    displayName: "Le Quang",
    onDisplayNameChange: NOOP,
    headline: "Full-stack mentor · 8 years shipping SaaS",
    onHeadlineChange: NOOP,
    bio: "I help mid-level engineers level up to senior through project-based mentoring.",
    onBioChange: NOOP,
    templateKey: "consultant" as const,
    onTemplateKeyChange: NOOP,
    onSave: NOOP,
    onTogglePublish: NOOP,
    onVisit: NOOP,
    labels: LABELS,
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the address, template, and content cards" },
    SurfaceCardSelectableGroup: { tier: "composite", role: "the single-select template picker" },
    Chip: { tier: "atom", role: "the current publication status" },
    InputText: { tier: "atom", role: "the display name and headline fields" },
    InputTextarea: { tier: "atom", role: "the bio field" },
    Button: { tier: "atom", role: "the publish toggle, the visit link (live only), and Save" },
    Typography: { tier: "atom", role: "the address label and the site host" },
}

/** LEAF — the form has one shape; draft vs published are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertSiteEditor"
                tier="block"
                leaf="Site editor"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Blocks take no `className`: the block owns the site entity, so the two publication states are one shape read against different data. Only the status chip and the publish/visit controls change between draft and live — the template picker and content fields are identical."
                states={[
                    {
                        name: "status = draft",
                        why: "A site that has never gone live: the status chip reads Draft (neutral), the primary action is Publish, and there is no Visit button because there is no public URL to open yet.",
                        code: `<ExpertSiteEditor
    slug="le-quang"
    status="draft"
    {...fields}
/>`,
                        render: <ExpertSiteEditor slug="le-quang" status="draft" {...FIELDS} />,
                    },
                    {
                        name: "status = live",
                        why: "A published site: the chip reads Live (success), a Visit button appears to open the public URL, and the primary action flips to Unpublish to take it back offline.",
                        code: `<ExpertSiteEditor
    slug="le-quang"
    status="live"
    {...fields}
/>`,
                        render: <ExpertSiteEditor slug="le-quang" status="live" {...FIELDS} />,
                    },
                ]}
            />
        </div>
    ),
}
