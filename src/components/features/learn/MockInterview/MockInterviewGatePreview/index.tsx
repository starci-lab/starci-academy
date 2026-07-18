"use client"

import React from "react"
import { Chip, Typography } from "@heroui/react"
import { MicrophoneStageIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

/** Rubric-dimension chip keys shown under the first sample question. */
const RUBRIC_KEYS = ["r1", "r2", "r3", "r4"] as const

/**
 * Non-interactive MOCK teaser of the Mock Interview surface — representative
 * sample question cards (NOT real gated data), fed to {@link import("../../shared/EnrollGate").EnrollGate}
 * as its `preview` so a trial viewer SEES what the interview looks like (prompt +
 * answer area + AI rubric) behind the faded enroll card. Decorative only
 * (`aria-hidden` is applied by the gate wrapper) — no state, no data fetching.
 */
export const MockInterviewGatePreview = () => {
    const t = useTranslations()
    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-3xl bg-surface p-5 shadow-surface">
                <Chip size="sm" variant="soft" color="accent" className="w-fit">
                    {t("mockInterview.gatePreview.q1Badge")}
                </Chip>
                <Typography type="body" weight="semibold">
                    {t("mockInterview.gatePreview.q1Title")}
                </Typography>
                <Typography type="body-sm" color="muted">
                    {t("mockInterview.gatePreview.q1Body")}
                </Typography>
                <div className="flex items-center gap-2 rounded-2xl border border-dashed border-default bg-default px-4 py-3">
                    <MicrophoneStageIcon aria-hidden focusable="false" className="size-4 shrink-0 text-muted" />
                    <Typography type="body-sm" color="muted">
                        {t("mockInterview.gatePreview.answerHint")}
                    </Typography>
                </div>
                <div className="flex flex-wrap gap-2">
                    {RUBRIC_KEYS.map((key) => (
                        <Chip key={key} size="sm" variant="soft" className="w-fit">
                            {t(`mockInterview.gatePreview.${key}`)}
                        </Chip>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-3 rounded-3xl bg-surface p-5 shadow-surface">
                <Chip size="sm" variant="soft" color="accent" className="w-fit">
                    {t("mockInterview.gatePreview.q2Badge")}
                </Chip>
                <Typography type="body" weight="semibold">
                    {t("mockInterview.gatePreview.q2Title")}
                </Typography>
                <Typography type="body-sm" color="muted">
                    {t("mockInterview.gatePreview.q2Body")}
                </Typography>
            </div>
        </div>
    )
}
