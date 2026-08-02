import React from "react"
import { ModalShell } from "@/components/composites/layout/ModalShell"
import { Tabs, type TabItem } from "@/components/atoms/navigation/Tabs"
import { Typography } from "@/components/atoms/text/Typography"
import { Chip } from "@/components/atoms/chips/Chip"
import { LinkSeeMore } from "@/components/atoms/navigation/Link"
import { StackH, StackV } from "@/components/frames/Stack"
import { AiQuotaLane, type AiQuotaLaneData } from "@/components/starci/blocks/ai/AiQuotaLane"
import { AiQuotaSubscriptionPanel } from "@/components/starci/blocks/ai/AiQuotaSubscriptionPanel"
import {
    AiQuotaHistoryPanel,
    type AiQuotaHistoryChartPoint,
    type AiQuotaHistoryChargeItem,
} from "@/components/starci/blocks/ai/AiQuotaHistoryPanel"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * `AiQuotaModal` — the root overlay for "how much AI have I used": a dialog with the
 * current tier beside its title, a 3-way tab strip (Auto / Subscription / History),
 * and one link out to the full-usage page. Composes `ModalShell` + `Tabs` + the three
 * sibling `ai` blocks it switches between (`AiQuotaLane`, `AiQuotaSubscriptionPanel`,
 * `AiQuotaHistoryPanel`).
 *
 * Presentational: `isOpen`/`onOpenChange`/`activeTab`/`onTabChange`, plus each tab's
 * `isLoading`. `tier: null` reads as the free plan and shows no badge.
 */

/** Which paid AI plan the viewer is on. `null` = free plan, no badge shown. */
export type AiQuotaTier = "plus" | "pro" | "max" | null

/** The three tabs this modal switches between. */
export type AiQuotaModalTab = "auto" | "subscription" | "history"

/** Auto tab's data — the lane the free/auto model draws against. */
export interface AiQuotaModalAutoState {
    /** The lane's two rolling windows. Unset while `isLoading` (or before the first fetch lands). */
    data?: AiQuotaLaneData
    /** `true` → this tab's own fetch is in flight. */
    isLoading: boolean
}

/** Subscription tab's data — the same lane shape, read against the paid plan's own cap. */
export interface AiQuotaModalSubscriptionState {
    /** The lane's two rolling windows, once subscribed. Unset on the free plan or before load. */
    data?: AiQuotaLaneData
    /** `true` → this tab's own fetch is in flight. */
    isLoading: boolean
}

/** History tab's data — the usage chart plus the recent-charges list. */
export interface AiQuotaModalHistoryState {
    /** Day-buckets for the usage chart. */
    chartPoints?: Array<AiQuotaHistoryChartPoint>
    /** Recent charges, most recent first. `undefined` while the first load is still running. */
    items?: Array<AiQuotaHistoryChargeItem>
    /** `true` while the charges list's first load is running. */
    isLoading: boolean
}

/** Props for {@link _AiQuotaModal}. */
export interface AiQuotaModalProps {
    /** Whether the modal is currently open. Forwarded to {@link ModalShell}. */
    isOpen: boolean
    /** Open-state change handler — backdrop click, Escape, close button. Forwarded to {@link ModalShell}. */
    onOpenChange: (open: boolean) => void
    /** The viewer's current plan. Drives the header's tier chip (hidden when `null`). */
    tier: AiQuotaTier
    /** Which tab is showing. The CALLER owns this — the block never picks its own tab (Rule 7). */
    activeTab: AiQuotaModalTab
    /** Fired with the tab the viewer picked. */
    onTabChange: (tab: AiQuotaModalTab) => void
    /** Auto tab's lane data. */
    auto: AiQuotaModalAutoState
    /**
     * Subscription tab's Premium lane data — shape matches
     * `AiQuotaSubscriptionPanel`'s own `premiumLane` prop 1:1 (forwarded
     * straight through, unreshaped); `tier` above decides whether that panel
     * even reaches its lane leaf or shows the no-tier CTA instead.
     */
    subscription: AiQuotaModalSubscriptionState
    /** History tab's chart + charges data. */
    history: AiQuotaModalHistoryState
    /** Fired when the subscription tab's upgrade CTA is pressed. The caller owns what happens next (Rule 7). */
    onSubscribe: () => void
    /** Fired when the "view full usage" link is pressed. */
    onViewDetails: () => void
    /** Extra classes merged onto the dialog. */
    classNames?: Array<AllowedClassName>
}

