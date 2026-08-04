import type { Meta, StoryObj } from "@storybook/nextjs"
import type { ExpertSiteEditorProps } from "@sb-components/nivo/blocks/expert-site/ExpertSiteEditor/ExpertSiteEditor"
import {
    ExpertSiteManager,
    type ExpertSiteCreateLabels,
} from "@sb-components/nivo/blocks/expert-site/ExpertSiteManager/ExpertSiteManager"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ExpertSiteManager` — the owner's control surface at `/expert-site`. It owns
 * one domain decision: does this user have a site yet? That branch is the two
 * STATES of the single shape — `no-site` shows the claim-a-slug prompt,
 * `has-site` shows the `ExpertSiteEditor`. Grounded in the real
 * `ExpertSiteManager`, which keeps both on one route.
 */
const meta: Meta<typeof ExpertSiteManager> = {
    title: "Nivo/Blocks/ExpertSite/ExpertSiteManager/ExpertSiteManager",
    component: ExpertSiteManager,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ExpertSiteManager>

const NOOP = () => {}

const CREATE_LABELS: ExpertSiteCreateLabels = {
    title: "Claim your site",
    description: "Pick a subdomain and your site opens instantly — no order, no invoice.",
    slugLabel: "Subdomain",
    slugHint: "Your site will be served at le-quang.nivo.vn",
    createLabel: "Create site",
}

const EDITOR: ExpertSiteEditorProps = {
    slug: "le-quang",
    status: "live",
    displayName: "Le Quang",
    onDisplayNameChange: NOOP,
    headline: "Full-stack mentor · 8 years shipping SaaS",
    onHeadlineChange: NOOP,
    bio: "I help mid-level engineers level up to senior through project-based mentoring.",
    onBioChange: NOOP,
    templateKey: "consultant",
    onTemplateKeyChange: NOOP,
    onSave: NOOP,
    onTogglePublish: NOOP,
    onVisit: NOOP,
    labels: {
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
    },
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the create prompt card (no-site branch)" },
    InputText: { tier: "atom", role: "the slug field, with a validation message when the slug is taken or reserved" },
    Button: { tier: "atom", role: "the Create action" },
    ExpertSiteEditor: {
        tier: "block",
        role: "the full site editor, shown once a site exists",
        storyId: "nivo-blocks-expertsite-expertsiteeditor-expertsiteeditor--default",
    },
    Typography: { tier: "atom", role: "the create prompt's title and description" },
}

/** LEAF — the manager has one shape; no-site vs has-site are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertSiteManager"
                tier="block"
                leaf="Control surface"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Blocks take no `className`: this block owns the one domain decision — does the user have a site? — so the two branches are states of one shape. It composes the child that fits: the create prompt it owns, or the `ExpertSiteEditor` block for a resolved site."
                states={[
                    {
                        name: "mode = create (no site yet)",
                        why: "The user has no site. One slug field and one Create button — no order, no invoice — so creating a site drops them straight into the editor with no navigation in between.",
                        code: `<ExpertSiteManager
    mode="create"
    slug={slug} onSlugChange={setSlug}
    onCreate={create}
    labels={createLabels}
/>`,
                        render: (
                            <ExpertSiteManager
                                mode="create"
                                slug="le-quang"
                                onSlugChange={NOOP}
                                onCreate={NOOP}
                                labels={CREATE_LABELS}
                            />
                        ),
                    },
                    {
                        name: "mode = create, slug rejected",
                        why: "The backend rejects reserved and taken slugs; the block surfaces that message under the field rather than guessing which of the two happened.",
                        code: `<ExpertSiteManager
    mode="create"
    slug="admin"
    slugError="That subdomain is already taken."
    …
/>`,
                        render: (
                            <ExpertSiteManager
                                mode="create"
                                slug="admin"
                                onSlugChange={NOOP}
                                onCreate={NOOP}
                                slugError="That subdomain is already taken."
                                labels={CREATE_LABELS}
                            />
                        ),
                    },
                    {
                        name: "mode = edit (site exists)",
                        why: "The user has a site, so the manager composes the full `ExpertSiteEditor` for it — the whole address/template/content surface, unchanged, forwarded its resolved props.",
                        code: `<ExpertSiteManager
    mode="edit"
    editor={editorProps}
/>`,
                        render: <ExpertSiteManager mode="edit" editor={EDITOR} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The \"do you have a site?\" fetch hasn't resolved, so before the branch is known the manager shows a representative create-prompt shape — title, description, slug field and Create button — all shimmering, so nothing jumps when the real branch lands.",
                        code: "<ExpertSiteManager isSkeleton />",
                        render: <ExpertSiteManager isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
