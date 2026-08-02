import React from "react"
import {
    SurfaceCardCrossList,
    type SurfaceCardCrossListItem,
} from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { AsyncContent } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { Split } from "@sb-components/frames/Split/Split"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Button } from "@sb-components/atoms/buttons/Button/Button"

/**
 * `DailyQuest` — a BLOCK (dashboard): "Today's Quests" content — a fixed 3-task
 * checklist (read content · pass a challenge · review flashcards), each row showing
 * today's progress, plus a claim action once every task is done. Content only — the
 * page frames it with a label.
 *
 * Data: one entity `{ claimed, allDone, reward, tasks[] }`, `tasks` a fixed-length
 * (3) array of `{ key, current, target }`. Rows render via `SurfaceCardCrossList`:
 * done → `mark="check"`, not-yet-done → `mark="pending"`; no `cross` row exists.
 * Each row's body (title ↔ current/target) is composed with the `Split` frame.
 *
 * Leaves: Loading (`SurfaceCardCrossList`'s own skeleton, 3 rows), Error
 * (`AsyncContent` + retry), Empty (`quest` is null with no error), and Content —
 * which forks by claim state: `!allDone` → a muted progress prompt; `allDone &&
 * !claimed` → a primary claim `Button` (`isPending` while the claim mutation is in
 * flight, this block's only pending state); `claimed` → a success `Chip`.
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

/** Row title per task key — the block's own wording (§14d.1). */
const TASK_LABEL: Record<DailyQuestTaskKey, string> = {
    readContent: "Read a lesson",
    passChallenge: "Pass a challenge",
    reviewFlashcards: "Review flashcards",
}

/** One row's body: title (leading) ↔ current/target (trailing) — two peers on one line. */
const rowBody = (task: DailyQuestTask) => (
    <Split
        gap={3}
        start={<Typography size="sm" text={TASK_LABEL[task.key]} />}
        end={<Typography size="xs" color="muted" text={`${task.current}/${task.target}`} />}

    />
)

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
                classNames={["w-fit"]}

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
        <div>
            <AsyncContent
                isLoading={quest === null && isLoading}
                skeleton={<SurfaceCardCrossList items={[]} isSkeleton skeletonRows={3} />}
                isEmpty={quest === null && !isLoading && !error}
                emptyContent={{
                    title: "No quests for today yet.",
                    onRetry,
                    retryLabel: "Retry",

                }}
                error={quest === null ? error : undefined}
                errorContent={{
                    title: "Couldn't load today's quests.",
                    onRetry,
                    retryLabel: "Retry",

                }}
                content={<StackV gap={4} body={
                    <>
                        <SurfaceCardCrossList items={items} />
                        {claimSlot}
                    </>
                } />}
            />
        </div>
    )
}

export { DailyQuest }
