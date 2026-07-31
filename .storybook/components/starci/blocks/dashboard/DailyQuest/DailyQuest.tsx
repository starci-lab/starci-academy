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
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `DailyQuest` (dashboard): "Nhiệm vụ hôm nay" content — a fixed
 * 3-task checklist (read content · pass a challenge · review flashcards),
 * each row showing today's progress, plus a claim action once every task is
 * done. Content only — the PAGE frames it with a label; this block never
 * draws its own title (mirrors the real
 * `src/components/features/dashboard/DailyQuest`'s own file header).
 *
 * ⭐ AUDITED FROM `src` 2026-07-31 (matrix-driven build). Data shape in hand:
 * ONE entity, `{ claimed, allDone, reward, tasks[] }`, `tasks` a FIXED-length
 * (3) array of `{ key, current, target }` — `key` a closed 3-value enum, both
 * numbers small integers, nothing free-text. `node scripts/matrix.mjs` on
 * `"An array of READ-ONLY rows carrying a check / cross / pending mark"`
 * answers `SurfaceCardCrossList` (composites/cards/SurfaceCard) — confirmed
 * BUILT (exported member of `SurfaceCard.tsx`, real usage already at
 * `MockInterviewScorecard.tsx`). Its `mark` union (`check`/`pending`/`cross`/`none`)
 * lines up with the real row exactly: done → `mark="check"` (default tone
 * `success`, the ✓), not-yet-done → `mark="pending"` (default tone `neutral`,
 * a plain circle — the SAME visual as the real `CircleIcon text-foreground`).
 * No `cross` row exists in this checklist (nothing is ever "excluded").
 *
 * Each row's BODY (title ↔ current/target) is two PEERS on one line — the
 * `Split` frame ("EXACTLY TWO NAMED SIDES: leading ↔ trailing") composes it;
 * this block never hand-writes a flex row for it.
 *
 * LEAF BY STRUCTURE (§14d.2), three claim-state leaves nested inside Content,
 * plus the three async leaves:
 *   1. Loading — `SurfaceCardCrossList`'s own `isSkeleton` mirror, 3 rows (the
 *      REAL task count — the real src's skeleton guesses 5 rows, which this
 *      block does not repeat since the true shape is known to be exactly 3).
 *   2. Error   — `AsyncContent`'s error branch + retry.
 *   3. Empty   — `quest` is `null` with no error (the query resolved to
 *      "nothing issued today"), mirroring the real src's `isEmpty: !data`.
 *   4. Content, three further leaves by claim state:
 *      4a. `!allDone`  — a muted progress-prompt sentence.
 *      4b. `allDone && !claimed` — a primary claim `Button` (`isPending` while
 *          the claim mutation is in flight — THAT is this block's `pending` state).
 *      4c. `claimed`   — a success `Chip`, no further action possible.
 *
 * FULL STATE SET (nothing left unstated):
 *   • empty   → leaf 3.
 *   • loading → leaf 1.
 *   • error   → leaf 2.
 *   • content → leaf 4 (three claim-state sub-leaves, 4a/4b/4c).
 *   • pending → leaf 4b's `isClaiming` — the ONLY place a mutation is in
 *     flight (claiming the reward); nothing else in this block is ever
 *     mid-mutation.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/** Row title per task key — the block's own wording (§14d.1). */
const TASK_LABEL: Record<DailyQuestTaskKey, string> = {
    readContent: "Đọc nội dung bài học",
    passChallenge: "Vượt qua một thử thách",
    reviewFlashcards: "Ôn tập flashcard",
}

/** One row's body: title (leading) ↔ current/target (trailing) — two peers on one line. */
const rowBody = (task: DailyQuestTask, showAnatomy: boolean) => (
    <Split
        gap="related"
        start={<Typography size="sm" text={TASK_LABEL[task.key]} anatPart={showAnatomy ? "Typography" : undefined} />}
        end={<Typography size="xs" color="muted" text={`${task.current}/${task.target}`} anatPart={showAnatomy ? "Typography" : undefined} />}
        anatPart={showAnatomy ? "Split" : undefined}
    />
)

/**
 * The dashboard's "Nhiệm vụ hôm nay" content. See the file header for the
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
    showAnatomy = false,
    anatPart,
}: DailyQuestProps) => {
    const items: Array<SurfaceCardCrossListItem> = (quest?.tasks ?? []).map((task) => ({
        key: task.key,
        mark: task.current >= task.target ? "check" : "pending",
        text: rowBody(task, showAnatomy),
        anatPart: showAnatomy ? "CrossListItem" : undefined,
    }))

    // Leaf 4a/4b/4c — the claim state, only meaningful once `quest` exists.
    const claimSlot = quest ? (
        quest.claimed ? (
            <Chip
                tone="success"
                text="Đã nhận thưởng"
                anatPart={showAnatomy ? "Chip" : undefined}
            />
        ) : quest.allDone ? (
            <Button
                variant="primary"
                size="sm"
                label={`Nhận ${quest.reward} xu`}
                isPending={isClaiming}
                onPress={onClaim}
                classNames={["w-fit"]}
                showAnatomy={showAnatomy}
                anatPart={showAnatomy ? "Button" : undefined}
            />
        ) : (
            <Typography
                size="xs"
                color="muted"
                text={`Hoàn thành cả 3 nhiệm vụ để nhận ${quest.reward} xu.`}
                anatPart={showAnatomy ? "Typography" : undefined}
            />
        )
    ) : null

    return (
        <div data-anat-part={anatPart}>
            <AsyncContent
                isLoading={quest === null && isLoading}
                skeleton={<SurfaceCardCrossList items={[]} isSkeleton skeletonRows={3} showAnatomy={showAnatomy} />}
                isEmpty={quest === null && !isLoading && !error}
                emptyContent={{
                    title: "Chưa có nhiệm vụ nào cho hôm nay.",
                    onRetry,
                    retryLabel: "Thử lại",
                    anatPart: showAnatomy ? "AsyncContentEmpty" : undefined,
                    showAnatomy,
                }}
                error={quest === null ? error : undefined}
                errorContent={{
                    title: "Không tải được nhiệm vụ hôm nay.",
                    onRetry,
                    retryLabel: "Thử lại",
                    anatPart: showAnatomy ? "AsyncContentError" : undefined,
                    showAnatomy,
                }}
                showAnatomy={showAnatomy}
            >
                <StackV gap="grouped">
                    <SurfaceCardCrossList items={items} showAnatomy={showAnatomy} anatPart={showAnatomy ? "SurfaceCardCrossList" : undefined} />
                    {claimSlot}
                </StackV>
            </AsyncContent>
        </div>
    )
}

export { DailyQuest }
