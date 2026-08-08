import React from "react"
import {
    SurfaceCardCrossList,
    type SurfaceCardCrossListItem,
} from "@/components/composites/cards/SurfaceCard"
import { AsyncContent } from "@/components/composites/async/AsyncContent"
import { StackV } from "@/components/frames/Stack"
import { Typography } from "@/components/atoms/text/Typography"
import { Chip } from "@/components/atoms/chips/Chip"
import { Button } from "@/components/atoms/buttons/Button"
import type { CallerIdentity } from "@/components/frames/_identity"

/**
 * `DailyQuest` (dashboard) — "Today's quests": a fixed 3-task checklist plus a
 * claim action once every task clears its target. Four async leaves — `Loading`,
 * `Error`, `Empty`, and `Content`, the last forking on claim state: incomplete
 * (prompt), all-done unclaimed (claim button, `isPending` while claiming), or
 * already claimed (chip, no action left).
 */

/** The three fixed daily tasks — closed set, real BE vocabulary (see file header). */
export type DailyQuestTaskKey = "readContent" | "passChallenge" | "reviewFlashcards"

/** One checklist row. */
export interface DailyQuestTask {
    key: DailyQuestTaskKey
    /** Progress made today. */
    current: number
    /** Target to clear the row. */
    target: number
}

/** The full daily-quest entity for one day. */
export interface DailyQuestData {
    /** `true` → the reward was already claimed today; no further action. */
    claimed: boolean
    /** `true` → every task has cleared its target (`current >= target`); unlocks the claim button. */
    allDone: boolean
    /** Reward amount, printed inside the claim/prompt wording. */
    reward: number
    /** The checklist rows, in display order. */
    tasks: ReadonlyArray<DailyQuestTask>
}

/** Props for {@link DailyQuest}. */
export interface DailyQuestProps {
    /** The day's quest entity. `null` while genuinely nothing has loaded/resolved yet. */
    quest: DailyQuestData | null
    /** `true` while the quest fetch is in flight (feeds the Loading leaf). */
    isLoading: boolean
    /** Truthy → the fetch failed (feeds the Error leaf, outranks loading/empty). */
    error?: unknown
    /** Fired when the error leaf's retry button is pressed. */
    onRetry: () => void
    /** Fired when the claim button is pressed (leaf 4b only). */
    onClaim: () => void
    /** `true` → the claim mutation is in flight (the block's one `pending` state). */
    isClaiming?: boolean
}

/** This block's identity — stamped on whichever frame/composite is the export root. */
const IDENTITY: CallerIdentity = { tier: "block", component: "DailyQuest" }

/** Row title per task key — the block's own wording (§14d.1). */
const TASK_LABEL: Record<DailyQuestTaskKey, string> = {
    readContent: "Read a lesson",
    passChallenge: "Pass a challenge",
    reviewFlashcards: "Review flashcards",
}

/** One row's text: title (leading) <-> current/target (trailing) - plain text, the composite wraps it in `Typography` itself. */
const rowBody = (task: DailyQuestTask): string => `${TASK_LABEL[task.key]} - ${task.current}/${task.target}`

/**
 * The dashboard's "Today's Quests" content. See the file header for the
 * full leaf/state contract.
 *
 * @param props - {@link DailyQuestProps}
 */
const DailyQuest = ({
    quest,
    isLoading,
    error,
    onRetry,
    onClaim,
    isClaiming = false,
}: DailyQuestProps) => {
    const items: Array<SurfaceCardCrossListItem> = (quest?.tasks ?? []).map((task) => ({
        key: task.key,
        mark: task.current >= task.target ? "check" : "pending",
        text: rowBody(task),

    }))

    // Leaf 4a/4b/4c — the claim state, only meaningful once `quest` exists.
    const claimSlot = quest ? (
        quest.claimed ? (
            <Chip
                tone="success"
                text="Reward claimed"

            />
        ) : quest.allDone ? (
            <Button
                variant="primary"
                size="sm"
                label={`Claim ${quest.reward} coins`}
                isPending={isClaiming}
                onPress={onClaim}


            />
        ) : (
            <Typography
                size="xs"
                color="muted"
                text={`Complete all 3 quests to claim ${quest.reward} coins.`}

            />
        )
    ) : null

    return (
        <AsyncContent
            isLoading={quest === null && isLoading}
            skeleton={() => (
                <SurfaceCardCrossList
                    identity={IDENTITY}
                    items={[]}
                    isSkeleton
                    skeletonRows={3}
                />
            )}
            isEmpty={quest === null && !isLoading && !error}
            emptyContent={{
                identity: IDENTITY,
                title: "No quests for today yet.",
                onRetry,
                retryLabel: "Retry",

            }}
            error={quest === null ? error : undefined}
            errorContent={{
                identity: IDENTITY,
                title: "Couldn't load today's quests.",
                onRetry,
                retryLabel: "Retry",

            }}
            content={() => (
                <StackV
                    identity={IDENTITY}
                    principle="sibling-stack"
                    explain="Quest checklist and claim state are same-kind siblings in the daily-quest body — not group-boundary, because neither is a labelled section header."
                    items={[
                        () => <SurfaceCardCrossList items={items} />,
                        () => claimSlot,
                    ]}
                />
            )}
        />
    )
}

export { DailyQuest }
