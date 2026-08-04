import type { ReactNode } from "react"
import { ArrowClockwiseIcon, ArrowSquareOutIcon, EyeIcon, PencilSimpleIcon, RocketLaunchIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

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

/** The header's own 3-way status vocabulary — see the file header for how `failed` is derived. */
export type ExpertSiteHeaderStatus = "draft" | "live" | "failed"

/** Fields every branch shares — the identity, never the visit/primary actions (those vary by status). */
interface ExpertSiteHeaderIdentity {
    /** Owner-set display name (`ExpertSiteConfig.displayName`) — the masthead title. */
    displayName: string
    /**
     * The site's own address (`ExpertSiteEntity.slug` + host), e.g.
     * `"nguyen-van-an.nivo.vn"`. Rendered as a real link only once the status has
     * ever been live (`live`/`failed`) — a `draft` site has nothing to visit yet.
     */
    host: string
    /** Already-localized copy. */
    labels: ExpertSiteHeaderLabels
}

/**
 * Props for {@link ExpertSiteHeader} — a discriminated union on `status`, the same
 * shape `ExpertSiteManager` uses for its own branch. Before the site's status is
 * known (the overview's own first fetch still in flight) `isSkeleton` renders a
 * representative `draft` masthead, shimmering — so no `status`/data is required
 * in that arm.
 */
export type ExpertSiteHeaderProps =
    | { isSkeleton: true }
    | (ExpertSiteHeaderIdentity & { isSkeleton?: false } & (
        | { status: "draft"; onPublish: () => void; isPublishing?: boolean }
        | { status: "live"; onViewSite: () => void; onEditPage: () => void }
        | { status: "failed"; onViewSite: () => void; onRetryDeploy: () => void; isRetrying?: boolean }
    ))

/** The already-resolved copy the masthead renders. */
export interface ExpertSiteHeaderLabels {
    /** Status chip copy, keyed by {@link ExpertSiteHeaderStatus}. */
    statusLabels: Record<ExpertSiteHeaderStatus, string>
    /** "View site" button label — `live`/`failed` only. */
    viewSiteLabel: string
    /** Primary button label, `draft` status — publish the site for the first time. */
    publishLabel: string
    /** Primary button label, `live` status — open the content editor. */
    editPageLabel: string
    /** Primary button label, `failed` status — re-run the failed deployment. */
    retryLabel: string
}

/** Status → chip tone: live is the healthy resting state, failed needs attention, draft is neutral. */
const STATUS_TONE: Record<ExpertSiteHeaderStatus, ChipTone> = {
    draft: "default",
    live: "success",
    failed: "danger",
}

/**
 * The manage-overview masthead. See the file header for why `draft`/`live`/`failed`
 * are states of one shape rather than three leaves.
 *
 * @param props - {@link ExpertSiteHeaderProps}
 */
const ExpertSiteHeader = (props: ExpertSiteHeaderProps) => {
    // ── LOADING (§12b): status isn't known yet, so the masthead shows a
    // representative `draft` shape with every node shimmering — title, chip,
    // address line (plain, as `draft` renders it), and the primary button.
    if (props.isSkeleton) {
        return (
            <div data-tier="block" data-component="ExpertSiteHeader">
                <SurfaceCard
                    padding={3}
                    isSkeleton
                    body={() => (
                        <StackH
                            gap={4}
                            justify="between"
                            at="sm"
                            isSkeleton
                            items={[
                                () => (
                                    <StackV
                                        gap={2}
                                        isSkeleton
                                        classNames={["min-w-0"]}
                                        items={[
                                            () => (
                                                <StackH
                                                    gap={3}
                                                    isSkeleton
                                                    items={[
                                                        () => <Typography size="lg" weight="semibold" isSkeleton text="Site name" />,
                                                        () => <Chip tone="default" isSkeleton text="Status" />,
                                                    ]}
                                                />
                                            ),
                                            () => <Typography size="sm" color="muted" isSkeleton text="host.nivo.vn" />,
                                        ]}
                                    />
                                ),
                                () => (
                                    <StackH
                                        gap={3}
                                        isSkeleton
                                        classNames={["shrink-0"]}
                                        items={[
                                            () => <Button variant="primary" prefixIcon={RocketLaunchIcon} label="Publish" isSkeleton onPress={() => {}} />,
                                        ]}
                                    />
                                ),
                            ]}
                        />
                    )}
                />
            </div>
        )
    }

    const { displayName, host, labels } = props

    // ── PER-STATE PRIMARY + VISIT: resolved once here, from `props.status` (not a
    // destructured copy, so the discriminated union narrows the SAME branch each
    // callback below reads from) — the badge and the buttons can never disagree
    // about which status is on screen.
    let primary: ReactNode
    let onViewSite: (() => void) | undefined
    if (props.status === "draft") {
        primary = (
            <Button
                variant="primary"
                prefixIcon={RocketLaunchIcon}
                label={labels.publishLabel}
                onPress={props.onPublish}
                isPending={props.isPublishing}
            />
        )
    } else if (props.status === "live") {
        primary = (
            <Button
                variant="primary"
                prefixIcon={PencilSimpleIcon}
                label={labels.editPageLabel}
                onPress={props.onEditPage}
            />
        )
        onViewSite = props.onViewSite
    } else {
        primary = (
            <Button
                variant="danger"
                prefixIcon={ArrowClockwiseIcon}
                label={labels.retryLabel}
                onPress={props.onRetryDeploy}
                isPending={props.isRetrying}
            />
        )
        onViewSite = props.onViewSite
    }
    const status = props.status

    return (
        <div data-tier="block" data-component="ExpertSiteHeader">
            <SurfaceCard
                padding={3}
                body={() => (
                    <StackH
                        gap={4}
                        justify="between"
                        at="sm"
                        items={[
                            () => (
                                <StackV
                                    gap={2}
                                    classNames={["min-w-0"]}
                                    items={[
                                        () => (
                                            <StackH
                                                gap={3}
                                                items={[
                                                    () => <Typography size="lg" weight="semibold" truncate text={displayName} />,
                                                    () => <Chip tone={STATUS_TONE[status]} text={labels.statusLabels[status]} />,
                                                ]}
                                            />
                                        ),
                                        () => (
                                            onViewSite ? (
                                                <Typography
                                                    size="sm"
                                                    isLink
                                                    color="muted"
                                                    underlineOnHover
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    href={`https://${host}`}
                                                    onPress={onViewSite}
                                                    suffixIcon={ArrowSquareOutIcon}
                                                    text={host}
                                                />
                                            ) : (
                                                <Typography size="sm" color="muted" text={host} />
                                            )
                                        ),
                                    ]}
                                />
                            ),
                            () => (
                                <StackH
                                    gap={3}
                                    classNames={["shrink-0"]}
                                    items={[
                                        ...(onViewSite
                                            ? [() => (
                                                <Button
                                                    variant="ghost"
                                                    prefixIcon={EyeIcon}
                                                    label={labels.viewSiteLabel}
                                                    onPress={onViewSite}
                                                />
                                            )]
                                            : []),
                                        () => primary,
                                    ]}
                                />
                            ),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { ExpertSiteHeader }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ExpertSiteHeader" } as const
