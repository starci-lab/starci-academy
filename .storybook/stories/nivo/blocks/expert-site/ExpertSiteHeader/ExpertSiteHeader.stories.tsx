import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ExpertSiteHeader,
    type ExpertSiteHeaderLabels,
} from "@sb-components/nivo/blocks/expert-site/ExpertSiteHeader/ExpertSiteHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ExpertSiteHeader` — the manage-overview masthead: title + status badge + the
 * site's own address + ONE primary action, which CHANGES with the status. Three
 * DATA states of the single shape (`draft`/`live`/`failed`) rather than three
 * leaves — the badge tone, whether the address is visitable, and the primary
 * action are all derived from the same `status`, so drawing them as separate
 * components would let them drift out of sync. `failed` is the header's OWN
 * vocabulary: it fires when the site has a failed deployment on top of an
 * otherwise `live` site (`ExpertDeploymentStatus` `failed`, `ExpertSiteEntity.status`
 * still `live` from its last good build — a failed redeploy keeps serving the last
 * live version) — the connected half derives it, this half only ever renders the
 * three it's given. Grounded in `ExpertSiteEntity` (`slug`, `status`) +
 * `ExpertSiteConfig.displayName`. A `draft` site has never been live, so unlike
 * `live`/`failed` its address renders as plain text with no "View site" trigger —
 * the same branch `ExpertSiteEditor`'s own visit button already draws on `isLive`.
 */
const meta: Meta<typeof ExpertSiteHeader> = {
    title: "Nivo/Blocks/ExpertSite/ExpertSiteHeader/ExpertSiteHeader",
    component: ExpertSiteHeader,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ExpertSiteHeader>

const LABELS: ExpertSiteHeaderLabels = {
    statusLabels: {
        draft: "Draft",
        live: "Live",
        failed: "Deploy failed",
    },
    viewSiteLabel: "View site",
    publishLabel: "Publish",
    editPageLabel: "Edit page",
    retryLabel: "Retry",
}

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the masthead face" },
    Chip: { tier: "atom", role: "the status badge, toned by lifecycle (live success, failed danger, draft neutral)" },
    Typography: { tier: "atom", role: "the title, the status-keyed address line, and the address as a link once live/failed" },
    Button: { tier: "atom", role: "\"View site\" (live/failed only) + the one primary action, which changes with status" },
}

/** LEAF — the masthead has one shape; draft/live/failed are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertSiteHeader"
                tier="block"
                leaf="Manage-overview masthead"
                annotate={ANNOTATE}
                reason="Blocks take no `className`: the block owns the site's status, so `draft`/`live`/`failed` are states of one shape rather than three components that could disagree with each other. The primary action is always exactly one — `Publish` before the first publish, `Edit page` once live, `Retry` while a redeploy is failing — read straight off `status`, never a second flag a caller could set out of step with it."
                states={[
                    {
                        name: "status = \"draft\"",
                        why: "Claimed a slug, never published. Draft chip, no \"View site\" (nothing has ever been live at this address), and the one primary action is `Publish` — the overview's `claimed-empty` state.",
                        code: `<ExpertSiteHeader
  status="draft"
  displayName="Le Quang"
  host="le-quang.nivo.vn"
  onPublish={publish}
  labels={labels}
/>`,
                        render: (
                            <ExpertSiteHeader
                                status="draft"
                                displayName="Le Quang"
                                host="le-quang.nivo.vn"
                                onPublish={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "status = \"live\"",
                        why: "Published and serving. Success chip, the address is a real link (`View site` + the address line both open it), and the primary swaps to `Edit page` — publishing is done, the next job is content.",
                        code: `<ExpertSiteHeader
  status="live"
  displayName="Le Quang"
  host="le-quang.nivo.vn"
  onViewSite={visit}
  onEditPage={edit}
  labels={labels}
/>`,
                        render: (
                            <ExpertSiteHeader
                                status="live"
                                displayName="Le Quang"
                                host="le-quang.nivo.vn"
                                onViewSite={NOOP}
                                onEditPage={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "status = \"failed\"",
                        why: "A redeploy failed on top of an otherwise live site — the danger chip flags it, `View site` STAYS (the last good build keeps serving), and the primary becomes `Retry` in `danger` tone so the owner can re-trigger it from the masthead itself.",
                        code: `<ExpertSiteHeader
  status="failed"
  displayName="Le Quang"
  host="le-quang.nivo.vn"
  onViewSite={visit}
  onRetryDeploy={retry}
  labels={labels}
/>`,
                        render: (
                            <ExpertSiteHeader
                                status="failed"
                                displayName="Le Quang"
                                host="le-quang.nivo.vn"
                                onViewSite={NOOP}
                                onRetryDeploy={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The overview's own first fetch hasn't resolved yet, so the masthead draws a representative `draft` shape shimmering — title, chip, address line, and the one primary button — matching the loaded row so nothing jumps when the status lands.",
                        code: `<ExpertSiteHeader isSkeleton />`,
                        render: <ExpertSiteHeader isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
