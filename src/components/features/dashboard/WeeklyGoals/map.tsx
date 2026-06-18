import React from "react"
import {
    BookOpenIcon,
    FlameIcon,
    PuzzlePieceIcon,
    CodeIcon,
    CardsIcon,
} from "@phosphor-icons/react"
import type {
    KpiKey,
} from "@/modules/api"

/**
 * Phosphor icon per weekly-KPI key (dashboard runs phosphor `*Icon`; the legacy
 * `/kpi` editor's `KPI_META` carries `@gravity-ui` icons, so this card owns its own).
 */
export const KPI_ICON_MAP: Record<KpiKey, React.ReactNode> = {
    lessons: <BookOpenIcon aria-hidden focusable="false" className="size-5 shrink-0" />,
    studyDays: <FlameIcon aria-hidden focusable="false" className="size-5 shrink-0" />,
    challenges: <PuzzlePieceIcon aria-hidden focusable="false" className="size-5 shrink-0" />,
    coding: <CodeIcon aria-hidden focusable="false" className="size-5 shrink-0" />,
    flashcards: <CardsIcon aria-hidden focusable="false" className="size-5 shrink-0" />,
}

/** Weekly-KPI display order (label key === KPI key). */
export const KPI_ORDER: Array<KpiKey> = [
    "lessons",
    "studyDays",
    "challenges",
    "coding",
    "flashcards",
]
