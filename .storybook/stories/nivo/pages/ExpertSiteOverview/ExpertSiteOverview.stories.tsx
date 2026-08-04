import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ExpertSiteOverview,
    type ExpertSiteOverviewLabels,
    type ExpertSiteOverviewSite,
} from "@sb-components/nivo/pages/ExpertSiteOverview/ExpertSiteOverview"
import type { ExpertSiteEditorLabels, ExpertSiteEditorProps } from "@sb-components/nivo/blocks/expert-site/ExpertSiteEditor/ExpertSiteEditor"
import type { LeadsInboxCounts } from "@sb-components/nivo/blocks/expert-site/LeadsInboxCard/LeadsInboxCard"
import type { DeployStatusSnapshot } from "@sb-components/nivo/blocks/expert-site/DeployStatusCard/DeployStatusCard"
import type { ExpertSiteLeadFormProps } from "@sb-components/nivo/blocks/expert-site/ExpertSiteLeadForm/ExpertSiteLeadForm"
import type { ExpertSiteViewConfig, ExpertSiteViewOffering } from "@sb-components/nivo/pages/ExpertSiteView/ExpertSiteView"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ExpertSiteOverview` — the PAGE at `/expert-site` once a site exists: a list of
 * functions, not a shape of its own. It NAMES `ExpertSiteHeader` (masthead + the
 * one primary action) above a peers grid of three operating-loop tiles
 * (`LeadsInboxCard` large, `DeployStatusCard`, `OfferingsSummaryCard`) above a
 * config/preview split (`ExpertSiteEditor` ⋄ `ExpertSiteView`), and hands each its
 * typed data. A page's story is one complete STATE per render, not a
 * leaf-per-prop map — the four states here mirror the proposal's own matrix:
 * `claimed-empty`, `live`, `loading`, `failed-deploy`.
 */
const meta: Meta<typeof ExpertSiteOverview> = {
    title: "Nivo/Pages/ExpertSiteOverview/ExpertSiteOverview",
    component: ExpertSiteOverview,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ExpertSiteOverview>

const NOOP = () => {}

const SITE: ExpertSiteOverviewSite = { displayName: "Le Quang", host: "le-quang.nivo.vn" }

const LEADS_EMPTY: LeadsInboxCounts = { new: 0, contacted: 0, won: 0, lost: 0 }
const LEADS_LIVE: LeadsInboxCounts = { new: 3, contacted: 5, won: 3, lost: 1 }

const DEPLOYMENT_RUNNING: DeployStatusSnapshot = { status: "running", updatedAtLabel: "2 hours ago" }
const DEPLOYMENT_FAILED: DeployStatusSnapshot = { status: "failed", updatedAtLabel: "12 minutes ago" }

const EDITOR_LABELS: ExpertSiteEditorLabels = {
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

/** Editor bag for a freshly claimed slug — nothing written yet. */
const EDITOR_DRAFT: ExpertSiteEditorProps = {
    slug: "le-quang",
    status: "draft",
    displayName: "",
    onDisplayNameChange: NOOP,
    headline: "",
    onHeadlineChange: NOOP,
    bio: "",
    onBioChange: NOOP,
    templateKey: "minimal",
    onTemplateKeyChange: NOOP,
    onSave: NOOP,
    onTogglePublish: NOOP,
    onVisit: NOOP,
    labels: EDITOR_LABELS,
}

/** Editor bag once the owner has filled in and published their content. */
const EDITOR_LIVE: ExpertSiteEditorProps = {
    slug: "le-quang",
    status: "live",
    displayName: "Le Quang",
    onDisplayNameChange: NOOP,
    headline: "Full-stack mentor · 8 years shipping SaaS",
    onHeadlineChange: NOOP,
    bio: "I help mid-level engineers level up to senior through project-based mentoring, code review, and system-design drills.",
    onBioChange: NOOP,
    templateKey: "consultant",
    onTemplateKeyChange: NOOP,
    onSave: NOOP,
    onTogglePublish: NOOP,
    onVisit: NOOP,
    labels: EDITOR_LABELS,
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

const PREVIEW_LABELS = {
    offeringsTitle: "What I offer",
    contactTitle: "Get in touch",
    defaultOfferingCta: "Learn more",
    poweredBy: "Powered by nivo",
    emptyTitle: "This site isn't ready yet",
    emptyDescription: "The owner hasn't published any content here.",
}

const PREVIEW_CONFIG: ExpertSiteViewConfig = {
    displayName: "Le Quang",
    headline: "Full-stack mentor · 8 years shipping SaaS",
    bio: "I help mid-level engineers level up to senior through project-based mentoring, code review, and system-design drills.",
    avatarUrl: null,
    accentHue: 265,
    templateKey: "consultant",
}

const PREVIEW_OFFERINGS: Array<ExpertSiteViewOffering> = [
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

const LABELS: ExpertSiteOverviewLabels = {
    header: {
        statusLabels: { draft: "Draft", live: "Live", failed: "Deploy failed" },
        viewSiteLabel: "View site",
        publishLabel: "Publish",
        editPageLabel: "Edit page",
        retryLabel: "Retry",
    },
    leads: {
        title: "Leads (CRM)",
        newBadgePrefix: "New",
        caption: "Contacts your site collected — some still need a reply.",
        emptyCaption: "No leads yet — share your site link to get your first one.",
        statusOptions: { new: "New", contacted: "Contacted", won: "Won", lost: "Lost" },
        openCrmLabel: "Open CRM",
        openCrmAriaLabel: "Open leads CRM",
    },
    deploy: {
        title: "Deployment",
        notDeployedLabel: "Not published yet",
        statusOptions: { pending: "Queued", building: "Building", running: "Deployed", stopped: "Stopped", failed: "Failed" },
        retryLabel: "Retry",
    },
    offerings: {
        title: "Offerings",
        description: "offerings live on your site",
        emptyDescription: "No offerings yet — add one so visitors know what you sell.",
        drillLabel: "Edit offerings",
        emptyDrillLabel: "Add your first offering",
    },
    failedBannerTitle: "The last deploy failed",
    failedBannerDescription: "Your site is still serving its last successful build. Retry the deploy to publish your latest changes.",
    failedBannerRetryLabel: "Retry deploy",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    ExpertSiteHeader: {
        tier: "block",
        role: "the masthead — status badge + the one primary action, which changes with `status`",
        storyId: "nivo-blocks-expertsite-expertsiteheader-expertsiteheader--default",
    },
    LeadsInboxCard: {
        tier: "block",
        role: "the leads tile, spanning double width as the volume region",
        storyId: "nivo-blocks-expertsite-leadsinboxcard-leadsinboxcard--default",
    },
    DeployStatusCard: {
        tier: "block",
        role: "the deployment tile, with retry only in the failed status",
        storyId: "nivo-blocks-expertsite-deploystatuscard-deploystatuscard--default",
    },
    OfferingsSummaryCard: {
        tier: "block",
        role: "the offerings tile, drilling into the offerings editor",
        storyId: "nivo-blocks-expertsite-offeringssummarycard-offeringssummarycard--default",
    },
    ExpertSiteEditor: {
        tier: "block",
        role: "the config column of the split — the owner-side content form",
        storyId: "nivo-blocks-expertsite-expertsiteeditor-expertsiteeditor--default",
    },
    ExpertSiteView: {
        tier: "screen",
        role: "the preview column of the split — the same page a visitor sees",
        storyId: "nivo-pages-expertsiteview-expertsiteview--content",
    },
    Grid: { tier: "frame", role: "the peers grid — three operating-loop tiles" },
    SplitWorkspace: { tier: "frame", role: "the config/preview split — editor leading, preview pinned beside it" },
    StackV: { tier: "frame", role: "the page's own vertical rhythm" },
    Callout: { tier: "composite", role: "the failed-deploy banner, shown only in the `failed` status" },
    SurfaceCard: { tier: "composite", role: "the generic loading mirror standing in for the editor column while its own first fetch is in flight" },
}

/** STATE — a freshly claimed slug: draft status, zero leads/offerings, empty preview. */
export const ClaimedEmpty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertSiteOverview"
                tier="screen"
                leaf="Claimed, empty"
                annotate={ANNOTATE}
                reason="A page's story is one complete state per render, not a leaf-per-prop map. A claimed slug with nothing written yet: the masthead reads Draft with Publish as the one primary action, both tiles that count things read zero — worded to invite the first offering / the first share — the deployment tile has never run, and the preview column falls to `ExpertSiteView`'s own empty branch since there is no content to show a visitor yet."
                states={[
                    {
                        name: "status = draft, leads = 0, offerings = 0",
                        why: "Right after claiming a slug. The owner has not published or written anything, so every tile reads its empty caption and the live preview shows the same page a visitor would see today — nothing.",
                        code: `<ExpertSiteOverview
    status="draft"
    site={site}
    leadsCounts={{ new: 0, contacted: 0, won: 0, lost: 0 }}
    deployment={null}
    offeringsCount={0}
    editor={editorDraft}
    preview={{ ...preview, config: null, offerings: [] }}
    onPublish={onPublish}
    …
