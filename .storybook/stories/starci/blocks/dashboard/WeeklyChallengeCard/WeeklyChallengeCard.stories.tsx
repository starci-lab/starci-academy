import type { Meta, StoryObj } from "@storybook/nextjs"
import { WeeklyChallengeCard, type WeeklyChallengeData } from "@sb-components/starci/blocks/dashboard/WeeklyChallengeCard/WeeklyChallengeCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `WeeklyChallengeCard`: "Weekly Challenge" — the featured challenge of
 * the week. See the component's own file header for the full contract; this
 * file only adds the states.
 *
 * 📐 LEAF by STRUCTURE (§14d.2): whether the viewer already passed, already
 * claimed, or the leaderboard is short, are all DATA conditions of the same
 * status row/list — never a different shape this block draws — so this block
 * has exactly ONE leaf ("Content"), the same shape `LeaderboardBoard`'s single
 * `Board` leaf uses.
 */
const meta: Meta<typeof WeeklyChallengeCard> = {
    title: "StarCi/Blocks/Dashboard/WeeklyChallengeCard/WeeklyChallengeCard",
    component: WeeklyChallengeCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof WeeklyChallengeCard>

const LEADERBOARD = [
    { key: "hoang.tran", username: "hoang.tran", passedAtLabel: "5 minutes ago" },
    { key: "minh.le", username: "minh.le", passedAtLabel: "38 minutes ago" },
    { key: "thao.dang", username: "thao.dang", passedAtLabel: "2 hours ago" },
]

const DATA_NOT_PASSED: WeeklyChallengeData = {
    title: "Build a distributed rate limiter",
    onOpenChallenge: () => {},
    endsInLabel: "2 days 6 hours left",
    viewerPassed: false,
    claimed: false,
    coinReward: null,
    passedCount: 128,
    leaderboard: LEADERBOARD,
}

const DATA_CLAIMABLE: WeeklyChallengeData = {
    ...DATA_NOT_PASSED,
    viewerPassed: true,
    claimed: false,
    coinReward: 50,
}

const DATA_CLAIMED: WeeklyChallengeData = {
    ...DATA_NOT_PASSED,
    viewerPassed: true,
    claimed: true,
    coinReward: 50,
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the labeled card face, drawing the \"Weekly Challenge\" label above the title, status row and leaderboard — this label never unmounts across loading/empty/content", storyId: "composites-cards-surfacecard-surfacecard--with-label" },
    "StackV": { tier: "frame", role: "the vertical frame stacking the title, status row, passed-count line and leaderboard", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the status row, splitting the countdown from the viewer's pass/claim status", storyId: "frames-stack-stackh--default" },
    "Typography": { tier: "atom", role: "the challenge title (a link when routable), the countdown, a \"Start now\" prompt, the passed-count line, or a finisher's relative-time trailing text", storyId: "atoms-text-typography-typography--overview" },
    "Chip": { tier: "atom", role: "the \"already claimed\" status pill, or its skeleton mirror", storyId: "atoms-chips-chip-chip--default" },
    "Button": { tier: "atom", role: "the claim-reward action once the viewer has passed but not yet claimed", storyId: "atoms-buttons-button-button--default" },
    "SurfaceCardList": { tier: "composite", role: "the bounded, nested finisher list — takes each row as free-form `UserCell` content via its `content` escape hatch", storyId: "composites-cards-surfacecard-surfacecardlist--free-form" },
    "UserCell": { tier: "composite", role: "one finisher's identity + relative-time trailing text, unchanged from `LeaderboardBoard`'s own row shape", storyId: "composites-lists-usercell-usercell--default" },
}

/** LEAF — the weekly-challenge card: async lifecycle, title/status/leaderboard, all as states of one shape. */
export const Content: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="WeeklyChallengeCard"
                tier="block"
                leaf="Content"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "content, viewer has not passed yet",
                        why: "The everyday shape for most viewers: a countdown on the left, a \"Start now\" prompt on the right (the same resolved route the title itself links to), and the recent-finisher list below. The passed count and leaderboard render regardless of the viewer's own status — they are facts about the event, not about the viewer.",
                        code: `<WeeklyChallengeCard
    isLoading={false}
    isEmpty={false}
    onRetry={refetch}
    data={{
        title: "Build a distributed rate limiter",
        onOpenChallenge: () => router.push(challengeHref),
        endsInLabel: "2 days 6 hours left",
        viewerPassed: false,
        claimed: false,
        coinReward: null,
        passedCount: 128,
        leaderboard: [{ key: "hoang.tran", username: "hoang.tran", passedAtLabel: "5 minutes ago" }, …],
    }}
/>`,
                        render: (
                            <WeeklyChallengeCard

                               
                                isLoading={false}
                                isEmpty={false}
                                onRetry={() => {}}
                                data={DATA_NOT_PASSED}
                            />
                        ),
                    },
                    {
                        name: "content, passed and reward claimable",
                        why: "Once the viewer passes, the status slot swaps from the \"Start now\" prompt to a claim button reading the real coin amount — `isClaiming` (unset here) would spin and disable it mid-mutation.",
                        code: `<WeeklyChallengeCard
    isLoading={false}
    isEmpty={false}
    onRetry={refetch}
    data={{ ...challenge, viewerPassed: true, claimed: false, coinReward: 50, onClaim: () => claim() }}
/>`,
                        render: (
                            <WeeklyChallengeCard
                                isLoading={false}
                                isEmpty={false}
                                onRetry={() => {}}
                                data={{ ...DATA_CLAIMABLE, onClaim: () => {} }}
                            />
                        ),
                    },
                    {
                        name: "content, passed and already claimed",
                        why: "Once claimed, the status slot settles into a static success chip — no button, nothing left to press, so a returning viewer reads their own status at a glance without re-triggering the claim mutation by mistake.",
                        code: "<WeeklyChallengeCard isLoading={false} isEmpty={false} onRetry={refetch} data={{ ...challenge, viewerPassed: true, claimed: true, coinReward: 50 }} />",
                        render: (
                            <WeeklyChallengeCard
                                isLoading={false}
                                isEmpty={false}
                                onRetry={() => {}}
                                data={DATA_CLAIMED}
                            />
                        ),
                    },
                    {
                        name: "content, no finishers yet",
                        why: "Early in the week the challenge is live but nobody has passed yet — the leaderboard list is OMITTED entirely (never an empty bordered box), while the title, countdown and \"0 people have passed\" line still render in full.",
                        code: "<WeeklyChallengeCard isLoading={false} isEmpty={false} onRetry={refetch} data={{ ...challenge, passedCount: 0, leaderboard: [] }} />",
                        render: (
                            <WeeklyChallengeCard
                                isLoading={false}
                                isEmpty={false}
                                onRetry={() => {}}
                                data={{ ...DATA_NOT_PASSED, passedCount: 0, leaderboard: [] }}
                            />
                        ),
                    },
                    {
                        name: "isLoading = true",
                        why: "Before the first `weeklyChallenge` response lands, `AsyncContent` picks the loading branch and this block hands it a fixed-shape skeleton mirror — title, status row and three finisher rows — inside the SAME `SurfaceCard` label, so the frame never pops in.",
                        code: "<WeeklyChallengeCard isLoading isEmpty={false} onRetry={refetch} />",
                        render: (
                            <WeeklyChallengeCard
                                isLoading
                                isEmpty={false}
                                onRetry={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isEmpty = true",
                        why: "No challenge event is currently active — `weeklyChallenge` resolves `null`, a real shape, not a loading/error condition — so `AsyncContent` falls to its empty branch while the \"Weekly Challenge\" label stays up, keeping the dashboard slot from disappearing entirely between events.",
                        code: "<WeeklyChallengeCard isLoading={false} isEmpty onRetry={refetch} />",
                        render: (
                            <WeeklyChallengeCard
                                isLoading={false}
                                isEmpty
                                onRetry={() => {}}
                            />
                        ),
                    },
                    {
                        name: "error present",
                        why: "A failed `weeklyChallenge` fetch beats loading/empty/content in `AsyncContent`'s priority order. `src`'s own fetch never wires this branch (see the file header) — added here for consistency with every sibling dashboard block in this pass, which all retry the same way.",
                        code: "<WeeklyChallengeCard isLoading={false} isEmpty={false} error={fetchError} onRetry={refetch} />",
                        render: (
                            <WeeklyChallengeCard
                                isLoading={false}
                                isEmpty={false}
                                error={new Error("network")}
                                onRetry={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