/** Tab → label. The block's own vocabulary (§14d.1), same pattern as `ContentModeNav`'s `MODE_LABEL`. */
const TAB_LABEL: Record<AiQuotaModalTab, string> = {
    auto: "Auto",
    subscription: "Subscription",
    history: "History",
}

/** Fixed tab order — a 3-way switch, not caller-supplied labels (§14d.1). */
const TAB_ITEMS: Array<TabItem> = [
    { key: "auto", label: TAB_LABEL.auto },
    { key: "subscription", label: TAB_LABEL.subscription },
    { key: "history", label: TAB_LABEL.history },
]

/** Paid tier → its badge label. */
const TIER_LABEL: Record<Exclude<AiQuotaTier, null>, string> = {
    plus: "Plus",
    pro: "Pro",
    max: "Max",
}

/**
 * The quota-modal scaffold. See the file header for the full contract and the
 * judgement calls made composing it out of the `ai`-group sibling blocks.
 *
 * @param props - {@link AiQuotaModalProps}
 */
const _AiQuotaModal = ({
    isOpen,
    onOpenChange,
    tier,
    activeTab,
    onTabChange,
    auto,
    subscription,
    history,
    onSubscribe,
    onViewDetails,
    classNames,
}: AiQuotaModalProps) => {
    // Caller-built header (title + optional tier chip): `ModalShell.title` only carries ONE
    // Typography node, so a second element beside it (the chip) has to compose its own
    // wrapper — which then owns its own `pr-8` for the close button, per ModalShell's
    // caller-built-header contract.
    const titleAndTierChip = [
        () => (
            <Typography
                size="base"
                weight="bold"
                text="AI usage"

            />
        ),
        ...(tier != null ? [() => (
            <Chip tone="accent" text={TIER_LABEL[tier]} />
        )] : []),
    ]

    const header = (
        <div className="pr-8">
            <StackH
                gap={3}
                principles={["identity"]}
                align="center"
                items={titleAndTierChip}
            />
        </div>
    )

    // The one panel slot, filled by whichever sibling block the active tab names. The wrapper
    // shape around it never changes (§11f) — see file header.
    const panel =
        activeTab === "auto" ? (
            <AiQuotaLane
                data={auto.data}
                isLoading={auto.isLoading}


            />
        ) : activeTab === "subscription" ? (
            <AiQuotaSubscriptionPanel
                tier={tier}
                premiumLane={subscription}
                onSubscribe={onSubscribe}


            />
        ) : (
            <AiQuotaHistoryPanel
                chartPoints={history.chartPoints}
                items={history.items}
                isLoading={history.isLoading}


            />
        )

    const tabsAndPanel = [
        () => (
            <div>
                <Tabs
                    items={TAB_ITEMS}
                    selectedKey={activeTab}
                    onSelectionChange={(key) => onTabChange(key as AiQuotaModalTab)}
                    ariaLabel="AI usage"
                />
            </div>
        ),
        () => panel,
    ]

    return (
        <div data-tier="modal" data-component="AiQuotaModal">
            <ModalShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                header={() => header}
                size="lg"
                scroll="inside"
                classNames={classNames}
                footer={() => (
                    <LinkSeeMore
                        label="View full usage"
                        onPress={onViewDetails}
                        size="sm"

                    />
                )}
                body={() => <StackV gap={6} items={tabsAndPanel} />}
            />
        </div>
    )
}

export { _AiQuotaModal }
