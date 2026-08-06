"use client"

import React from "react"
import { Chip, Typography } from "@heroui/react"
import { MicrophoneStageIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { Box } from "@/components/frames/Box"
import { Cluster } from "@/components/frames/Cluster"
import { StackH, StackV } from "@/components/frames/Stack"

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
        <Box principle="center-measure" className="mx-auto w-full max-w-3xl">
            <StackV
                gap={5}
                principle="group-boundary"
                items={[
                    () => (
                        // Original used p-5 (20px) — no padding token; SurfaceCard padding={5} is p-4.
                        // Hold documented as mockinterview-gate-preview-p5; visual retunes to card-padding.
                        <SurfaceCard
                            padding={5}
                            body={() => (
                                <StackV
                                    gap={4}
                                    items={[
                                        () => (
                                            <Chip size="sm" variant="soft" color="accent" className="w-fit">
                                                {t("mockInterview.gatePreview.q1Badge")}
                                            </Chip>
                                        ),
                                        () => (
                                            <Typography type="body" weight="semibold">
                                                {t("mockInterview.gatePreview.q1Title")}
                                            </Typography>
                                        ),
                                        () => (
                                            <Typography type="body-sm" color="muted">
                                                {t("mockInterview.gatePreview.q1Body")}
                                            </Typography>
                                        ),
                                        () => (
                                            <Box principle="row-pad" className="rounded-2xl border border-dashed border-default bg-default px-4 py-3">
                                                <StackH
                                                    gap={2}
                                                    principle="icon-text"
                                                    items={[
                                                        () => (
                                                            <MicrophoneStageIcon aria-hidden focusable="false" className="size-4 shrink-0 text-muted" />
                                                        ),
                                                        () => (
                                                            <Typography type="body-sm" color="muted">
                                                                {t("mockInterview.gatePreview.answerHint")}
                                                            </Typography>
                                                        ),
                                                    ]}
                                                />
                                            </Box>
                                        ),
                                        () => (
                                            <Cluster
                                                gap={3}
                                                principle="chip-row"
                                                items={RUBRIC_KEYS.map((key) => () => (
                                                    <Chip key={key} size="sm" variant="soft" className="w-fit">
                                                        {t(`mockInterview.gatePreview.${key}`)}
                                                    </Chip>
                                                ))}
                                            />
                                        ),
                                    ]}
                                />
                            )}
                        />
                    ),
                    () => (
                        <SurfaceCard
                            padding={5}
                            body={() => (
                                <StackV
                                    gap={4}
                                    items={[
                                        () => (
                                            <Chip size="sm" variant="soft" color="accent" className="w-fit">
                                                {t("mockInterview.gatePreview.q2Badge")}
                                            </Chip>
                                        ),
                                        () => (
                                            <Typography type="body" weight="semibold">
                                                {t("mockInterview.gatePreview.q2Title")}
                                            </Typography>
                                        ),
                                        () => (
                                            <Typography type="body-sm" color="muted">
                                                {t("mockInterview.gatePreview.q2Body")}
                                            </Typography>
                                        ),
                                    ]}
                                />
                            )}
                        />
                    ),
                ]}
            />
        </Box>
    )
}
