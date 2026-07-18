"use client"

import React from "react"
import { Typography } from "@heroui/react"
import { useTranslations } from "next-intl"

/** Sample capstone task keys shown in the teaser (title/meta/criteria per key). */
const TASK_KEYS = ["t1", "t2", "t3"] as const

/**
 * Non-interactive MOCK teaser of the Personal Project (capstone) surface —
 * representative milestone + task cards (NOT real gated data), fed to
 * {@link import("../../shared/EnrollGate").EnrollGate} as its `preview` so a trial
 * viewer SEES the real hands-on work (tasks + weight + criteria) behind the faded
 * enroll card. Decorative only (`aria-hidden` applied by the gate) — no state.
 */
export const PersonalProjectGatePreview = () => {
    const t = useTranslations()
    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
            <Typography type="body-xs" weight="semibold" color="muted" className="uppercase tracking-wide">
                {t("finalProject.gatePreview.milestone")}
            </Typography>
            {TASK_KEYS.map((key, index) => (
                <div key={key} className="flex items-start gap-3 rounded-3xl bg-surface p-5 shadow-surface">
                    {/* step-number marker (not an icon → stays a small badge, not IconTile) */}
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-sm font-bold text-accent-soft-foreground">
                        {index + 1}
                    </div>
                    <div className="flex min-w-0 flex-col gap-1">
                        <Typography type="body" weight="semibold">
                            {t(`finalProject.gatePreview.${key}Title`)}
                        </Typography>
                        <Typography type="body-xs" color="muted">
                            {t(`finalProject.gatePreview.${key}Meta`)}
                        </Typography>
                        <Typography type="body-sm">
                            {t(`finalProject.gatePreview.${key}Crit`)}
                        </Typography>
                    </div>
                </div>
            ))}
        </div>
    )
}
