import {
    BookOpenIcon,
    FlameIcon,
    PuzzlePieceIcon,
    CodeIcon,
    CardsIcon,
    FlagIcon,
    type Icon as PhosphorIcon,
} from "@phosphor-icons/react"
import type { KpiKey } from "@/modules/api/graphql/queries/types/my-kpis"

/**
 * Phosphor icon per weekly-KPI key (this card owns its own icon map, decoupled
 * from the `/kpi` editor's `KPI_META`). A COMPONENT REFERENCE per key — never a
 * built node — so the leaf that renders it (`Typography`'s `prefixIcon`) owns
 * the glyph's scale and weight itself.
 */
export const KPI_ICON_MAP: Record<KpiKey, PhosphorIcon> = {
    lessons: BookOpenIcon,
    studyDays: FlameIcon,
    challenges: PuzzlePieceIcon,
    coding: CodeIcon,
    flashcards: CardsIcon,
    milestones: FlagIcon,
}

/** Weekly-KPI display order (label key === KPI key). */
export const KPI_ORDER: Array<KpiKey> = [
    "lessons",
    "studyDays",
    "challenges",
    "coding",
    "flashcards",
    "milestones",
]

/**
 * Sensible default weekly targets used when the learner hasn't set a custom goal
 * yet — so each meter tracks this week's activity out of the box (the bar fills as
 * you study). The learner can still override any of these via the "Edit" editor.
 */
export const DEFAULT_KPI_TARGETS: Record<KpiKey, number> = {
    lessons: 5,
    studyDays: 5,
    challenges: 3,
    coding: 3,
    flashcards: 20,
    milestones: 2,
}
