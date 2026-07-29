import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    AiQuotaModal,
    type AiQuotaModalAutoState,
    type AiQuotaModalHistoryState,
    type AiQuotaModalProps,
    type AiQuotaModalSubscriptionState,
    type AiQuotaModalTab,
} from "@sb-components/starci/overlays/modals/AiQuotaModal/AiQuotaModal"
import type { AiQuotaLaneData } from "@sb-components/starci/blocks/ai/AiQuotaLane/AiQuotaLane"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AiQuotaModal` — the root overlay for "how much AI have I used": dialog
 * shell + title/tier-chip header + 3-tab strip + the active tab's panel +
 * "view full usage" link. Opened from anywhere via the app's global overlay
 * store; this port takes plain `isOpen`/`onOpenChange`/`activeTab` props
 * instead of reading Zustand directly (Rule 13), same as its siblings
 * `FoundationModal`/`PremiumGateModal`.
 *
 * ⚠️ FILED UNDER `StarCi/Overlays/Modals`, not `StarCi/Blocks/Ai` — see the
 * component's own file header for why (Rule 13 + `components/README.md`'s
 * app-folder split law, matching the `FoundationModal`/`PremiumGateModal`
 * relocation precedent).
 *
 * ONE LEAF (`Default`). The wrapper shape (header · tab strip · one panel slot
 * · footer link) never changes — only WHICH sibling `ai`-group block fills the
 * panel slot changes across states, exactly the reasoning `FoundationModal`'s
 * own file header gives for its `kind` prop. `tier` (the header's chip) and
 * each tab's own `isLoading` are further states of that same one leaf.
 */
const meta: Meta<typeof AiQuotaModal> = {
    title: "StarCi/Overlays/Modals/AiQuotaModal/AiQuotaModal",
    component: AiQuotaModal,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof AiQuotaModal>

// DOM thật (size="lg" scroll="inside"): Modal.CloseTrigger + Modal.Header > StackH >
// Typography + Chip? + Modal.Body > StackV > Tabs + (AiQuotaLane | AiQuotaSubscriptionPanel |
// AiQuotaHistoryPanel) + Modal.Footer > Link.
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Modal.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    "StackH": { tier: "frame", role: "the header row pairing the modal's title with its optional tier chip", storyId: "frames-stack-stackh--default" },
    "Typography": { tier: "atom", role: "the modal's title text, in the header row", storyId: "atoms-text-typography-typography--plain" },
    "Chip": { tier: "atom", role: "the tier badge next to the title — present only on a paid plan (`tier` set, `null` draws nothing)", storyId: "atoms-chips-chip-chip--default" },
    "Modal.Body": { tier: "heroui", role: "the body region — tab strip above the active tab's panel" },
    "StackV": { tier: "frame", role: "the vertical track holding the tab strip above whichever tab's panel is active", storyId: "frames-stack-stackv--default" },
    "Tabs": { tier: "atom", role: "the 3-way strip switching between the Auto, Subscription and History tabs", storyId: "atoms-navigation-tabs-tabs--default" },
    "AiQuotaLane": { tier: "block", role: "the Auto tab's panel — two rolling-window quota bars read against the free/auto model's own cap", storyId: "starci-blocks-ai-aiquotalane-aiquotalane--content" },
    "AiQuotaSubscriptionPanel": { tier: "block", role: "the Subscription tab's panel — a no-tier upgrade CTA, or the reused Premium `AiQuotaLane` plus a tier caption", storyId: "starci-blocks-ai-aiquotasubscriptionpanel-aiquotasubscriptionpanel--active-lane" },
    "AiQuotaHistoryPanel": { tier: "block", role: "the History tab's panel — a 7-day usage chart plus the recent-charges list", storyId: "starci-blocks-ai-aiquotahistorypanel-aiquotahistorypanel--default" },
    "Modal.Footer": { tier: "heroui", role: "the action row — a single \"view full usage\" link" },
    "Link": { tier: "atom", role: "the \"view full usage\" link in the modal's footer", storyId: "atoms-navigation-link-linkseemore--default" },
}

const AUTO_DATA: AiQuotaLaneData = {
    window5h: { used: 8, limit: 20, resetLabel: "Reset lúc 20:00 hôm nay" },
    windowWeek: { used: 90, limit: 200, resetLabel: "Reset lúc 00:00 Thứ Hai" },
}

const PRO_LANE: AiQuotaLaneData = {
    window5h: { used: 6, limit: 40, resetLabel: "Reset lúc 19:20 hôm nay" },
    windowWeek: { used: 140, limit: 500, resetLabel: "Reset lúc 00:00 Thứ Hai" },
}

const CHART_POINTS: AiQuotaModalHistoryState["chartPoints"] = [
    { day: "23/07", credits: 12 },
    { day: "24/07", credits: 8 },
    { day: "25/07", credits: 20 },
    { day: "26/07", credits: 5 },
    { day: "27/07", credits: 15 },
    { day: "28/07", credits: 10 },
    { day: "29/07", credits: 18 },
]

const CHARGE_ITEMS: AiQuotaModalHistoryState["items"] = [
    { key: "1", surface: "grade", occurredAt: "2026-07-28T10:00:00", credits: 5 },
    { key: "2", model: "GPT-5", surface: "chatbot", occurredAt: "2026-07-28T09:00:00", credits: 2 },
    { key: "3", surface: "interview", occurredAt: "2026-07-27T18:30:00", credits: 8 },
]

const NOT_LOADING: AiQuotaModalAutoState & AiQuotaModalSubscriptionState = { isLoading: false }

/** Controlled wrapper — open on mount, `activeTab` switches for real through the modal's own strip; the trigger reopens after a close. */
const ControlledAiQuotaModal = ({
    triggerLabel,
    initialTab,
    ...modalProps
}: {
    triggerLabel: string
    initialTab: AiQuotaModalTab
} & Omit<AiQuotaModalProps, "isOpen" | "onOpenChange" | "activeTab" | "onTabChange">) => {
    const [isOpen, setIsOpen] = useState(true)
    const [activeTab, setActiveTab] = useState<AiQuotaModalTab>(initialTab)
    return (
        <div className="flex flex-col gap-3 p-8">
            <Button
                label={triggerLabel}
                variant="secondary"
                size="sm"
                className="self-start"
                onPress={() => setIsOpen(true)}
            />
            <AiQuotaModal
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                showAnatomy
                anatPart="AiQuotaModal"
                {...modalProps}
            />
        </div>
    )
}

/**
 * ONE LEAF. The wrapper shape never changes; `tier`/`activeTab`/each tab's own
 * `isLoading` only vary the CONTENT inside the same tree — see the file header.
 */
export const Default: Story = {
    render: () => (
        <BlockAnatomy
            name="AiQuotaModal"
            tier="block"
            leaf="Default"
            annotate={ANNOTATE}
            reason="The root overlay scaffold: it decides there are three tabs, their fixed order and Vietnamese labels, and the single panel slot each fills, plus the header's optional tier chip — while ModalShell only knows a header/body/footer trio and the three sibling `ai`-group blocks only know their own tab's content."
            states={[
                {
                    name: "Auto tab · free plan (no tier chip) · data loaded",
                    why: "`tier: null` draws no badge in the header, and the Auto tab always shows the free/auto model's own lane regardless of plan — this is the shape every free-plan viewer opening the modal sees first.",
                    code: `<AiQuotaModal
    isOpen={isOpen}
    onOpenChange={setIsOpen}
    tier={null}
    activeTab="auto"
    onTabChange={setActiveTab}
    auto={{ data: autoLane, isLoading: false }}
    subscription={{ isLoading: false }}
    history={{ isLoading: false }}
    onSubscribe={handleSubscribe}
    onViewDetails={handleViewDetails}