/>`,
                        render: (
                            <ExpertSiteOverview
                                status="draft"
                                site={SITE}
                                leadsCounts={LEADS_EMPTY}
                                onOpenCrm={NOOP}
                                deployment={null}
                                offeringsCount={0}
                                onOpenOfferingsEditor={NOOP}
                                editor={EDITOR_DRAFT}
                                preview={{ slug: "le-quang", config: null, offerings: [], leadForm: LEAD_FORM, labels: PREVIEW_LABELS }}
                                labels={LABELS}
                                onPublish={NOOP}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the resolved, healthy overview: live status, real counts, running deployment. */
export const Live: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertSiteOverview"
                tier="screen"
                leaf="Live"
                annotate={ANNOTATE}
                reason="The site's resting state: masthead reads Live with Edit page as the primary action and View site alongside it, the three tiles show their real counts (leads spanning double width as the volume region), and the config/preview split shows the owner's saved content next to the exact page a visitor sees."
                states={[
                    {
                        name: "status = live, counts populated",
                        why: "The everyday view once a site is published and has drawn interest: 12 leads across the pipeline, 2 offerings, and the last deploy running cleanly.",
                        code: `<ExpertSiteOverview
    status="live"
    site={site}
    leadsCounts={{ new: 3, contacted: 5, won: 3, lost: 1 }}
    deployment={{ status: "running", updatedAtLabel: "2 hours ago" }}
    offeringsCount={2}
    editor={editorLive}
    preview={{ ...preview, config, offerings }}
    onViewSite={onViewSite}
    onEditPage={onEditPage}
