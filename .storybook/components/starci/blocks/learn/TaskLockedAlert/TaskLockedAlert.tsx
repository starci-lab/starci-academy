import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * `TaskLockedAlert` — the warning shown while previewing a personal-project task
 * that isn't unlocked yet, with a "go to current task" CTA. The presentational
 * half only: plain props in, one callback out (the real component's redux/SWR
 * wiring is out of scope). Composed from `Callout` (an alert + one CTA it skins
 * itself), not a hand-rolled Alert+Button. The title is block-owned copy;
 * `message` is the caller-supplied reason. No self-hide and no skeleton — the
 * screen mounts it only while the task is locked, and the CTA renders only when
 * `onGoToCurrentTask` is supplied.
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
    /** Placement utilities only, from the closed positioning union — NOT for restyling the alert. */
    classNames?: Array<AllowedClassName>
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
