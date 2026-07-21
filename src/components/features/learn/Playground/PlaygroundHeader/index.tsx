"use client"

import React, { useCallback } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useParams, useRouter } from "next/navigation"
import { Typography } from "@heroui/react"
import { BackLink } from "@/components/blocks/navigation/BackLink"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { usePlaygroundSessionContext } from "@/components/features/learn/Playground/PlaygroundSessionProvider"
import { pathConfig } from "@/resources/path"

/** Props for {@link PlaygroundHeader}. */
export interface PlaygroundHeaderProps {
    /** 1-based step position, rendered as a counter + progress meter. */
    step: {
        current: number
        total: number
    }
}

/**
 * The chrome for the Session work surface: a back-link out to the exercise's
 * Setup page + the step counter/progress.
 *
 * `Thoát` returns to Setup (`[slug]`, the exercise overview — device specs +
 * readiness), NOT the hub list — the learner just came from there, and it's
 * the single entry back into this exercise. (Đính chính 2026-07-20: this
 * header used to also carry a `Chuẩn bị · Lab` route switch, but Setup never
 * rendered it — the switch was dead on one leg — so it's gone; Setup is
 * reached only via `Thoát`.)
 *
 * @param props - See {@link PlaygroundHeaderProps}.
 */
export const PlaygroundHeader = ({ step }: PlaygroundHeaderProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { slug } = usePlaygroundSessionContext()
    // Course comes from the URL, NOT the store: playgrounds are shared by every
    // course, and a stale `state.course.displayId` would navigate the learner OUT
    // of the course they're in (bug: every playground link jumped to devops).
    const params = useParams()
    const courseDisplayId = String(params.courseId ?? "")

    const learnPath = pathConfig().locale(locale).course(courseDisplayId).learn()

    const onLeave = useCallback(() => {
        router.push(learnPath.playground(slug).build())
    }, [router, learnPath, slug])

    return (
        <div className="border-b border-default bg-surface px-4 py-3 @app-sm:px-6">
            <div className="flex items-center justify-between gap-3">
                <BackLink label={t("playground.session.leave")} onPress={onLeave} />
                <Typography type="body-sm" weight="medium" color="muted" className="whitespace-nowrap">
                    {t("playground.session.stepCounter", { current: step.current, total: step.total })}
                </Typography>
            </div>
            <ProgressMeter
                value={step.current}
                max={Math.max(step.total, 1)}
                className="mt-2"
            />
        </div>
    )
}