/>`,
                        render: (
                            <ExpertSiteOverview
                                status="live"
                                site={SITE}
                                leadsCounts={LEADS_LIVE}
                                onOpenCrm={NOOP}
                                deployment={DEPLOYMENT_RUNNING}
                                offeringsCount={PREVIEW_OFFERINGS.length}
                                onOpenOfferingsEditor={NOOP}
                                editor={EDITOR_LIVE}
                                preview={{ slug: "le-quang", config: PREVIEW_CONFIG, offerings: PREVIEW_OFFERINGS, leadForm: LEAD_FORM, labels: PREVIEW_LABELS }}
                                labels={LABELS}
                                onViewSite={NOOP}
                                onEditPage={NOOP}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the overview's own first fetch is in flight; every region mirrors `Live`'s shape while shimmering. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertSiteOverview"
                tier="screen"
                leaf="Loading"
                annotate={ANNOTATE}
                reason="`isSkeleton` mirrors the SAME tree as `Live` rather than swapping in a different shape: the masthead and the three tiles thread the co-located flag straight into `ExpertSiteHeader`/`LeadsInboxCard`/`DeployStatusCard`/`OfferingsSummaryCard`, `ExpertSiteView` shimmers through its own `isLoading`, and `ExpertSiteEditor` — which has no loading branch of its own — is stood in for by a generic placeholder card so the split still holds its two-column shape."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The overview's own first fetch has not resolved yet. Every region shows its resting shimmer shape instead of the resolved counts, so nothing jumps once the data lands.",
                        code: "<ExpertSiteOverview {...liveProps} isSkeleton />",
                        render: (
                            <ExpertSiteOverview
                                status="live"
                                site={SITE}
                                leadsCounts={LEADS_LIVE}
                                onOpenCrm={NOOP}
                                deployment={DEPLOYMENT_RUNNING}
                                offeringsCount={PREVIEW_OFFERINGS.length}
                                onOpenOfferingsEditor={NOOP}
                                editor={EDITOR_LIVE}
                                preview={{ slug: "le-quang", config: PREVIEW_CONFIG, offerings: PREVIEW_OFFERINGS, leadForm: LEAD_FORM, labels: PREVIEW_LABELS }}
                                labels={LABELS}
                                onViewSite={NOOP}
                                onEditPage={NOOP}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the last deploy failed; the site keeps serving its last live build. */
export const FailedDeploy: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertSiteOverview"
                tier="screen"
                leaf="Failed deploy"
                annotate={ANNOTATE}
                reason="`failed` sits on top of an otherwise `live` site (`ExpertSiteHeader`'s own vocabulary): the masthead reads Deploy failed with Retry as the primary action, a `Callout` banner explains the site is still serving its last successful build, and the deployment tile shows its own retry — all three retry triggers share the ONE `onRetryDeploy` handler. Counts and the preview stay exactly what they were under `Live`, since nothing has been lost."
                states={[
                    {
                        name: "status = failed",
                        why: "A redeploy just failed. The owner needs to know without losing the site — the banner and the masthead both say so, and the preview still shows the last good build rather than going blank.",
                        code: `<ExpertSiteOverview
    status="failed"
    site={site}
    leadsCounts={{ new: 3, contacted: 5, won: 3, lost: 1 }}
    deployment={{ status: "failed", updatedAtLabel: "12 minutes ago" }}
    offeringsCount={2}
    editor={editorLive}
    preview={{ ...preview, config, offerings }}
    onViewSite={onViewSite}
    onRetryDeploy={onRetryDeploy}
/>`,
                        render: (
                            <ExpertSiteOverview
                                status="failed"
                                site={SITE}
                                leadsCounts={LEADS_LIVE}
                                onOpenCrm={NOOP}
                                deployment={DEPLOYMENT_FAILED}
                                offeringsCount={PREVIEW_OFFERINGS.length}
                                onOpenOfferingsEditor={NOOP}
                                editor={EDITOR_LIVE}
                                preview={{ slug: "le-quang", config: PREVIEW_CONFIG, offerings: PREVIEW_OFFERINGS, leadForm: LEAD_FORM, labels: PREVIEW_LABELS }}
                                labels={LABELS}
                                onViewSite={NOOP}
                                onRetryDeploy={NOOP}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
