"use client"

import React, { useState } from "react"
import { Button, Input, Label, Separator, TextField, Typography, cn } from "@heroui/react"
import { SparkleIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { useMutateAskContentAiSwr } from "@/hooks"
import { useGraphQLWithToast } from "@/modules/toast"
import { MarkdownContent } from "@/components/reuseable"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link ContentAiCopilot}. */
export type ContentAiCopilotProps = WithClassNames<undefined>

/**
 * Right-rail "ask StarCi AI about this content" panel: a question box that calls
 * `askContentAi` (RAG-light over the content body) and renders the answer in place.
 * Always present while a content is open, so it anchors the rail. Each question
 * spends one AI credit server-side; quota / error surfaces via the toast wrapper.
 *
 * @param props - {@link ContentAiCopilotProps}
 */
export const ContentAiCopilot = ({ className }: ContentAiCopilotProps) => {
    const t = useTranslations()
    const runGraphQL = useGraphQLWithToast()
    const contentId = useAppSelector((state) => state.content.id)
    const askSwr = useMutateAskContentAiSwr()
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState<string | null>(null)

    /** Send the question, then render the answer (or toast the error / quota). */
    const onAsk = async () => {
        const trimmed = question.trim()
        if (!trimmed || !contentId) {
            return
        }
        let nextAnswer: string | null = null
        const ok = await runGraphQL(
            async () => {
                const envelope = await askSwr.trigger({ contentId, question: trimmed })
                if (!envelope?.success || !envelope.data) {
                    throw new Error(envelope?.message ?? "Ask failed")
                }
                nextAnswer = envelope.data.answer
                return envelope
            },
            { showSuccessToast: false },
        )
        if (ok && nextAnswer) {
            setAnswer(nextAnswer)
            setQuestion("")
        }
    }

    if (!contentId) {
        return null
    }

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <Separator />
            <div className="flex items-center gap-2">
                <SparkleIcon className="size-5" aria-hidden focusable="false" />
                <Label>{t("contentAi.title")}</Label>
            </div>
            {answer ? (
                <MarkdownContent markdown={answer} />
            ) : (
                <Typography type="body-xs" color="muted">
                    {t("contentAi.hint")}
                </Typography>
            )}
            <TextField>
                <Input
                    aria-label={t("contentAi.placeholder")}
                    placeholder={t("contentAi.placeholder")}
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                />
            </TextField>
            <Button
                size="sm"
                variant="primary"
                className="self-start"
                isPending={askSwr.isMutating}
                onPress={onAsk}
            >
                {t("contentAi.ask")}
            </Button>
        </div>
    )
}
