import React from "react"
import { CircleIcon } from "@phosphor-icons/react"
import { ContinueCardHero } from "@sb-components/starci/blocks/learn/ContinueCard/ContinueCard"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV, StackH } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `PersonalProjectGatePreview`: the capstone teaser fed into `EnrollGate`'s
 * `preview` slot inside `LearnShell` (`learn/layout.tsx`, per
 * `.claude/fe/steps/11-overlays-layouts-brainstorm.md` line 114 — 3 gates mounted
 * there: `EnrollGate` / `GithubLinkGate` / `PersonalProjectGatePreview`). A trial
 * viewer who hasn't enrolled sees the REAL hands-on shape of the personal-project
 * workspace sitting behind `EnrollGate`'s own fade/lock chrome, instead of a blank
 * placeholder card.
 *
 * NON-INTERACTIVE ON PURPOSE (Rule 13's discipline applied one level down):
 * `EnrollGate` owns the fade/lock/unlock affordance around whatever it drops into
 * its `preview` slot — that store wiring is OUT OF SCOPE here. This block's prop
 * list carries no press handler at all, because nothing under the fade is meant to
 * be actually pressable; it only renders the STATIC SHAPE of the real surface.
 *
 * REUSE, NOT A REBUILD — exactly the three leaves the task names, all already
 * built elsewhere:
 *   • `ContinueCardHero` (`variant=hero`, the existing "come back to this"
 *     highlight card) carries the headline — the project's own name + a one-line
 *     pitch.
 *   • `ProgressMeter` (composite) shows the capstone's OWN overall completion,
 *     deliberately kept SEPARATE from `ContinueCardHero`'s optional `value`/`max`
 *     bar: wiring `value` on the hero would read as *that card's* progress, not
 *     the capstone's, and two meters both trying to answer "how far along" would
 *     conflict rather than reinforce each other. `value` is left unset on the hero.
 *   • `SurfaceCard` called WITH `label` set. This design system already flattened
 *     its former `SurfaceCard.*` namespace (`storybook-no-namespace.md`), so the
 *     "labeled card" role that `LabeledCard` plays in the real app (itself never
 *     ported to Storybook) is just this same flat `SurfaceCard` with `label` —
 *     see `ChallengeDeliverableList`'s `label="Nộp bài"` call for the identical
 *     precedent.
 *
 * ⭐ JUDGEMENT CALL — the milestone-0 task rows are hand-composed (an icon +
 * `Typography` inside `SurfaceCard`'s body), NOT promoted to a fourth leaf
 * (`SurfaceCardList`). The task spec names exactly three composed leaves, and
 * `items` here is `{ title }` only — no id, status, or press target — so reaching
 * for a full list composite would invent row affordances (press states, trailing
 * content) this static teaser doesn't have and the domain doesn't supply here. A
 * plain bullet row is the honest shape for "titles only, nothing to click".
 *
 * THE BLOCK OWNS THE SECTION LABEL ("Nhiệm vụ mốc 0", §14d.1) — only the task
 * TITLES are domain data; the caller never hands over a heading string for that
 * section.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One milestone-0 task title shown in the teaser's task list. */
export interface PersonalProjectGatePreviewTask {
    /** Task title. */
    title: string
}

/**
 * Capstone overall completion fed to the standalone `ProgressMeter` (see file
 * header for why this stays a separate meter from `ContinueCardHero`'s own bar).
 */
export interface ProgressMeterData {
    /** Current progress value. Should fall within `[0, max]`. */
    value: number
    /** The 100% mark. Defaults to `100` (`ProgressMeter`'s own default). */
    max?: number
    /** Label rendered above the bar, e.g. "Tiến độ dự án cá nhân". */
    label?: string
}

/** Section label the block owns itself — see file header. */
const TASK_LABEL = "Nhiệm vụ mốc 0"

/** Props for {@link PersonalProjectGatePreview}. */
export interface PersonalProjectGatePreviewProps {
    /** Capstone project name/headline — becomes `ContinueCardHero`'s title. */
    heroTitle: string
    /** One-line pitch under the headline — becomes `ContinueCardHero`'s subtitle. */
    heroSubtitle: string
    /** The capstone's overall completion, shown in its own `ProgressMeter`. */
    progress: ProgressMeterData
    /** Milestone-0 task titles, in display order. */
    items: Array<PersonalProjectGatePreviewTask>
    /**
     * `true` → every composed leaf draws its own shimmer mirror instead of the
     * real content. Flows straight into `ContinueCardHero`, `SurfaceCard`, and
     * each task row's `Typography` (§12c) — no parallel skeleton tree built here.
     */
    isSkeleton?: boolean
    /** Placement class only (§14d.1) — not for restyling. */
    className?: string
    /** `true` → every composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block itself (§11a). */
    anatPart?: string
}

/**
 * The capstone teaser dropped behind `EnrollGate`'s fade. See the file header
 * for the full contract.
 *
 * @param props - {@link PersonalProjectGatePreviewProps}
 */
const PersonalProjectGatePreview = ({
    heroTitle,
    heroSubtitle,
    progress,
    items,
    isSkeleton = false,
    className,
    showAnatomy = false,
    anatPart,
}: PersonalProjectGatePreviewProps) => (
    <StackV gap="section" className={className} anatPart={anatPart} showAnatomy={showAnatomy}>
        <ContinueCardHero
            title={heroTitle}
            subtitle={heroSubtitle}
            isSkeleton={isSkeleton}
            showAnatomy={showAnatomy}
            anatPart={showAnatomy ? "ContinueCardHero" : undefined}
        />
        <ProgressMeter
            value={progress.value}
            max={progress.max}
            label={progress.label}
            showValue
            showAnatomy={showAnatomy}
            anatPart={showAnatomy ? "ProgressMeter" : undefined}
        />
        <SurfaceCard
            label={TASK_LABEL}
            isSkeleton={isSkeleton}
            showAnatomy={showAnatomy}
            anatPart={showAnatomy ? "SurfaceCard" : undefined}
        >
            <StackV gap="grouped" showAnatomy={showAnatomy} anatPart={showAnatomy ? "StackV" : undefined}>
                {items.map((item, index) => (
                    <StackH
                        key={index}
                        gap="tight"
                        align="center"
                        showAnatomy={showAnatomy}
                        anatPart={showAnatomy ? "StackH" : undefined}
                    >
                        <CircleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-muted" />
                        <Typography
                            size="sm"
                            truncate
                            isSkeleton={isSkeleton}
                            text={item.title}
                            anatPart={showAnatomy ? "Typography" : undefined}
                        />
                    </StackH>
                ))}
            </StackV>
        </SurfaceCard>
    </StackV>
)

export { PersonalProjectGatePreview }