/>`,
                    render: (
                        <ControlledAiQuotaModal
                            triggerLabel="Open — Auto tab, free plan"
                            initialTab="auto"
                            tier={null}
                            auto={{ data: AUTO_DATA, isLoading: false }}
                            subscription={NOT_LOADING}
                            history={{ isLoading: false }}
                            onSubscribe={() => {}}
                            onViewDetails={() => {}}
                        />
                    ),
                },
                {
                    name: "Auto tab · own fetch in flight",
                    why: "Only the Auto panel rests: `AiQuotaLane`'s two bars shimmer while the rest of the shell (header, tab strip, footer link) paints immediately, since none of it depends on this tab's own data.",
                    code: `<AiQuotaModal
    tier={null}
    activeTab="auto"
    auto={{ isLoading: true }}
    subscription={{ isLoading: false }}
    history={{ isLoading: false }}
/>`,
                    render: (
                        <ControlledAiQuotaModal
                            triggerLabel="Open — Auto tab, loading"
                            initialTab="auto"
                            tier={null}
                            auto={{ isLoading: true }}
                            subscription={NOT_LOADING}
                            history={{ isLoading: false }}
                            onSubscribe={() => {}}
                            onViewDetails={() => {}}
                        />
                    ),
                },
                {
                    name: "Subscription tab · no paid tier yet",
                    why: "No chip in the header (`tier: null`), and the Subscription panel falls to its own no-tier leaf — the upgrade CTA in a bordered inset card — rather than a lane with nothing to show.",
                    code: `<AiQuotaModal
    tier={null}
    activeTab="subscription"
    subscription={{ isLoading: false }}
    onSubscribe={handleSubscribe}
