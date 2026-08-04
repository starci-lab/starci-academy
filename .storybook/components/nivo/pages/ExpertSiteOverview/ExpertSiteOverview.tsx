import type { ReactNode } from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import type { SkeletonProps } from "@sb-components/composites/_slot"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { SplitWorkspace } from "@sb-components/frames/SplitWorkspace/SplitWorkspace"
import { StackV } from "@sb-components/frames/Stack/Stack"
import {
    ExpertSiteHeader,
    type ExpertSiteHeaderLabels,
    type ExpertSiteHeaderStatus,
} from "@sb-components/nivo/blocks/expert-site/ExpertSiteHeader/ExpertSiteHeader"
import {
    LeadsInboxCard,
    type LeadsInboxCardLabels,
    type LeadsInboxCounts,
} from "@sb-components/nivo/blocks/expert-site/LeadsInboxCard/LeadsInboxCard"
import {
    DeployStatusCard,
    type DeployStatusCardLabels,
    type DeployStatusSnapshot,
} from "@sb-components/nivo/blocks/expert-site/DeployStatusCard/DeployStatusCard"
import {
    OfferingsSummaryCard,
    type OfferingsSummaryCardLabels,
} from "@sb-components/nivo/blocks/expert-site/OfferingsSummaryCard/OfferingsSummaryCard"
import {
    ExpertSiteEditor,
    type ExpertSiteEditorProps,
} from "@sb-components/nivo/blocks/expert-site/ExpertSiteEditor/ExpertSiteEditor"
import {
    ExpertSiteView,
    type ExpertSiteViewProps,
} from "@sb-components/nivo/pages/ExpertSiteView/ExpertSiteView"

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

/** The overview's own status vocabulary — identical to {@link ExpertSiteHeaderStatus}, since the masthead's status drives this page's one primary action. */
export type ExpertSiteOverviewStatus = ExpertSiteHeaderStatus

/** Site identity forwarded into the masthead. */
export interface ExpertSiteOverviewSite {
    /** Owner-set display name (`ExpertSiteConfig.displayName`). */
    displayName: string
    /** The site's own address (`ExpertSiteEntity.slug` + host). */
    host: string
}

/** Already-localized copy for every region this page arranges. */
export interface ExpertSiteOverviewLabels {
    /** Forwarded to `ExpertSiteHeader`. */
    header: ExpertSiteHeaderLabels
    /** Forwarded to `LeadsInboxCard`. */
    leads: LeadsInboxCardLabels
    /** Forwarded to `DeployStatusCard`. */
    deploy: DeployStatusCardLabels
    /** Forwarded to `OfferingsSummaryCard`. */
    offerings: OfferingsSummaryCardLabels
    /** `failed` banner title, shown above the tiles when the last deploy failed. */
    failedBannerTitle: string
    /** `failed` banner supporting line. */
    failedBannerDescription: string
    /** `failed` banner CTA label — fires the same `onRetryDeploy` as the masthead. */
    failedBannerRetryLabel: string
}

/** Fields every status branch shares. */
interface ExpertSiteOverviewCommon {
    /** The site's identity — forwarded to `ExpertSiteHeader`. */
    site: ExpertSiteOverviewSite
    /** Lead pipeline counts (`ExpertSiteLeadEntity`, grouped by status) — forwarded to `LeadsInboxCard`. */
    leadsCounts: LeadsInboxCounts
    /** Drill into the leads CRM — forwarded to `LeadsInboxCard`. */
    onOpenCrm: () => void
    /** The current deployment, or `null` before the site has ever been published — forwarded to `DeployStatusCard`. */
    deployment: DeployStatusSnapshot | null
    /** Offering count (`ExpertSiteOfferingEntity`) — forwarded to `OfferingsSummaryCard`. */
    offeringsCount: number
    /** Drill into the offerings editor — forwarded to `OfferingsSummaryCard`. */
    onOpenOfferingsEditor: () => void
    /** The owner-side content form — forwarded whole to `ExpertSiteEditor`. */
    editor: ExpertSiteEditorProps
    /** The public-site preview data — forwarded to `ExpertSiteView`; this page's own `isSkeleton` drives that page's `isLoading`. */
    preview: Omit<ExpertSiteViewProps, "isLoading">
    /** Already-localized copy. */
    labels: ExpertSiteOverviewLabels
    /**
     * `true` → the overview's own first fetch is in flight: `ExpertSiteHeader` and
     * the three tiles mirror their loaded shape while shimmering (co-located
     * `isSkeleton`, threaded straight down); the config/preview split mirrors the
     * same layout — `ExpertSiteView` via its own `isLoading`, `ExpertSiteEditor`
     * via a generic placeholder since that block has no loading branch of its own.
     */
    isSkeleton?: boolean
}

/**
 * Props for {@link ExpertSiteOverview} — data always resolved (matches the real
 * page's own `Dashboard`/`ExpertSiteView` convention: `isSkeleton` mirrors an
 * already-typed tree rather than swapping the shape out), discriminated on
 * `status` for the ONE primary action + the handlers that vary with it — the
 * same three-way split `ExpertSiteHeader` itself owns.
 */
export type ExpertSiteOverviewProps = ExpertSiteOverviewCommon &
    (
        | { status: "draft"; onPublish: () => void; isPublishing?: boolean }
        | { status: "live"; onViewSite: () => void; onEditPage: () => void }
        | { status: "failed"; onViewSite: () => void; onRetryDeploy: () => void; isRetrying?: boolean }
    )

