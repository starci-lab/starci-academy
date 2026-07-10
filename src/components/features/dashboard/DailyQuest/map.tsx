import React from "react"
import {
    BookOpenIcon,
    PuzzlePieceIcon,
    CardsIcon,
    MicrophoneIcon,
    TimerIcon,
} from "@phosphor-icons/react"
import type { DailyQuestKey } from "@/modules/api/graphql/queries/types/my-daily-quest"

/** Phosphor icon per daily-quest task key. */
export const DAILY_QUEST_ICON_MAP: Record<DailyQuestKey, React.ReactNode> = {
    readContent: <BookOpenIcon aria-hidden focusable="false" className="size-5 shrink-0" />,
    passChallenge: <PuzzlePieceIcon aria-hidden focusable="false" className="size-5 shrink-0" />,
    reviewFlashcards: <CardsIcon aria-hidden focusable="false" className="size-5 shrink-0" />,
    mockInterview: <MicrophoneIcon aria-hidden focusable="false" className="size-5 shrink-0" />,
    quizSession: <TimerIcon aria-hidden focusable="false" className="size-5 shrink-0" />,
}