/>`,
                    render: (
                        <ControlledAiQuotaModal
                            triggerLabel="Open — Subscription tab, no tier"
                            initialTab="subscription"
                            tier={null}
                            auto={{ data: AUTO_DATA, isLoading: false }}
                            subscription={NOT_LOADING}
                            history={{ isLoading: false }}
                            onSubscribe={() => {}}
                            onViewDetails={() => {}}
                        />
                    ),
                },
                {
                    name: "Subscription tab · Pro plan active",
                    why: "`tier: \"pro\"` now draws the Pro chip in the header, and the Subscription panel switches to its other leaf: the reused Premium `AiQuotaLane` plus a caption naming the active tier.",
                    code: `<AiQuotaModal
    tier="pro"
    activeTab="subscription"
    subscription={{ data: proLane, isLoading: false }}
    onSubscribe={handleSubscribe}
/>`,
                    render: (
                        <ControlledAiQuotaModal
                            triggerLabel="Open — Subscription tab, Pro active"
                            initialTab="subscription"
                            tier="pro"
                            auto={{ data: AUTO_DATA, isLoading: false }}
                            subscription={{ data: PRO_LANE, isLoading: false }}
                            history={{ isLoading: false }}
                            onSubscribe={() => {}}
                            onViewDetails={() => {}}
                        />
                    ),
                },
                {
                    name: "History tab · Max plan active",
                    why: "The header carries the Max chip while the panel switches to `AiQuotaHistoryPanel`: the 7-day usage chart above the recent-charges list, both fed as plain typed data.",
                    code: `<AiQuotaModal
    tier="max"
    activeTab="history"
    history={{ chartPoints, items, isLoading: false }}
/>`,
                    render: (
                        <ControlledAiQuotaModal
                            triggerLabel="Open — History tab, Max active"
                            initialTab="history"
                            tier="max"
                            auto={{ data: AUTO_DATA, isLoading: false }}
                            subscription={{ data: PRO_LANE, isLoading: false }}
                            history={{ chartPoints: CHART_POINTS, items: CHARGE_ITEMS, isLoading: false }}
                            onSubscribe={() => {}}
                            onViewDetails={() => {}}
                        />
                    ),
                },
            ]}
        />
    ),
}
