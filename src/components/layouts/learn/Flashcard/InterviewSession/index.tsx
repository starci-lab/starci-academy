"use client"

import React, { useCallback, useEffect, useState } from "react"
import { Button, Chip, cn, Spinner } from "@heroui/react"
import { useTranslations, useLocale } from "next-intl"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { queryDrawInterviewCard } from "@/modules/api/graphql"
import type {
    InterviewCardData,
    InterviewGradeResultData,
} from "@/modules/api"
import { InterviewVerdict } from "@/modules/api"
import { useMutateGradeInterviewAnswerSwr } from "@/hooks"
import { useSpeechRecognition } from "@/hooks"
import { useGraphQLWithToast } from "@/modules/toast"
import { InterviewSessionSkeleton } from "../InterviewSessionSkeleton"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link InterviewSession}. */
export interface InterviewSessionProps extends WithClassNames<undefined> {
    /** Deck to draw random interview questions from. */
    deckId: string
}

/** HeroUI Chip color per interview seniority level (mirrors the reviewer). */
const LEVEL_COLOR: Record<string, "success" | "warning" | "danger" | "accent"> = {
    junior: "success",
    middle: "warning",
    senior: "danger",
    staff: "accent",
}

/** Soft, borderless surface shared by the question + transcript panels. */
const PANEL_CLASS = "flex flex-col gap-3 rounded-xl bg-default/40 p-8"

/**
 * Voice-interview mode over a deck. Draws one random question (model answer
 * withheld server-side), the learner answers aloud, the browser transcribes the
 * speech client-side, and the transcript is graded by the backend into a
 * pass/borderline/fail verdict ("đạt"/"không đạt") with concrete feedback.
 * "Draw a new question" reshuffles to a fresh card.
 */