/**
 * Generic shimmer mirror for the config column while the overview's own first
 * fetch is in flight. `ExpertSiteEditor` renders only resolved site content — it
 * has no `isSkeleton` branch of its own — so this page draws a representative
 * placeholder here, the same way `Dashboard`/`ExpertSiteView` mirror their own
 * loading shape ahead of a child that cannot yet.
 */
const EditorLoadingMirror = () => (
    <SurfaceCard
        padding={3}
        isSkeleton
        body={() => (
            <StackV
                gap={3}
                isSkeleton
                items={[
                    () => <Typography size="sm" isSkeleton />,
                    () => <Typography size="sm" isSkeleton />,
                    () => <Typography size="sm" isSkeleton />,
                ]}
            />
        )}
    />
)

/**
 * The `/expert-site` manage overview. See the file header for why the header's
 * status drives this page's one primary action, and how `isSkeleton` mirrors the
 * loaded shape through each named block.
 *
 * @param props - {@link ExpertSiteOverviewProps}
 */
const ExpertSiteOverview = (props: ExpertSiteOverviewProps) => {
    const {
        site,
        leadsCounts,
        onOpenCrm,
        deployment,
        offeringsCount,
        onOpenOfferingsEditor,
        editor,
        preview,
        labels,
        isSkeleton = false,
    } = props

    const shell = (children: ReactNode) => (
        <div data-tier="page" data-component="ExpertSiteOverview" className="flex w-full flex-col gap-6">
            {children}
        </div>
    )

    // ── MASTHEAD: `status` picks which arm `ExpertSiteHeader` renders. Read off
    // `props.status` directly (not a destructured copy) so the union narrows the
    // SAME branch every handler below reads from.
    const header: ReactNode = isSkeleton ? (
        <ExpertSiteHeader isSkeleton />
    ) : props.status === "draft" ? (
        <ExpertSiteHeader
            status="draft"
            displayName={site.displayName}
            host={site.host}
            labels={labels.header}
            onPublish={props.onPublish}
            isPublishing={props.isPublishing}
        />
    ) : props.status === "live" ? (
        <ExpertSiteHeader
            status="live"
            displayName={site.displayName}
            host={site.host}
            labels={labels.header}
            onViewSite={props.onViewSite}
            onEditPage={props.onEditPage}
        />
    ) : (
        <ExpertSiteHeader
            status="failed"
            displayName={site.displayName}
            host={site.host}
            labels={labels.header}
            onViewSite={props.onViewSite}
            onRetryDeploy={props.onRetryDeploy}
            isRetrying={props.isRetrying}
        />
    )

    // ── SHARED RETRY: the masthead's `onRetryDeploy`, the deploy tile's `onRetry`,
    // and the failed banner's action are the SAME operation — retrying the one
    // failed deployment (`ExpertSiteHeader`'s own file header: `failed` is a
    // deployment failure riding on top of an otherwise `live` site). Only the
    // `failed` branch ever surfaces a retry trigger, so the other branches never
    // call this.
    const onRetryDeploy = !isSkeleton && props.status === "failed" ? props.onRetryDeploy : () => {}

    // ── PEERS GRID: three operating-loop tiles, `LeadsInboxCard` spanning double
    // width — the leads pipeline is the volume region (proposal §Volume), so it
    // reads as the largest tile against the other two.
    const LeadsTile = ({ isSkeleton: skeleton }: SkeletonProps) => (
        <LeadsInboxCard counts={leadsCounts} onOpenCrm={onOpenCrm} isSkeleton={skeleton} labels={labels.leads} />
    )
    const DeployTile = ({ isSkeleton: skeleton }: SkeletonProps) => (
        <DeployStatusCard deployment={deployment} onRetry={onRetryDeploy} isSkeleton={skeleton} labels={labels.deploy} />
    )
    const OfferingsTile = ({ isSkeleton: skeleton }: SkeletonProps) => (
        <OfferingsSummaryCard
            count={offeringsCount}
            onOpenEditor={onOpenOfferingsEditor}
            isSkeleton={skeleton}
            labels={labels.offerings}
        />
    )

    // ── CONFIG/PREVIEW SPLIT: the owner's editor leads, the public-site preview
    // pins beside it — `SplitWorkspace`'s named `main`/`aside`, not a shape this
    // page draws itself.
    const EditorSlot = ({ isSkeleton: skeleton }: SkeletonProps) =>
        skeleton ? <EditorLoadingMirror /> : <ExpertSiteEditor {...editor} />
    const PreviewSlot = ({ isSkeleton: skeleton }: SkeletonProps) => <ExpertSiteView {...preview} isLoading={skeleton} />

    return shell(
        <StackV
            gap={6}
            items={[
                () => header,
                // ── FAILED-DEPLOY BANNER: only in the `failed` state, never the
                // skeleton mirror (loading mirrors `live`'s shape, per the proposal).
                ...(!isSkeleton && props.status === "failed"
                    ? [
                        () => (
                            <Callout
                                status="danger"
                                title={labels.failedBannerTitle}
                                description={labels.failedBannerDescription}
                                actionLabel={labels.failedBannerRetryLabel}
                                onAction={props.onRetryDeploy}
                            />
                        ),
                    ]
                    : []),
                () => (
                    <Grid
                        columns={{ base: 1, sm: 2, lg: 4 }}
                        gap={4}
                        isSkeleton={isSkeleton}
                        items={[
                            { key: "leads", span: 2, content: LeadsTile },
                            { key: "deploy", content: DeployTile },
                            { key: "offerings", content: OfferingsTile },
                        ]}
                    />
                ),
                () => <SplitWorkspace main={EditorSlot} aside={PreviewSlot} isSkeleton={isSkeleton} />,
            ]}
        />,
    )
}

export { ExpertSiteOverview }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "page", name: "ExpertSiteOverview" } as const
