import type { Meta, StoryObj } from "@storybook/nextjs"
import { FlashcardMasteryStrip } from "@sb-components/starci/blocks/learn/FlashcardMasteryStrip/FlashcardMasteryStrip"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `FlashcardMasteryStrip`: mastery-first progress readout for a deck —
 * "how much of this do I actually own", not "how many cards are left today".
 * Maps to the real `FlashcardStatsStrip`.
 *
 * REUSES `SegmentBar`'s OWN `caption` slot for the retention/first-review line
 * instead of a second hand-built text row underneath it — the exact drift the
 * `ContentModeNav` header on this catalog warns against.
 *
 * ⭐ `SegmentBar` has no `isSkeleton` of its own. Loading feeds it one flat,
 * uncoloured segment with the legend hidden instead of forking a parallel bar —
 * see the component's own file header for the full reasoning.
 *
 * 📐 LEAF by STRUCTURE (§14d.2), four of them: the streak chip (`SurfaceCard`'s
 * `action` slot) appearing/disappearing is one axis; the caption switching
 * between a retention number and a first-review nudge — a genuinely different
 * sentence answering a genuinely different question — is the other. Between 1
 * and 4 lifetime reviews neither leaf applies and the caption is simply absent;
 * that gap is not invented as a fifth leaf because no screen asks for it.
 */
const meta: Meta<typeof FlashcardMasteryStrip> = {
    title: "StarCi/Blocks/Learn/FlashcardMasteryStrip/FlashcardMasteryStrip",
    component: FlashcardMasteryStrip,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FlashcardMasteryStrip>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the labelled card face — draws the \"Thành thạo\" label and, when the block hands one over, the streak chip pinned to its right", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "Chip": { tier: "atom", role: "the streak chip, present only once the block has a streak to report", storyId: "atoms-chips-chip-chip--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the mastered/total count, or the trailing percentage, real or its shimmer mirror", storyId: "atoms-text-typography-typography--plain" },
    "StackV": { tier: "frame", role: "the vertical track holding the stat row above the segment bar, owning the seam between them", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the horizontal track lining the mastered/total count up with its percentage on one baseline", storyId: "frames-stack-stackh--default" },
    "SegmentBar": { tier: "composite", role: "the mastered · learning · new proportion bar, drawing its own legend and — reused rather than duplicated — its own caption line for the retention/first-review sentence", storyId: "composites-stats-segmentbar--overview" },
}

/** LEAF — a streak in progress ⇒ `SurfaceCard`'s `action` slot carries the streak chip. */
export const StreakPresent: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="FlashcardMasteryStrip"
                tier="block"
                leaf="Streak present"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "streak = 6",
                        why: "The learner has studied six days running, so the streak chip pins to the top-right of the card as the study-habit signal it is. It rides in `SurfaceCard`'s own `action` slot rather than a second chip crammed beside the mastery count, keeping exactly one accent mark on the strip.",
                        code: `<FlashcardMasteryStrip
    mastered={18}
    total={40}
    learning={14}
    newCount={8}
    streak={6}
    retention={82}
    totalReviewed={52}
/>`,
                        render: (
                            <FlashcardMasteryStrip
                                anatPart="FlashcardMasteryStrip"
                                showAnatomy
                                mastered={18}
                                total={40}
                                learning={14}
                                newCount={8}
                                streak={6}
                                retention={82}
                                totalReviewed={52}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — no streak to report ⇒ the strip **loses** the `Chip` node entirely. */
export const NoStreak: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="FlashcardMasteryStrip"
                tier="block"
                leaf="No streak"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "streak = undefined",
                        why: "The caller has nothing to report for today's habit, so the block leaves `SurfaceCard`'s `action` slot empty rather than drawing a chip for a streak of zero. An empty slot reads as \"nothing here\"; a chip reading \"0 ngày\" would read as a broken streak worth apologising for.",
                        code: `<FlashcardMasteryStrip
    mastered={18}
    total={40}
    learning={14}
    newCount={8}
    retention={82}
    totalReviewed={52}
/>`,
                        render: (
                            <FlashcardMasteryStrip
                                anatPart="FlashcardMasteryStrip"
                                showAnatomy
                                mastered={18}
                                total={40}
                                learning={14}
                                newCount={8}
                                retention={82}
                                totalReviewed={52}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — enough history ⇒ `SegmentBar`'s caption carries a real retention number. */
export const RetentionCaption: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="FlashcardMasteryStrip"
                tier="block"
                leaf="Retention caption"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "totalReviewed = 140 (≥ 5)",
                        why: "140 lifetime reviews is well past the 5-review floor, so the caption states the real 30-review retention number instead of staying silent. This is the deck a returning learner sees most often — mostly mastered, still earning its streak.",
                        code: `<FlashcardMasteryStrip
    mastered={25}
    total={30}
    learning={4}
    newCount={1}
    retention={91}
    totalReviewed={140}
/>`,
                        render: (
                            <FlashcardMasteryStrip
                                anatPart="FlashcardMasteryStrip"
                                showAnatomy
                                mastered={25}
                                total={30}
                                learning={4}
                                newCount={1}
                                retention={91}
                                totalReviewed={140}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — zero lifetime reviews ⇒ the caption becomes a first-review nudge, never a 0% stat. */
export const FirstReviewHint: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="FlashcardMasteryStrip"
                tier="block"
                leaf="First-review hint"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "totalReviewed = 0",
                        why: "Nothing has been reviewed yet, so every card sits in the \"new\" segment and the caption invites the first review instead of printing a retention rate computed from zero data. A \"0%\" here would read as a failing grade for a deck that was never given the chance to be graded.",
                        code: `<FlashcardMasteryStrip
    mastered={0}
    total={40}
    learning={0}
    newCount={40}
    totalReviewed={0}
/>`,
                        render: (
                            <FlashcardMasteryStrip
                                anatPart="FlashcardMasteryStrip"
                                showAnatomy
                                mastered={0}
                                total={40}
                                learning={0}
                                newCount={40}
                                totalReviewed={0}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
