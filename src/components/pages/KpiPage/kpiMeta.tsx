import React from "react"
import {
    BookOpenIcon as LessonIcon,
    FlameIcon as DaysIcon,
    PuzzlePieceIcon as ChallengeIcon,
    CodeIcon as CodingIcon,
    CardsIcon as FlashcardIcon,
    FlagIcon as MilestoneIcon,
} from "@phosphor-icons/react"
import type { KpiKey } from "@/modules/api/graphql/queries/types/my-kpis"

/** Display metadata for one weekly KPI (icon · i18n label · preset targets). */
export interface KpiMeta {
    /** The KPI key (matches BE `KpiKey`). */
    key: KpiKey
    /** Leading icon. */
    Icon: React.ComponentType<{ className?: string }>
    /** i18n key suffix under `dashboard.kpi.labels`. */
    labelKey: KpiKey
    /** Quick-pick target presets offered in the editor. */
    presets: Array<number>
}

/**
 * The six weekly KPIs in display order, each with its icon + preset targets
 * (lessons/studyDays/challenges/coding/flashcards/milestones). Shared by the
 * dashboard summary card and the `/kpi` editor page so both stay in sync.
 */
export const KPI_META: Array<KpiMeta> = [
    {
        key: "lessons",
        Icon: LessonIcon,
        labelKey: "lessons",
        presets: [
            3,
            5,
            10,
        ],
    },
    {
        key: "studyDays",
        Icon: DaysIcon,
        labelKey: "studyDays",
        presets: [
            3,
            5,
            7,
        ],
    },
    {
        key: "challenges",
        Icon: ChallengeIcon,
        labelKey: "challenges",
        presets: [
            2,
            5,
            10,
        ],
    },
    {
        key: "coding",
        Icon: CodingIcon,
        labelKey: "coding",
        presets: [
            2,
            5,
            10,
        ],
    },
    {
        key: "flashcards",
        Icon: FlashcardIcon,
        labelKey: "flashcards",
        presets: [
            50,
            150,
            300,
        ],
    },
    {
        key: "milestones",
        Icon: MilestoneIcon,
        labelKey: "milestones",
        presets: [
            1,
            2,
            5,
        ],
    },
]
