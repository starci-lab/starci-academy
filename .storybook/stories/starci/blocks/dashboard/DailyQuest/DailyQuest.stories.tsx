import type { Meta, StoryObj } from "@storybook/nextjs"
import { DailyQuest, type DailyQuestData } from "@sb-components/starci/blocks/dashboard/DailyQuest/DailyQuest"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `DailyQuest` (dashboard) — "Today's quests": a fixed 3-task checklist plus a
 * claim action once every task clears its target. Four async leaves — `Loading`,
 * `Error`, `Empty`, and `Content`, the last forking on claim state: incomplete
 * (prompt), all-done unclaimed (claim button, `isPending` while claiming), or
 * already claimed (chip, no action left).
 */
const meta: Meta<typeof DailyQuest> = {
    title: "StarCi/Blocks/Dashboard/DailyQuest/DailyQuest",
    component: DailyQuest,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof DailyQuest>

const INCOMPLETE_QUEST: DailyQuestData = {
    claimed: false,
    allDone: false,
    reward: 20,
    tasks: [
        { key: "readContent", current: 1, target: 1 },
        { key: "passChallenge", current: 0, target: 1 },
        { key: "reviewFlashcards", current: 6, target: 20 },
    ],
}

const ALL_DONE_QUEST: DailyQuestData = {
    claimed: false,
    allDone: true,
    reward: 20,
    tasks: [
        { key: "readContent", current: 1, target: 1 },
        { key: "passChallenge", current: 1, target: 1 },
        { key: "reviewFlashcards", current: 20, target: 20 },
    ],
}

const CLAIMED_QUEST: DailyQuestData = {
    claimed: true,
    allDone: true,
    reward: 20,
    tasks: [
        { key: "readContent", current: 1, target: 1 },
        { key: "passChallenge", current: 1, target: 1 },
        { key: "reviewFlashcards", current: 20, target: 20 },
    ],
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCardCrossList": { tier: "composite", role: "the checklist — one bounded surface, each row's leading mark check (done, success) or pending (not yet, neutral circle); read-only, no press", storyId: "composites-cards-surfacecard-surfacecardcrosslist--checks" },
    "Split": { tier: "frame", role: "a row's body — task title (leading) ↔ current/target (trailing), two peers on one line", storyId: "frames-split-split--default" },
    "Typography": { tier: "atom", role: "a row's title or progress fraction, or the incomplete-state prompt sentence", storyId: "atoms-text-typography-typography--plain" },
    "StackV": { tier: "frame", role: "stacks the checklist and the claim slot below it", storyId: "frames-stack-stackv--default" },
    "Chip": { tier: "atom", role: "the \"already claimed\" signal — no further action once shown", storyId: "atoms-chips-chip-chip--default" },
    "Button": { tier: "atom", role: "the claim action, only rendered once every task clears its target; `isPending` while the claim mutation is in flight", storyId: "atoms-buttons-button-button--pending" },
    "AsyncContentError": { tier: "composite", role: "the fetch-failed message + retry, outranks every other branch", storyId: "composites-async-asynccontent-asynccontent--error" },
    "AsyncContentEmpty": { tier: "composite", role: "\"nothing issued today\" message + retry", storyId: "composites-async-asynccontent-asynccontent--empty" },
}

/** LEAF 1 — the checklist's own 3-row skeleton mirror. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DailyQuest"
                tier="block"
                leaf="Loading"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "quest = null, isLoading = true",
                        why: "The first fetch hasn't resolved yet — 3 placeholder rows (the real, known task count) reserve the checklist's height so nothing jumps once the quest lands. No claim slot renders yet; there is nothing to claim before there is a quest.",
                        code: "<DailyQuest quest={null} isLoading /* … */ />",
                        render: (
                            <DailyQuest

                               
                                quest={null}
                                isLoading
                                onRetry={() => {}}
                                onClaim={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF 2 — the fetch failed; outranks loading/empty. */
export const ErrorLeaf: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DailyQuest"
                tier="block"
                leaf="Error"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "quest = null, error = Error(...)",
                        why: "The quest fetch failed and there is no cached quest to fall back to — the whole checklist is replaced by one message + retry, same as every other async region in the system.",
                        code: "<DailyQuest quest={null} isLoading={false} error={new Error(\"network\")} onRetry={onRetry} /* … */ />",
                        render: (
                            <DailyQuest

                               
                                quest={null}
                                isLoading={false}
                                error={new globalThis.Error("network")}
                                onRetry={() => {}}
                                onClaim={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF 3 — the quest resolved to nothing for today. */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DailyQuest"
                tier="block"
                leaf="Empty"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "quest = null, isLoading = false, error = undefined",
                        why: "The fetch finished cleanly but produced no quest for today — distinct from the error leaf (no failure happened) and from loading (nothing is in flight).",
                        code: "<DailyQuest quest={null} isLoading={false} /* … */ />",
                        render: (
                            <DailyQuest
                                quest={null}
                                isLoading={false}
                                onRetry={() => {}}
                                onClaim={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF 4 — the checklist plus the three claim-state sub-leaves. */
export const Content: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DailyQuest"
                tier="block"
                leaf="Content"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "allDone = false (2/3 tasks left)",
                        why: "4a — while at least one task is short of its target, the claim slot is a muted prompt sentence naming the reward, never a disabled button (a disabled control invites a press that does nothing).",
                        code: "<DailyQuest quest={incompleteQuest} isLoading={false} /* … */ />",
                        render: (
                            <DailyQuest

                               
                                quest={INCOMPLETE_QUEST}
                                isLoading={false}
                                onRetry={() => {}}
                                onClaim={() => {}}
                            />
                        ),
                    },
                    {
                        name: "allDone = true, claimed = false",
                        why: "4b — every row shows `mark=\"check\"` and the prompt is replaced by a real, pressable claim button.",
                        code: "<DailyQuest quest={allDoneQuest} isLoading={false} onClaim={onClaim} /* … */ />",
                        render: (
                            <DailyQuest
                                quest={ALL_DONE_QUEST}
                                isLoading={false}
                                onRetry={() => {}}
                                onClaim={() => {}}
                            />
                        ),
                    },
                    {
                        name: "allDone = true, claimed = false, isClaiming = true",
                        why: "4b, pending — the ONLY place this block is ever mid-mutation: the claim button locks and shows its own spinner while the reward mutation is in flight.",
                        code: "<DailyQuest quest={allDoneQuest} isLoading={false} isClaiming onClaim={onClaim} /* … */ />",
                        render: (
                            <DailyQuest
                                quest={ALL_DONE_QUEST}
                                isLoading={false}
                                isClaiming
                                onRetry={() => {}}
                                onClaim={() => {}}
                            />
                        ),
                    },
                    {
                        name: "claimed = true",
                        why: "4c — the reward for today is already collected; the slot becomes a success chip and no action remains, whether or not `allDone` is still true.",
                        code: "<DailyQuest quest={claimedQuest} isLoading={false} /* … */ />",
                        render: (
                            <DailyQuest
                                quest={CLAIMED_QUEST}
                                isLoading={false}
                                onRetry={() => {}}
                                onClaim={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
