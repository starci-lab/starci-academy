"use client"

import React, {
    useCallback,
    useState,
} from "react"
import {
    cn,
    Button,
    ProgressBar,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    Target as TargetIcon,
} from "@gravity-ui/icons"
import {
    useMutateSetWeeklyGoalSwr,
    useQueryMyWeeklyStatsSwr,
} from "@/hooks"
import {
    useGraphQLWithToast,
} from "@/modules/toast"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Preset weekly lesson targets offered when no goal is set yet. */
const GOAL_PRESETS = [
    3,
    5,
    10,
]

/** Props for {@link WeeklyGoal}. */
export type WeeklyGoalProps = WithClassNames<undefined>

/**
 * Centre-column "weekly goal" strip that turns the passive lessons counter into a
 * commitment. With no goal set it prompts the viewer to pick a target (preset
 * buttons); once set it shows a progress bar of lessons-read against the target
 * plus a small edit affordance. Owns the `setWeeklyGoal` mutation and revalidates
 * its own `myWeeklyStats` leaf query on success. Renders nothing while the stats
 * are still loading.
 * @param props - optional className for the root element.
 */
export const WeeklyGoal = ({
    className,
}: WeeklyGoalProps) => {
    const t = useTranslations()
    const { data, mutate } = useQueryMyWeeklyStatsSwr()
    const { trigger: triggerSetWeeklyGoal } = useMutateSetWeeklyGoalSwr()
    const runGraphQL = useGraphQLWithToast()
    // whether the preset picker is shown (editing an existing goal)
    const [editing, setEditing] = useState(false)
    // the target being saved, or null when idle
    const [savingTarget, setSavingTarget] = useState<number | null>(null)

    /** Persist a chosen target, then revalidate the weekly stats. */
    const onChoose = useCallback(
        async (lessons: number) => {
            setSavingTarget(lessons)
            try {
                let succeeded = false
                await runGraphQL(async () => {
                    const result = await triggerSetWeeklyGoal({
                        lessons,
                    })
                    const response = result?.data?.setWeeklyGoal ?? {
                        success: false,
                        message: "",
                    }
                    succeeded = response.success
                    return response
                })
                if (succeeded) {
                    setEditing(false)
                    await mutate()
                }
            } finally {
                setSavingTarget(null)
            }
        },
        [
            runGraphQL,
            triggerSetWeeklyGoal,
            mutate,
        ],
    )

    // avoid a flash while the weekly stats are still loading
    if (!data) {
        return null
    }

    const lessons = data.lessons
    const goal = data.weeklyGoalLessons
    // show the picker when no goal exists yet, or the user opted to edit
    const showPicker = goal === null || editing

    /** The preset buttons row, shared by the "set" and "edit" states. */
    const presets = (
        <div className="flex items-center gap-1.5">
            {GOAL_PRESETS.map((preset) => (
                <Button
                    key={preset}
                    variant={preset === goal ? "primary" : "tertiary"}
                    size="sm"
                    isDisabled={savingTarget !== null}
                    onPress={() => void onChoose(preset)}
                >
                    {t("dashboard.weeklyGoal.preset", {
                        count: preset,
                    })}
                </Button>
            ))}
        </div>
    )

    return (
        <div className={cn("flex flex-col gap-3 p-3", className)}>
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                    <TargetIcon className="size-5 shrink-0 text-accent" />
                    <span className="text-sm font-medium text-foreground">
                        {goal === null
                            ? t("dashboard.weeklyGoal.prompt")
                            : t("dashboard.weeklyGoal.progress", {
                                lessons,
                                goal,
                            })}
                    </span>
                </div>
                {goal !== null && !editing ? (
                    <Button
                        variant="tertiary"
                        size="sm"
                        onPress={() => setEditing(true)}
                    >
                        {t("dashboard.weeklyGoal.edit")}
                    </Button>
                ) : null}
            </div>

            {goal !== null ? (
                <ProgressBar
                    aria-label={t("dashboard.weeklyGoal.title")}
                    value={lessons}
                    maxValue={goal || 1}
                    color="accent"
                    size="sm"
                >
                    <ProgressBar.Track>
                        <ProgressBar.Fill />
                    </ProgressBar.Track>
                </ProgressBar>
            ) : null}

            {showPicker ? presets : null}
        </div>
    )
}
