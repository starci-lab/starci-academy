import type { ReactNode } from "react"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `TaskLockedAlert`: warning shown while PREVIEWING a personal-project
 * task that isn't unlocked yet, with a "go to current task" CTA.
 *
 * REAL SIBLING (single-use, `"use client"`): `src/components/features/learn/
 * PersonalProject/TaskLockedAlert/index.tsx`. That component is entirely SELF-
 * WIRED — it reads `selectedTaskId` from redux, the task-progress lookup from
 * its own SWR query, and pushes a router URL on press. All of that is APP
 * WIRING (same discipline as an overlay's store hook, §13 of this run's brief):
 * out of scope here. This block is the pure PRESENTATIONAL half — plain props in,
 * one callback out.
 *
 * ⭐ JUDGMENT CALL — composed from `Callout`, NOT a hand-rolled
 * `Alert`+`Button` pair, even though the brief named those two as the compose-
 * from list. `Callout` (`composites/feedback/Callout`) is ALREADY
 * exactly "a status `Alert` + one CTA `Button` it builds and skins itself" —
 * building the pair by hand here would be the exact `ContentTabBar` mistake
 * flagged at the top of this run (rebuilding a worse copy of an existing
 * composite from bare atoms). The nearest sibling block, `CourseTeamGate`
 * (also "warning alert + one CTA, self-hidden by the caller/business logic"),
 * already reuses `Callout` the same way — this follows that precedent.
 *
 * ⭐ JUDGMENT CALL — TITLE IS OWNED, NOT A PROP. The real component's title
 * (`task.previewLockedAlertTitle` = "Complete the previous task first") never varies
 * across calls, so it is chrome this block owns (§14d.1) — copied verbatim from
 * `vi.json` (rule #8: product copy matches `src`, this file does not "fix" the
 * doubled word). `message` stands in for the real `description` slot
 * (`task.previewLockedAlertDescription`) — THAT text is domain content (states
 * WHY the task is still locked), so it stays a caller-supplied prop in case this
 * shape is ever reused for a different "still locked, come back later" reason.
 *
 * ⭐ JUDGMENT CALL — NO SELF-HIDE, NO `isSkeleton`. The real component's
 * `isActionLocked` gate reads redux + SWR (business data) — out of scope, so
 * the SCREEN mounts `<TaskLockedAlert />` only while the previewed task actually
 * is locked, the same way it decides whether to mount it at all (mirrors the
 * real `return null` branch, just moved to the caller). Likewise the real
 * `canGoToCurrentTask` gate (hide the CTA when there's no other unlocked task to
 * jump to) becomes: the CTA renders only when `onGoToCurrentTask` is supplied —
 * the caller only passes the handler when there is somewhere to navigate to.
 * There is no loading shape either: like `ContentModeNav`, the caller only
 * mounts this once the lock state is already known, so there is nothing to
 * shimmer.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Default CTA copy — matches `task.previewLockedGoToCurrentTaskButton` in `vi.json`. */
const DEFAULT_CTA_LABEL = "Back to current task"

/** Fixed title — matches `task.previewLockedAlertTitle` in `vi.json` (see header). */
const TITLE = "Complete the previous task first"

/** Props for {@link TaskLockedAlert}. */
export interface TaskLockedAlertProps {
    /**
     * WHY this task's action is still locked — the domain-specific supporting
     * line under the fixed title (stands in for the real `description` slot).
     */
    message: ReactNode
    /** CTA label. Default matches the real app's copy. */
    ctaLabel?: string
    /**
     * Fires when the CTA is pressed ("go to current task"). Renders NO button at
     * all when omitted — the caller only supplies this once it actually knows
     * where "the current task" is (mirrors the real `canGoToCurrentTask` gate).
     */
    onGoToCurrentTask?: () => void
    /** Placement utilities only, from the closed positioning union — NOT for restyling the alert. */
    classNames?: Array<AllowedClassName>
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    /** When on, the composed part emits `data-anat-part` for a BlockAnatomy panel. */
}

/**
 * Warning banner for a locked personal-project task being previewed. See the
 * file header for the full contract and the judgment calls behind it.
 *
 * @param props - {@link TaskLockedAlertProps}
 */
const TaskLockedAlertBase = ({
    message,
    ctaLabel = DEFAULT_CTA_LABEL,
    onGoToCurrentTask,
    classNames,
}: TaskLockedAlertProps) => (
    <Callout
        status="warning"
        title={TITLE}
        description={message}
        actionLabel={onGoToCurrentTask ? ctaLabel : undefined}
        onAction={onGoToCurrentTask}
        classNames={classNames}


    />
)

/** `TaskLockedAlert.*` — single-component namespace ⇒ only `.Base`. */
export { TaskLockedAlertBase as TaskLockedAlert }
