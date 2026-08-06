import React from "react"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import { InfoTooltip } from "@/components/blocks/feedback/InfoTooltip"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { ResponsiveBreadcrumb } from "@/components/blocks/navigation/ResponsiveBreadcrumb"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { ProgressBar } from "@/components/atoms/display/Progress"
import { Container } from "@/components/frames/Container"
import { StackV, StackH } from "@/components/frames/Stack"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import type { KpiKey } from "@/modules/api/graphql/queries/types/my-kpis"

/** Leading glyph a KPI row carries — matches `KPI_META`'s own `Icon` field shape. */
export type KpiRowIcon = React.ComponentType<{ className?: string }>

/** One quick-pick preset target button, already resolved to its disabled state. */
export interface KpiRowPreset {
    /** The preset's target value (e.g. `5`). */
    value: number
    /** `true` while a DIFFERENT preset (on this row or another) is mid-save. */
    isDisabled: boolean
}

/**
 * One weekly-KPI row, fully resolved by the connected {@link KpiPage}: icon + label,
 * current/target, its preset buttons, and its coin-reward claim state.
 */
export interface KpiRowData {
    /** The KPI key (matches BE `KpiKey`) — also the React key. */
    key: KpiKey
    /** Leading icon, decorative chrome (not data — shown regardless of load state). */
    icon: KpiRowIcon
    /** Already-translated row label. */
    label: string
    /** Current-week value. */
    current: number
    /** Effective target — the learner's custom goal, or a sensible default. */
    target: number
    /** Quick-pick target presets, each already carrying its disabled state. */
    presets: Array<KpiRowPreset>
    /** Persist a newly chosen preset target for this row. */
    onChoosePreset: (target: number) => void
    /** Already-translated "N coins" reward line; omitted → no coin-reward row (no target set server-side yet). */
    coinRewardText?: string
    /** `true` → the reward was already claimed this week. */
    claimed: boolean
    /** `true` → the reward is met and not yet claimed (shows the Claim button). */
    canClaim: boolean
    /** `true` while THIS row's claim mutation is in flight. */
    isClaiming: boolean
    /** `true` while a DIFFERENT row's claim mutation is in flight. */
    isClaimDisabled: boolean
    /** Claim this row's coin reward. */
    onClaim: () => void
}

/** All display text, already localized by the connected {@link KpiPage}; a story passes i18n keys. */
export interface KpiLabels {
    /** Page title, also the breadcrumb's current crumb and the info-tooltip heading. */
    title: string
    /** Info-tooltip explanation body for the title. */
    tooltipDescription: string
    /** Breadcrumb root ("Home") label. */
    homeLabel: string
    /** Full composite-score + reset-countdown sentence under the title. */
    description: string
    errorTitle: string
    retry: string
    /** Claim-button label, shared by every row. */
    claimLabel: string
    /** "Claimed" caption, shared by every row. */
    claimedLabel: string
}

/** Props for {@link _KpiPage} — presentational; all data resolved, no fetch/store/i18n. */
export interface KpiPageProps {
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Truthy → the error message (beats loading). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler — paired with `labels.retry` to show a retry button on the error branch. */
    onRetry?: () => void
    /** Navigate to the dashboard (breadcrumb root). */
    onNavigateHome: () => void
    /** The six weekly-KPI rows, in display order. */
    rows: Array<KpiRowData>
    labels: KpiLabels
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
}

/**
 * One row's inner content — leading icon + label, current/target, the progress bar,
 * the quick-pick preset buttons, and the coin-reward claim line. `SurfaceListCardItem`
 * (the row's own frame) and `FlexWrapButtonRadio` carry no `isSkeleton` of their own
 * (`missingSkeletonSupport`), so the preset row is mirrored inline with `Skeleton.Button`
 * right where it sits rather than built as a second, hand-kept tree.
 */
