import React from "react"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import { Tabs, type TabItem } from "@sb-components/atoms/navigation/Tabs/Tabs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { LinkSeeMore } from "@sb-components/atoms/navigation/Link/Link"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { AiQuotaLane, type AiQuotaLaneData } from "@sb-components/starci/blocks/ai/AiQuotaLane/AiQuotaLane"
import { AiQuotaSubscriptionPanel } from "@sb-components/starci/blocks/ai/AiQuotaSubscriptionPanel/AiQuotaSubscriptionPanel"
import {
    AiQuotaHistoryPanel,
    type AiQuotaHistoryChartPoint,
    type AiQuotaHistoryChargeItem,
} from "@sb-components/starci/blocks/ai/AiQuotaHistoryPanel/AiQuotaHistoryPanel"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `AiQuotaModal`: the root overlay for "how much AI have I used" — a
 * dialog with the current tier next to its title, a 3-way tab strip (Auto /
 * Subscription / History), and one link out to the full-usage page.
 *
 * RULE 13 CONTRACT — plain `isOpen`/`onOpenChange`/`activeTab`/`onTabChange`,
 * no store wiring. The real app opens this from `useAiQuotaOverlayState()`
 * (Zustand) and feeds each tab from its own SWR hook; that wiring, plus WHICH
 * tab is selected, is APP STATE the caller owns — this block only renders
 * whatever tab it is told is active, exactly like `ContentModeNav` never
 * decides its own `mode`.
 *
 * ⚠️ FILED UNDER `overlays/modals`, NOT `blocks/ai` (same call as
 * `PremiumGateModal`/`FoundationModal` — see their file headers). This is one
 * of the 21 global modals measured in
 * `.claude/fe/steps/11-overlays-layouts-brainstorm.md` §2A, mounted once at the
 * app root and opened from anywhere; it is not a domain block that belongs
 * beside its own tab panels.
 *
 * COMPOSED FROM: `ModalShell` (dialog scaffold) · `Tabs` atom (3 data-driven
 * items — the same tab-strip atom `ContentModeNav` builds on) · `Typography` +
 * `Chip` atoms (title + tier badge) · `LinkSeeMore` atom ("view full usage") ·
 * three SIBLING BLOCKS under the `ai` group this modal's tabs switch between:
 * `AiQuotaLane` (Auto tab), `AiQuotaSubscriptionPanel` (Subscription tab),
 * `AiQuotaHistoryPanel` (History tab). This modal does not know what a quota
 * bar or a usage chart looks like — it only knows there are three tabs and
 * which one is showing.
 *
 * ⭐ HEADER IS A CUSTOM `header` NODE, NOT `title`. `ModalShell.title` funnels
 * through `Typography`'s `text` prop alone; this header needs a SECOND element
 * beside the title (the tier chip), so it composes its own `StackH` and — per
 * `ModalShell`'s own contract for a caller-built header — supplies its own
 * `pr-8` to leave room for the close button (see `ModalShell`'s `CustomHeader`
 * story).
 *
 * ⭐ THE TIER CHIP IS CONDITIONAL, NOT A FOURTH STATE. `tier: null` reads as the
 * free plan, which carries no badge at all — same "a null/zero fact draws
 * nothing" rule `ContentModeNav` applies to a zero challenge count.
 *
 * 📐 ONE LEAF (matches the `FoundationModal`/`PremiumGateModal` precedent — no
 * structural `kind` switch). The wrapper shape (header, tab strip, panel slot,
 * footer link) never changes; `activeTab` only decides WHICH sibling block
 * fills the one panel slot, exactly the reasoning `FoundationModal`'s own file
 * header spells out for its `kind` prop. `tier` and each tab's `isLoading` are
 * further STATES of that same one leaf.
 *
 * ⭐ NO PASSTHROUGH LEAF FOR THE AUTO TAB. The task brief names an "AutoPanel"
 * leaf, but `src`'s own `AutoTab` was a literal one-line forward to
 * `QuotaLane`/`AiQuotaLane` — porting it as its own file would trip
 * `check-passthrough-block` for no behaviour gained, so the Auto branch below
 * renders `AiQuotaLane` directly wherever the task brief's "AutoPanel" would
 * have sat.
 *
 * ⭐ JUDGEMENT CALL — GROUP + SHARED TYPE OWNERSHIP. `AiQuotaLane`,
 * `AiQuotaSubscriptionPanel` and `AiQuotaHistoryPanel` all live under a
 * sibling `blocks/ai/` group (built as parallel tasks in this same fan-out)
 * and are the real owners of `AiQuotaLaneData` / `AiQuotaHistoryChartPoint` /
 * `AiQuotaHistoryChargeItem` — imported from them here rather than
 * redeclared, so there is exactly one definition of each shape (§5). This
 * modal composes each by import path only, matching that group's own
 * convention; none of the three were built or edited by this task.
 * ─────────────────────────────────────────────────────────────────────────────
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

/** Props for {@link AiQuotaModal}. */
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
    className?: string
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
const AiQuotaModal = ({
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
    className,
}: AiQuotaModalProps) => {
    // Caller-built header (title + optional tier chip): `ModalShell.title` only carries ONE
    // Typography node, so a second element beside it (the chip) has to compose its own
    // wrapper — which then owns its own `pr-8` for the close button, per ModalShell's
    // caller-built-header contract.
    const titleAndTierChip = (
        <>
            <Typography
                size="base"
                weight="bold"
                text="AI usage"

            />
            {tier != null ? (
                <Chip tone="accent" text={TIER_LABEL[tier]} />
            ) : null}
        </>
    )

    const header = (
        <StackH
            gap={3}
            align="center"
            className="pr-8"

            body={titleAndTierChip}
        />
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

    const tabsAndPanel = (
        <>
            <div>
                <Tabs
                    items={TAB_ITEMS}
                    selectedKey={activeTab}
                    onSelectionChange={(key) => onTabChange(key as AiQuotaModalTab)}
                    ariaLabel="AI usage"
                />
            </div>
            {panel}
        </>
    )

    return (
        <div>
            <ModalShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                header={header}
                size="lg"
                scroll="inside"
                className={className}
                footer={
                    <LinkSeeMore
                        label="View full usage"
                        onPress={onViewDetails}
                        size="sm"

                    />
                }

            >
                <StackV gap={6} body={tabsAndPanel} />
            </ModalShell>
        </div>
    )
}

export { AiQuotaModal }
