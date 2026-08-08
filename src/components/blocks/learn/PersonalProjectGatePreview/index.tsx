import React from "react"
import { CircleIcon } from "@phosphor-icons/react"
import { ContinueCardHero } from "@/components/blocks/learn/ContinueCard"
import { ProgressMeter } from "@/components/composites/stats/ProgressMeter"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV, StackH } from "@/components/frames/Stack"

/**
 * `PersonalProjectGatePreview` — the capstone teaser dropped into `EnrollGate`'s
 * `preview` slot inside `LearnShell`: what a trial viewer sees of the
 * personal-project workspace, behind the gate's fade/lock. Composes
 * `ContinueCardHero` for the headline, a standalone `ProgressMeter` for capstone
 * completion, and `SurfaceCard` with a `label`. Non-interactive — the fade/lock
 * affordance belongs to `EnrollGate`. Task count and names are data on one shape.
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
    /** Label rendered above the bar, e.g. "Personal project progress". */
    label?: string
}

/** Section label the block owns itself — see file header. */
const TASK_LABEL = "Milestone 0 Tasks"

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
}: PersonalProjectGatePreviewProps) => {
    // Depends on the loop variable, so it cannot be hoisted to a const above the
    // return — a small named helper instead, in the style this file already uses.
    const renderTaskRow = (item: PersonalProjectGatePreviewTask, index: number) => (
        <StackH
            key={index}
            gap={2}
            principle="icon-text"
            explain="Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
            align="center"
            isSkeleton={isSkeleton}

            items={[
                () => <CircleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-muted" />,
                () => (
                    <Typography
                        size="sm"
                        truncate
                        isSkeleton={isSkeleton}
                        text={item.title}

                    />
                ),
            ]}
        />
    )

    const taskList = (
        <StackV
            gap={4}
            isSkeleton={isSkeleton}

            items={items.map((item, index) => () => renderTaskRow(item, index))}
        />
    )

    return (
        <StackV identity={{ tier: "block", component: "PersonalProjectGatePreview" }}
            gap={6}
            isSkeleton={isSkeleton}

            items={[
                () => (
                    <ContinueCardHero
                        title={heroTitle}
                        subtitle={heroSubtitle}
                        isSkeleton={isSkeleton}


                    />
                ),
                () => (
                    <ProgressMeter
                        value={progress.value}
                        max={progress.max}
                        label={progress.label}
                        showValue


                    />
                ),
                () => (
                    <SurfaceCard
                        label={TASK_LABEL}
                        isSkeleton={isSkeleton}


                        body={() => taskList}
                    />
                ),
            ]}
        />
    )
}

export { PersonalProjectGatePreview }
