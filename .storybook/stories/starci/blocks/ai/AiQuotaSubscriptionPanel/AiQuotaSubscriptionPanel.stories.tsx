import type { Meta, StoryObj } from "@storybook/nextjs"
import { AiQuotaSubscriptionPanel } from "@sb-components/starci/blocks/ai/AiQuotaSubscriptionPanel/AiQuotaSubscriptionPanel"
import type { AiQuotaLaneData } from "@sb-components/starci/blocks/ai/AiQuotaLane/AiQuotaLane"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `AiQuotaSubscriptionPanel`: body of the "Plan" tab inside
 * `AiQuotaModal` — ported from `src`'s `SubscriptionTab`.
 *
 * ⭐ BLOCK REUSES BLOCK — the Premium branch is this plan's `AiQuotaLane`
 * (see that block's own story), unchanged; this panel only owns the leaf
 * switch on `tier` plus the CTA/caption wording around it.
 *
 * 📐 LEAF by STRUCTURE (§14d.2): `tier === null` vs. `tier` set is a real
 * shape difference (CTA-in-a-card vs. lane-plus-caption) ⇒ two leaves. Which
 * tier is active, and whether the Premium lane's own fetch is still running,
 * are DATA ⇒ states inside the `ActiveLane` leaf, not separate leaves.
 */
const meta: Meta<typeof AiQuotaSubscriptionPanel> = {
    title: "StarCi/Blocks/Ai/AiQuotaSubscriptionPanel/AiQuotaSubscriptionPanel",
    component: AiQuotaSubscriptionPanel,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AiQuotaSubscriptionPanel>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the bordered inset region the no-tier offer sits inside, reading as its own region against the modal's already-filled face", storyId: "composites-cards-surfacecard-surfacecard--variant" },
    "StackV": { tier: "frame", role: "the vertical track owning the seam between the sentence and the button, or between the lane and its caption", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "the muted sentence explaining what buying unlocks, or the caption naming the active tier", storyId: "atoms-text-typography-typography--plain" },
    "Button": { tier: "atom", role: "the single subscribe CTA, owning its own accent skin and the arrow that slides on hover", storyId: "atoms-buttons-button-button--default" },
    "AiQuotaLane": { tier: "block", role: "the reused Premium lane — two rolling-window quota bars, fed straight from this panel's `premiumLane` prop with no reshaping", storyId: "starci-blocks-ai-aiquotalane-aiquotalane--content" },
}

const PRO_LANE: AiQuotaLaneData = {
    window5h: { used: 6, limit: 40, resetLabel: "Resets at 7:20 PM today" },
    windowWeek: { used: 140, limit: 500, resetLabel: "Resets Monday at midnight" },
}

/** LEAF — no paid tier: a muted sentence + one CTA, inside a bordered inset card. */
export const NoTierCta: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AiQuotaSubscriptionPanel"
                tier="block"
                leaf="No tier"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "tier = null",
                        why: "The reader is still on the free lane, so the tab shows exactly one way forward: what upgrading unlocks, and one button to start. The offer sits inside a bordered card so it reads as an inset region rather than floating flush against the modal's own face.",
                        code: `<AiQuotaSubscriptionPanel
    tier={null}
    premiumLane={{ isLoading: false }}
    onSubscribe={subscribe}
/>`,
                        render: (
                            <AiQuotaSubscriptionPanel

                               
                                tier={null}
                                premiumLane={{ isLoading: false }}
                                onSubscribe={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a paid tier: the reused `AiQuotaLane` + a caption naming which tier. */
export const ActiveLane: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AiQuotaSubscriptionPanel"
                tier="block"
                leaf="Active tier"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "tier = \"pro\", premium lane data landed",
                        why: "Once a tier is active the CTA disappears entirely — the tab's job flips from selling the upgrade to showing what it bought. The caption names the tier so the reader can tell this apart from the free Auto tab.",
                        code: `<AiQuotaSubscriptionPanel
    tier="pro"
    premiumLane={{
        data: {
            window5h: { used: 6, limit: 40, resetLabel: "Resets at 7:20 PM today" },
            windowWeek: { used: 140, limit: 500, resetLabel: "Resets Monday at midnight" },
        },
        isLoading: false,
    }}
    onSubscribe={subscribe}
/>`,
                        render: (
                            <AiQuotaSubscriptionPanel

                               
                                tier="pro"
                                premiumLane={{ data: PRO_LANE, isLoading: false }}
                                onSubscribe={() => {}}
                            />
                        ),
                    },
                    {
                        name: "tier = \"max\", premium lane still loading",
                        why: "The tier is already known (it came back with the account/quota fetch), but the lane's OWN numbers may still be in flight — `AiQuotaLane` draws its shimmer mirror while the caption underneath stays real, since the tier name never depended on that second fetch.",
                        code: `<AiQuotaSubscriptionPanel
    tier="max"
    premiumLane={{ isLoading: true }}
    onSubscribe={subscribe}
/>`,
                        render: (
                            <AiQuotaSubscriptionPanel
                                tier="max"
                                premiumLane={{ isLoading: true }}
                                onSubscribe={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; the panel delegates its shimmer to `AiQuotaLane`'s own loading state rather than drawing a parallel skeleton tree. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AiQuotaSubscriptionPanel"
                tier="block"
                leaf="Prop `isSkeleton`"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Which leaf to show (no tier vs. active tier) isn't known before the subscription fetch resolves, so the skeleton can't commit to either shape — it delegates straight to `AiQuotaLane` with its OWN pre-existing `isLoading` prop (not `isSkeleton` — that's an external/reused block, left as-is) for the shimmer, per §12g.0's priority rule against a parallel skeleton tree.",
                        code: "<AiQuotaSubscriptionPanel isSkeleton onSubscribe={subscribe} />",
                        render: (
                            <AiQuotaSubscriptionPanel

                               
                                isSkeleton
                                onSubscribe={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
