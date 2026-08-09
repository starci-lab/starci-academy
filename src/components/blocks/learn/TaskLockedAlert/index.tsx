import { Callout } from "@/components/composites/feedback/Callout"

/**
 * BLOCK — `TaskLockedAlert`: warning shown while previewing a personal-project
 * task that isn't unlocked yet, with a "go to current task" CTA.
 *
 * Composed from `Callout` (which itself is an `Alert` + one owned CTA
 * `Button`) rather than hand-rolled — see the component's file header for why
 * (the `CourseTeamGate` precedent + the `ContentTabBar` cautionary tale).
 *
 * LEAF by STRUCTURE: whether the CTA button exists is a real structural
 * difference (`Callout` renders no action node at all without it), so
 * "with CTA" vs "no CTA" are two leaves, not one leaf with a toggled prop.
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
     * `string`, not `ReactNode` (COMPOSITE-8) — forwarded straight into
     * `Callout`'s own `description` slot, which is text-only.
     */
    message: string
    /** CTA label. Default matches the real app's copy. */
    ctaLabel?: string
    /**
     * Fires when the CTA is pressed ("go to current task"). Renders NO button at
     * all when omitted — the caller only supplies this once it actually knows
     * where "the current task" is (mirrors the real `canGoToCurrentTask` gate).
     */
    onGoToCurrentTask?: () => void
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
}: TaskLockedAlertProps) => (
    <Callout
        identity={{ tier: "block", component: "TaskLockedAlert" }}
        status="warning"
        title={TITLE}
        description={message}
        actionLabel={onGoToCurrentTask ? ctaLabel : undefined}
        onAction={onGoToCurrentTask}
    />
)

/** `TaskLockedAlert.*` — single-component namespace ⇒ only `.Base`. */
export { TaskLockedAlertBase as TaskLockedAlert }
