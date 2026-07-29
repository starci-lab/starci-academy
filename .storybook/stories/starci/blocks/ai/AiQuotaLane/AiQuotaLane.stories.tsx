import type { Meta, StoryObj } from "@storybook/nextjs"
import { AiQuotaLane, type AiQuotaLaneData } from "@sb-components/starci/blocks/ai/AiQuotaLane/AiQuotaLane"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `AiQuotaLane`: one lane's pair of rolling-window quota bars — "5 giờ
 * tới" above "tuần này" — ported from `src`'s `QuotaLane` (+ its `QuotaBar`
 * leaf), shared by the Auto tab and the Premium branch of the Subscription tab
 * inside `AiQuotaModal`.
 *
 * ⭐ TWO LEAVES, ONE SHAPE: the next-5-hours row and the this-week row are the
 * SAME `QuotaBar` composition reading a different window — see the
 * component's file header for why this is one leaf rendered twice, not two
 * structures (and why it carries no per-instance anatomy tag of its own).
 *
 * 📐 LEAF by STRUCTURE (§14d.2): `data` unset/`isLoading` is the SAME shape
 * (both bars shimmer) — the difference between "no data yet" and "loading" is
 * a caller GUARANTEE, not a render difference, so it stays one leaf below with
 * data states, not two separate leaves.
 */
const meta: Meta<typeof AiQuotaLane> = {
    title: "StarCi/Blocks/Ai/AiQuotaLane/AiQuotaLane",
    component: AiQuotaLane,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AiQuotaLane>

// Two calls of the SAME block, not a hand-drawn leaf of its own (thầy chốt 2026-07-29,
// see AiQuotaLane's own file header) — the tree stops at `QuotaBar`'s real story instead
// of listing the label row / bar / caption it used to hand-draw internally.
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical track stacking the two QuotaBar blocks", storyId: "frames-stack-stackv--default" },
    "QuotaBar": { tier: "block", role: "one labelled rolling-window bar — the next-5-hours row or the this-week row, called twice with only the label/window swapped", storyId: "starci-blocks-ai-quotabar-quotabar--default" },
}

const MOSTLY_FREE: AiQuotaLaneData = {
    window5h: { used: 4, limit: 20, resetLabel: "Reset lúc 18:50 hôm nay" },
    windowWeek: { used: 62, limit: 200, resetLabel: "Reset lúc 00:00 Thứ Hai" },
}

const NEAR_CAP: AiQuotaLaneData = {
    window5h: { used: 17, limit: 20, resetLabel: "Reset lúc 21:10 hôm nay" },
    windowWeek: { used: 165, limit: 200, resetLabel: "Reset lúc 00:00 Thứ Hai" },
}

const EXHAUSTED: AiQuotaLaneData = {
    window5h: { used: 20, limit: 20, resetLabel: "Reset lúc 23:00 hôm nay" },
    windowWeek: { used: 200, limit: 200, resetLabel: null },
}

/** LEAF — the two bars once `data` has landed. */
export const Content: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="AiQuotaLane"
                tier="block"
                leaf="Data landed"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "well under cap (accent)",
                        why: "Most of a lane's life sits here — both windows lightly used, so both bars stay `accent`. This is the baseline shape every other state is a deviation FROM.",
                        code: `<AiQuotaLane
    data={{
        window5h: { used: 4, limit: 20, resetLabel: "Reset lúc 18:50 hôm nay" },
        windowWeek: { used: 62, limit: 200, resetLabel: "Reset lúc 00:00 Thứ Hai" },
    }}
    isLoading={false}
/>`,
                        render: (
                            <AiQuotaLane anatPart="AiQuotaLane" showAnatomy data={MOSTLY_FREE} isLoading={false} />
                        ),
                    },
                    {
                        name: "5h bar >90% (danger), week bar >75% (warning)",
                        why: "The two windows cross their thresholds independently — the fast-resetting 5h window is the one that usually hits danger first, while the week window is still only in warning. Each bar reads its OWN ratio; nothing here couples one window's colour to the other's.",
                        code: `<AiQuotaLane
    data={{
        window5h: { used: 17, limit: 20, resetLabel: "Reset lúc 21:10 hôm nay" },
        windowWeek: { used: 165, limit: 200, resetLabel: "Reset lúc 00:00 Thứ Hai" },
    }}
    isLoading={false}
/>`,
                        render: (
                            <AiQuotaLane data={NEAR_CAP} isLoading={false} />
                        ),
                    },
                    {
                        name: "both windows fully spent, no reset line on the week bar",
                        why: "`resetLabel` is optional per window — here the week window has none (`null`), which the bar simply omits rather than showing an empty line. Both bars sit at `danger` once used equals limit.",
                        code: `<AiQuotaLane
    data={{
        window5h: { used: 20, limit: 20, resetLabel: "Reset lúc 23:00 hôm nay" },
        windowWeek: { used: 200, limit: 200, resetLabel: null },
    }}
    isLoading={false}
/>`,
                        render: (
                            <AiQuotaLane data={EXHAUSTED} isLoading={false} />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — `isLoading`, or `data` not landed yet; both read as the same shimmer mirror. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="AiQuotaLane"
                tier="block"
                leaf="Prop `isLoading`"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "isLoading = true",
                        why: "The lane's own fetch is in flight, so both bars draw their shimmer mirror pill-for-pill — same two-row shape, no numbers yet. `isLoading` is required rather than defaulted precisely so a screen cannot forget to say which state an unset `data` is in.",
                        code: "<AiQuotaLane isLoading />",
                        render: (
                            <AiQuotaLane anatPart="AiQuotaLane" showAnatomy isLoading />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