export const InterviewSession = ({ deckId, className }: InterviewSessionProps) => {
    const t = useTranslations()
    const locale = useLocale()
    // recognize speech in the active UI locale (Web Speech wants a BCP-47 tag)
    const recognitionLang = locale === "vi" ? "vi-VN" : "en-US"

    const {
        supported,
        listening,
        transcript,
        interimTranscript,
        error: speechError,
        start,
        stop,
        reset,
    } = useSpeechRecognition({ lang: recognitionLang })

    const { trigger: gradeAnswer, isMutating } = useMutateGradeInterviewAnswerSwr()
    const runGraphQL = useGraphQLWithToast()

    // the currently drawn question (null while drawing / on draw failure)
    const [card, setCard] = useState<InterviewCardData | null>(null)
    // true while a draw is in flight (initial load + every "new question")
    const [drawing, setDrawing] = useState(true)
    // typed draw failure message, or null
    const [drawError, setDrawError] = useState<string | null>(null)
    // the grade once the answer is submitted, or null before grading
    const [result, setResult] = useState<InterviewGradeResultData | null>(null)
    // grade failure message, or null
    const [gradeError, setGradeError] = useState<string | null>(null)

    // draw a fresh random question and clear all per-question state
    const draw = useCallback(async () => {
        setDrawing(true)
        setDrawError(null)
        setResult(null)
        setGradeError(null)
        // clear any previous transcript so the new question starts blank
        reset()
        try {
            const response = await queryDrawInterviewCard({
                request: { flashcardDeckId: deckId },
            })
            const payload = response.data?.drawInterviewCard
            // surface a typed backend failure (e.g. deck has no gradable cards)
            if (!payload?.success || !payload.data) {
                setDrawError(payload?.message ?? t("flashcard.interview.drawError"))
                setCard(null)
                return
            }
            setCard(payload.data)
        } catch {
            // network / transport failure — generic retryable message
            setDrawError(t("flashcard.interview.drawError"))
            setCard(null)
        } finally {
            setDrawing(false)
        }
    }, [deckId, reset, t])

    // draw the first question on mount (and whenever the deck changes)
    useEffect(() => {
        void draw()
    }, [draw])

    // grade the spoken answer; stop the mic first so the last phrase is finalized
    const submit = useCallback(async () => {
        if (!card || transcript.trim().length === 0) {
            return
        }
        if (listening) {
            stop()
        }
        setGradeError(null)
        let gradeResult: InterviewGradeResultData | null = null
        // route the mutation through the toast hook; it toasts based on the
        // GraphQLResponse `success`, so hand it the `gradeInterviewAnswer` payload
        const ok = await runGraphQL(async () => {
            const response = await gradeAnswer({
                flashcardDeckId: card.deckId,
                flashcardCardId: card.id,
                transcript: transcript.trim(),
            })
            const payload = response.data?.gradeInterviewAnswer
            gradeResult = payload?.data ?? null
            return (
                payload ?? {
                    success: false,
                    message: t("flashcard.interview.gradeError"),
                }
            )
        })
        // success toast already shown by the hook; keep the inline error in sync
        if (ok && gradeResult) {
            setResult(gradeResult)
        } else {
            setGradeError(t("flashcard.interview.gradeError"))
        }
    }, [card, transcript, listening, stop, gradeAnswer, runGraphQL, t])

    // initial load / redraw: mirror with a content-shaped skeleton
    if (drawing) {
        return <InterviewSessionSkeleton />
    }

    // draw failed (e.g. deck not interview-ready) — offer a retry
    if (drawError || !card) {
        return (
            <div className="flex flex-col items-center gap-3 py-10">
                <p className="text-center text-sm text-muted">{drawError}</p>
                <Button size="sm" variant="secondary" onPress={() => void draw()}>
                    {t("flashcard.interview.retry")}
                </Button>
            </div>
        )
    }

    // pass = "đạt"; borderline + fail = "không đạt"
    const passed = result?.verdict === InterviewVerdict.Pass
    // whether anything has been transcribed yet (gates the submit button)
    const hasTranscript = transcript.trim().length > 0

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {/* question meta: interview level + technology tags */}
            {(card.level || (card.tags?.length ?? 0) > 0) ? (
                <div className="flex flex-wrap items-center gap-1.5">
                    {card.level ? (
                        <Chip size="sm" variant="soft" color={LEVEL_COLOR[card.level] ?? "default"}>
                            {t(`flashcard.level.${card.level}`)}
                        </Chip>
                    ) : null}
                    {card.tags?.map((tag) => (
                        <Chip key={tag} size="sm" variant="soft" color="default">
                            {tag}
                        </Chip>
                    ))}
                </div>
            ) : null}

            {/* the question prompt (answer is never sent to the client) */}
            <div className={PANEL_CLASS}>
                <span className="text-xs font-medium text-muted">
                    {t("flashcard.questionLabel")}
                </span>
                <div className="text-lg font-medium text-foreground">
                    <MarkdownContent markdown={card.question} />
                </div>
            </div>

            {/* the recorder: unsupported notice, or mic control + live transcript */}
            {!supported ? (
                <p className="rounded-xl bg-default/40 p-4 text-center text-sm text-muted">
                    {t("flashcard.interview.unsupported")}
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-center">
                        <Button
                            variant={listening ? "danger" : "primary"}
                            onPress={() => (listening ? stop() : start())}
                            isDisabled={isMutating}
                        >
                            {/* inline mic glyph keeps the button dependency-free */}
                            <svg
                                className="size-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <rect x="9" y="2" width="6" height="12" rx="3" />
                                <path d="M5 10a7 7 0 0 0 14 0" />
                                <line x1="12" y1="17" x2="12" y2="22" />
                            </svg>
                            {listening
                                ? t("flashcard.interview.stop")
                                : t("flashcard.interview.record")}
                        </Button>
                    </div>

                    {/* recording pulse hint */}
                    {listening ? (
                        <span className="flex items-center justify-center gap-1.5 text-xs text-danger">
                            <span className="size-2 animate-pulse rounded-full bg-danger" />
                            {t("flashcard.interview.recording")}
                        </span>
                    ) : null}

                    {/* live transcript: finalized words + greyed interim tail */}
                    <div className={PANEL_CLASS}>
                        <span className="text-xs font-medium text-muted">
                            {t("flashcard.interview.yourAnswer")}
                        </span>
                        {hasTranscript || interimTranscript ? (
                            <p className="text-foreground">
                                {transcript}{" "}
                                <span className="text-muted">{interimTranscript}</span>
                            </p>
                        ) : (
                            <p className="text-sm text-muted">
                                {t("flashcard.interview.transcriptHint")}
                            </p>
                        )}
                    </div>

                    {/* microphone permission / recognition error */}
                    {speechError ? (
                        <p className="text-center text-xs text-danger">
                            {t("flashcard.interview.micError")}
                        </p>
                    ) : null}
                </div>
            )}

            {/* actions: submit the transcript for grading + draw a new question */}
            <div className="flex items-center justify-between gap-3">
                <Button
                    size="sm"
                    variant="secondary"
                    onPress={() => void draw()}
                    isDisabled={isMutating}
                >
                    {t("flashcard.interview.newQuestion")}
                </Button>
                <Button
                    size="sm"
                    variant="primary"
                    onPress={() => void submit()}
                    isPending={isMutating}
                    isDisabled={!hasTranscript || listening}
                >
                    {t("flashcard.interview.submit")}
                </Button>
            </div>

            {/* grade error (transport / typed failure) */}
            {gradeError ? (
                <p className="text-center text-sm text-danger">{gradeError}</p>
            ) : null}

            {/* grading spinner while the answer is in flight */}
            {isMutating ? (
                <div className="flex items-center justify-center gap-1.5 text-sm text-muted">
                    <Spinner size="sm" />
                    {t("flashcard.interview.grading")}
                </div>
            ) : null}

            {/* the verdict result: đạt / không đạt + score + strengths/gaps + hints */}
            {result && !isMutating ? (
                <div className="flex flex-col gap-6 rounded-xl bg-default/40 p-8">
                    {/* headline verdict + numeric score */}
                    <div className="flex items-center justify-between gap-3">
                        <Chip
                            size="md"
                            variant="soft"
                            color={passed ? "success" : "danger"}
                        >
                            {passed
                                ? t("flashcard.interview.pass")
                                : t("flashcard.interview.fail")}
                        </Chip>
                        <span className="text-sm font-medium text-foreground">
                            {t("flashcard.interview.score", { score: result.score })}
                        </span>
                    </div>

                    {/* concrete things done right */}
                    {result.strengths.length > 0 ? (
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-success">
                                {t("flashcard.interview.strengths")}
                            </span>
                            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm text-foreground">
                                {result.strengths.map((strength, index) => (
                                    <li key={index}>{strength}</li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {/* concrete gaps to address */}
                    {result.gaps.length > 0 ? (
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-danger">
                                {t("flashcard.interview.gaps")}
                            </span>
                            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm text-foreground">
                                {result.gaps.map((gap, index) => (
                                    <li key={index}>{gap}</li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {/* one-line nudge toward the model answer */}
                    {result.modelAnswerHint ? (
                        <div className="flex flex-col gap-1.5 border-t border-divider pt-6">
                            <span className="text-xs font-medium text-muted">
                                {t("flashcard.interview.hint")}
                            </span>
                            <p className="text-sm text-foreground">{result.modelAnswerHint}</p>
                        </div>
                    ) : null}

                    {/* a natural interviewer follow-up to think about next */}
                    {result.followUpQuestion ? (
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-muted">
                                {t("flashcard.interview.followUp")}
                            </span>
                            <p className="text-sm text-foreground">{result.followUpQuestion}</p>
                        </div>
                    ) : null}

                    {/* try the same prompt again or move on */}
                    <Button
                        size="sm"
                        variant="primary"
                        onPress={() => void draw()}
                        className="self-start"
                    >
                        {t("flashcard.interview.nextQuestion")}
                    </Button>
                </div>
            ) : null}
        </div>
    )
}
