import React from "react"
import { CircleIcon } from "@phosphor-icons/react"
import { ContinueCardHero } from "@sb-components/starci/blocks/learn/ContinueCard/ContinueCard"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV, StackH } from "@sb-components/frames/Stack/Stack"

/**
 * `PersonalProjectGatePreview` — the capstone teaser fed into `EnrollGate`'s
 * `preview` slot, showing a trial viewer the real shape of the personal-project
 * workspace behind the gate's lock chrome. Non-interactive: a `ContinueCardHero`
 * headline, a `ProgressMeter` of overall completion, and a labeled `SurfaceCard`
 * listing the milestone-0 task titles. The block owns the section label; only
 * the task titles are domain data.
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
    /** Placement class only (§14d.1) — not for restyling. */
    className?: string
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
}: PersonalProjectGatePreviewProps) => {
    // Depends on the loop variable, so it cannot be hoisted to a const above the
    // return — a small named helper instead, in the style this file already uses.
    const renderTaskRow = (item: PersonalProjectGatePreviewTask, index: number) => (
        <StackH
            key={index}
            gap={2}
            align="center"


            body={
                <>
                    <CircleIcon aria-hidden focusable="false" className="size-4 shrink-0 text-muted" />
                    <Typography
                        size="sm"
                        truncate
                        isSkeleton={isSkeleton}
                        text={item.title}

                    />
                </>
            }
        />
    )

    const taskList = (
        <StackV
            gap={4}


            body={items.map(renderTaskRow)}
        />
    )

    return (
        <StackV
            gap={6}
            className={className}


            body={
                <>
                    <ContinueCardHero
                        title={heroTitle}
                        subtitle={heroSubtitle}
                        isSkeleton={isSkeleton}


                    />
                    <ProgressMeter
                        value={progress.value}
                        max={progress.max}
                        label={progress.label}
                        showValue


                    />
                    <SurfaceCard
                        label={TASK_LABEL}
                        isSkeleton={isSkeleton}


                        body={() => taskList}
                    />
                </>
            }
        />
    )
}

export { PersonalProjectGatePreview }
