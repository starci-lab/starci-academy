"use client"

import React, { useMemo } from "react"
import {
    Label,
    ListBox,
    Select,
    Typography,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useQueryMyPickableCvAchievementsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyPickableCvAchievementsSwr"

/** One `myPickableCvAchievements.milestoneTaskAttempts[]` entry, as a `Select.Root` item. */
interface PickableAchievementItem {
    id: string
    title: string
}

/** Props for {@link PickFromStarciSelect}. */
export interface PickFromStarciSelectProps extends WithClassNames<undefined> {
    /** Fires with the picked attempt's `id`, `taskTitle`, `milestoneTitle`, `courseTitle`. */
    onPick: (attempt: { id: string, taskTitle: string, milestoneTitle: string, courseTitle: string }) => void
    /** `sourceRef`s already used by other project items — hides them from the list (no picking the same capstone twice). */
    excludeIds?: Array<string>
}

/**
 * "Pick từ StarCi" combobox — a REAL `Select` (not a fake div), listing the
 * signed-in user's passed capstones (`myPickableCvAchievements`, verified by
 * construction). Picking one is a one-shot action (adds a new `project` item
 * tagged `source: "verified"`) — the picker itself holds no persistent
 * selection, so it resets to its placeholder immediately after.
 *
 * @param props - {@link PickFromStarciSelectProps}
 */
export const PickFromStarciSelect = ({ className, onPick, excludeIds = [] }: PickFromStarciSelectProps) => {
    const t = useTranslations()
    const pickableSwr = useQueryMyPickableCvAchievementsSwr()
    const attempts = pickableSwr.data?.milestoneTaskAttempts ?? []
    const available = attempts.filter((attempt) => !excludeIds.includes(attempt.id))

    const items = useMemo<Array<PickableAchievementItem>>(
        () => available.map((attempt) => ({
            id: attempt.id,
            title: `${attempt.taskTitle} — ${attempt.milestoneTitle} (${attempt.courseTitle})`,
        })),
        [available],
    )

    const isLoading = pickableSwr.isLoading && !pickableSwr.data
    const isDisabled = isLoading || items.length === 0

    return (
        <div className={className}>
            <div className="flex flex-col gap-2">
                <Label htmlFor="cv-project-pick-from-starci">
                    {t("cv.blocks.project.pickFromStarciLabel")}
                </Label>
                <Select.Root<PickableAchievementItem, "single">
                    id="cv-project-pick-from-starci"
                    aria-label={t("cv.blocks.project.pickFromStarciLabel")}
                    isDisabled={isDisabled}
                    selectedKey={null}
                    onSelectionChange={(key) => {
                        if (!key) {
                            return
                        }
                        const attempt = available.find((candidate) => candidate.id === String(key))
                        if (attempt) {
                            onPick(attempt)
                        }
                    }}
                >
                    <Select.Trigger aria-label={t("cv.blocks.project.pickFromStarciLabel")}>
                        <Select.Value>
                            {() => (
                                <Typography type="body-sm" color="muted">
                                    {isLoading
                                        ? t("cv.blocks.project.pickFromStarciLoading")
                                        : items.length === 0
                                            ? t("cv.blocks.project.pickFromStarciEmpty")
                                            : t("cv.blocks.project.pickFromStarciPlaceholder")}
                                </Typography>
                            )}
                        </Select.Value>
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox.Root aria-label={t("cv.blocks.project.pickFromStarciLabel")} items={items}>
                            {(item) => (
                                <ListBox.Item key={item.id} id={item.id} textValue={item.title} aria-label={item.title}>
                                    <span>{item.title}</span>
                                </ListBox.Item>
                            )}
                        </ListBox.Root>
                    </Select.Popover>
                </Select.Root>
            </div>
        </div>
    )
}
