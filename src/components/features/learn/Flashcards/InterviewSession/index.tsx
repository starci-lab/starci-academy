"use client"

import React, { useCallback, useEffect, useState } from "react"
import { Button, Chip, Spinner, Typography, cn } from "@heroui/react"
import { MicrophoneIcon } from "@phosphor-icons/react"
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
import { InterviewSessionSkeleton } from "./InterviewSessionSkeleton"
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
 * pass/borderline/fail verdict with concrete feedback. "Draw a new question"
 * reshuffles to a fresh card. Draw is an imperative one-shot query (random pick
 * per press), so its loading/error are handled inline rather than via SWR.
 * @param props - {@link InterviewSessionProps}
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
                <Typography type="body-sm" color="muted" align="center">
                    {drawError}
                </Typography>
                <Button size="sm" variant="secondary" onPress={() => void draw()}>
                    {t("flashcard.interview.retry")}
                </Button>
            </div>
        )
    }

    // three distinct verdicts: pass (đạt) / borderline (cận) / fail (chưa đạt)
    const verdict = result?.verdict
    const verdictColor: "success" | "warning" | "danger" =
        verdict === InterviewVerdict.Pass
            ? "success"
            : verdict === InterviewVerdict.Borderline
                ? "warning"
                : "danger"
    const verdictLabel =
        verdict === InterviewVerdict.Pass
            ? t("flashcard.interview.pass")
            : verdict === InterviewVerdict.Borderline
                ? t("flashcard.interview.borderline")
                : t("flashcard.interview.fail")
    // whether anything has been transcribed yet (gates the submit button)
    const hasTranscript = transcript.trim().length > 0

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            {/* question meta: interview level + technology tags */}
            {(card.level || (card.tags?.length ?? 0) > 0) ? (
                <div className="flex flex-wrap items-center gap-2">
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
                <Typography type="body-xs" weight="medium" color="muted">
                    {t("flashcard.questionLabel")}
                </Typography>
                <div className="text-lg font-medium text-foreground">
                    <MarkdownContent markdown={card.question} />
                </div>
            </div>

            {/* the recorder: unsupported notice, or mic control + live transcript */}
            {!supported ? (
                <div className="rounded-xl bg-default/40 p-4">
                    <Typography type="body-sm" color="muted" align="center">
                        {t("flashcard.interview.unsupported")}
                    </Typography>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-center">
                        <Button
                            variant={listening ? "danger" : "primary"}
                            onPress={() => (listening ? stop() : start())}
                            isDisabled={isMutating}
                        >
                            <MicrophoneIcon className="size-5" aria-hidden focusable="false" />
                            {listening
                                ? t("flashcard.interview.stop")
                                : t("flashcard.interview.record")}
                        </Button>
                    </div>

                    {/* recording pulse hint */}
                    {listening ? (
                        <div className="flex items-center justify-center gap-2">
                            <span className="size-2 animate-pulse rounded-full bg-danger" />
                            <Typography type="body-xs" className="text-danger">
                                {t("flashcard.interview.recording")}
                            </Typography>
                        </div>
                    ) : null}

                    {/* live transcript: finalized words + greyed interim tail */}
                    <div className={PANEL_CLASS}>
                        <Typography type="body-xs" weight="medium" color="muted">
                            {t("flashcard.interview.yourAnswer")}
                        </Typography>
                        {hasTranscript || interimTranscript ? (
                            <Typography className="text-foreground">
                                {transcript}{" "}
                                <span className="text-muted">{interimTranscript}</span>
                            </Typography>
                        ) : (
                            <Typography type="body-sm" color="muted">
                                {t("flashcard.interview.transcriptHint")}
                            </Typography>
                        )}
                    </div>

                    {/* microphone permission / recognition error */}
                    {speechError ? (
                        <Typography type="body-xs" align="center" className="text-danger">
                            {t("flashcard.interview.micError")}
                        </Typography>
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
                <Typography type="body-sm" align="center" className="text-danger">
                    {gradeError}
                </Typography>
            ) : null}

            {/* grading spinner while the answer is in flight */}
            {isMutating ? (
                <div className="flex items-center justify-center gap-2">
                    <Spinner size="sm" />
                    <Typography type="body-sm" color="muted">
                        {t("flashcard.interview.grading")}
                    </Typography>
                </div>
            ) : null}

            {/* the verdict result: đạt / không đạt + score + strengths/gaps + hints */}
            {result && !isMutating ? (
                <div className="flex flex-col gap-6 rounded-xl bg-default/40 p-8">
                    {/* headline verdict + numeric score */}
                    <div className="flex items-center justify-between gap-3">
                        <Chip size="md" variant="soft" color={verdictColor}>
                            {verdictLabel}
                        </Chip>
                        <Typography type="body-sm" weight="medium">
                            {t("flashcard.interview.score", { score: result.score })}
                        </Typography>
                    </div>

                    {/* concrete things done right */}
                    {result.strengths.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            <Typography type="body-xs" weight="medium" className="text-success">
                                {t("flashcard.interview.strengths")}
                            </Typography>
                            <ul className="flex list-disc flex-col gap-2 pl-5">
                                {result.strengths.map((strength, index) => (
                                    <li key={index}>
                                        <Typography type="body-sm">{strength}</Typography>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {/* concrete gaps to address */}
                    {result.gaps.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            <Typography type="body-xs" weight="medium" className="text-danger">
                                {t("flashcard.interview.gaps")}
                            </Typography>
                            <ul className="flex list-disc flex-col gap-2 pl-5">
                                {result.gaps.map((gap, index) => (
                                    <li key={index}>
                                        <Typography type="body-sm">{gap}</Typography>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {/* one-line nudge toward the model answer */}
                    {result.modelAnswerHint ? (
                        <div className="flex flex-col gap-2 border-t border-divider pt-6">
                            <Typography type="body-xs" weight="medium" color="muted">
                                {t("flashcard.interview.hint")}
                            </Typography>
                            <Typography type="body-sm">{result.modelAnswerHint}</Typography>
                        </div>
                    ) : null}

                    {/* a natural interviewer follow-up to think about next */}
                    {result.followUpQuestion ? (
                        <div className="flex flex-col gap-2">
                            <Typography type="body-xs" weight="medium" color="muted">
                                {t("flashcard.interview.followUp")}
                            </Typography>
                            <Typography type="body-sm">{result.followUpQuestion}</Typography>
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
