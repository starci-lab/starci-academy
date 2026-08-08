import React from "react"
import { SettingsBreadcrumb } from "@/components/blocks/settings/SettingsBreadcrumb"
import { TierGrid } from "@/components/blocks/commerce/TierGrid"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import { StackV } from "@/components/frames/Stack"

/** All display text this screen owns, already localized by the connected half. */
export interface AiSubscriptionPageLabels {
    /** Page title, also the breadcrumb's current crumb. */
    title: string
    /** One-line subtitle under the title. */
    subtitle: string
    /** Heading when the tier list fails to load. */
    errorTitle: string
    /** Body when the tier list fails to load. */
    errorDescription: string
    /** Label on the retry action. */
    retry: string
}

/** Props for {@link _AiSubscriptionPage} — presentational; no fetch, no store, no i18n. */
export interface AiSubscriptionPageProps {
    /** Truthy → the tier list failed to load; beats the resting state (BLOCK-8). */
    error?: unknown
    /** Retries the tier list. */
    onRetry?: () => void
    /** First load, nothing in hand → the grid rests in place. */
    isSkeleton?: boolean
    labels: AiSubscriptionPageLabels
}

/**
 * `_AiSubscriptionPage` — the AI subscription plans screen: page chrome
 * (breadcrumb + header) above the tier grid.
 *
 * The chrome is static i18n, known before any fetch returns, so it renders
 * immediately and only the GRID rests. The grid rests as itself — the same cards
 * in the same layout — rather than through a mirrored skeleton screen.
 *
 * @param props - {@link AiSubscriptionPageProps}
 */
export const _AiSubscriptionPage = ({
    error,
    onRetry,
    isSkeleton = false,
    labels,
}: AiSubscriptionPageProps) => (
    <StackV
        identity={{ tier: "page", component: "AiSubscriptionPage" }}
        gap={8}
        principle="block-boundary"
        explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
        items={[
            () => (
                <PageHeader
                    breadcrumb={<SettingsBreadcrumb current={labels.title} />}
                    title={labels.title}
                    description={labels.subtitle}
                />
            ),
            // error beats a stale loading flag (BLOCK-8 order)
            () => (error
                ? (
                    <AsyncContentError
                        title={labels.errorTitle}
                        description={labels.errorDescription}
                        onRetry={onRetry}
                        retryLabel={labels.retry}
                    />
                )
                : <TierGrid isSkeleton={isSkeleton} />),
        ]}
    />
)