const kpiRowBody = (row: KpiRowData, isSkeleton: boolean, labels: KpiLabels) => {
    const labelValueRow = () => (
        <StackH justify="between" gap={4} principle="content-row"
            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
            items={[
                () => (
                    <StackH gap={3} principle="identity"
                        explain="Keeps avatar and identity text as one peer unit so the person label stays beside the face."
                        items={[
                            () => <row.icon className="size-5 shrink-0 text-foreground" />,
                            () => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={row.label} />,
                        ]}
                    />
                ),
                () => (
                    <Typography
                        size="sm"
                        color="muted"
                        isSkeleton={isSkeleton}
                        classNames={isSkeleton ? ["w-1/4"] : undefined}
                        text={`${row.current}/${row.target}`}
                    />
                ),
            ]}
        />
    )

    const presetRow = () => (
        isSkeleton ? (
            <StackH gap={3} principle="flex-action"
                explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                items={row.presets.map((preset) => () => (
                    <Skeleton.Button key={preset.value} width="w-16" />
                ))}
            />
        ) : (
            <FlexWrapButtonRadio
                ariaLabel={row.label}
                value={String(row.target)}
                onChange={(value) => row.onChoosePreset(Number(value))}
                items={row.presets.map((preset) => ({
                    value: String(preset.value),
                    content: preset.value,
                    isDisabled: preset.isDisabled,
                }))}
            />
        )
    )

    const coinRow = () => (
        <StackH justify="between" gap={3} principle="flex-action"
            explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
            items={[
                () => (
                    <Typography
                        size="xs"
                        color={row.canClaim ? "accent-soft" : "muted"}
                        text={row.coinRewardText as string}
                    />
                ),
                ...(row.claimed
                    ? [() => <Typography size="xs" color="muted" text={labels.claimedLabel} />]
                    : row.canClaim
                        ? [() => (
                            <Button
                                variant="primary"
                                size="sm"
                                isPending={row.isClaiming}
                                isDisabled={row.isClaimDisabled}
                                onPress={row.onClaim}
                                label={labels.claimLabel}
                            />
                        )]
                        : []),
            ]}
        />
    )

    const rowItems = [
        labelValueRow,
        () => (
            <ProgressBar
                ariaLabel={row.label}
                value={row.current}
                max={row.target || 1}
                color="accent"
                size="sm"
                isSkeleton={isSkeleton}
            />
        ),
        presetRow,
        ...(!isSkeleton && row.coinRewardText ? [coinRow] : []),
    ]

    return <StackV gap={4} items={rowItems} />
}

/**
 * The `/kpi` editor page body — the presentational half of {@link KpiPage}: the
 * composite score header, then one joined row per weekly KPI (icon · label ·
 * current/target · progress · preset target buttons · coin-reward claim).
 * `PageHeader`/`ResponsiveBreadcrumb`/`InfoTooltip` carry no `isSkeleton` of their
 * own (`missingSkeletonSupport`), so the header zone is mirrored inline with
 * `Skeleton.*` right where it sits, rather than a separate hand-kept skeleton tree.
 * See `tiers/split.md` — the connected `index.tsx` owns the fetch, the mutations,
 * and i18n.
 *
 * @param props - {@link KpiPageProps}
 */
export const _KpiPage = ({
    isSkeleton = false,
    error,
    onRetry,
    onNavigateHome,
    rows,
    labels,
    classNames,
}: KpiPageProps) => {
    // error beats a stale loading flag (BLOCK-8) — the shared `AsyncContentError`
    // frame, not hand-written JSX (loading-and-skeleton.md §6).
    if (error) {
        return (
            <AsyncContentError
                title={labels.errorTitle}
                onRetry={onRetry}
                retryLabel={labels.retry}
            />
        )
    }

    const headerZone = () => (
        isSkeleton ? (
            <StackV gap={4} items={[
                () => <Skeleton.Breadcrumbs count={2} />,
                () => <Skeleton.Typography type="h3" width="1/3" />,
                () => <Skeleton.Typography type="body-sm" width="1/2" />,
            ]}
            />
        ) : (
            <PageHeader
                breadcrumb={(
                    <ResponsiveBreadcrumb
                        items={[
                            {
                                key: "home",
                                label: labels.homeLabel,
                                onPress: onNavigateHome,
                            },
                            {
                                key: "kpi",
                                label: labels.title,
                            },
                        ]}
                    />
                )}
                title={(
                    <InfoTooltip title={labels.title} description={labels.tooltipDescription}>
                        {labels.title}
                    </InfoTooltip>
                )}
                description={labels.description}
            />
        )
    )

    return (
        <Container
            identity={{ tier: "page", component: "KpiPage" }}
            size="sm"
            padding={6}
            isSkeleton={isSkeleton}
            classNames={classNames}
            body={() => (
                <StackV gap={7} items={[
                    headerZone,
                    () => (
                        <SurfaceListCard>
                            {rows.map((row) => (
                                <SurfaceListCardItem key={row.key}>
                                    {kpiRowBody(row, isSkeleton, labels)}
                                </SurfaceListCardItem>
                            ))}
                        </SurfaceListCard>
                    ),
                ]}
                />
            )}
        />
    )
}
