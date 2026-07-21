"use client"

import React from "react"
import { PlayIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux/hooks"
import { ContinueCard } from "@/components/blocks/cards/ContinueCard"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"

/** Course slugs that have a dedicated capstone teaser (`finalProject.gatePreview.<key>`). */
type CourseSlug = "fullstack-mastery" | "system-design-mastery" | "devops-mastery"

const DEFAULT_COURSE: CourseSlug = "fullstack-mastery"

const isCourseSlug = (value: string | undefined): value is CourseSlug =>
    value === "fullstack-mastery" || value === "system-design-mastery" || value === "devops-mastery"

/** `state.course.displayId` slug → i18n key segment under `finalProject.gatePreview`. */
const COURSE_I18N_KEY: Record<CourseSlug, string> = {
    "fullstack-mastery": "fullstackMastery",
    "system-design-mastery": "systemDesignMastery",
    "devops-mastery": "devopsMastery",
}

/**
 * Non-interactive MOCK teaser of the Personal Project (capstone) surface — mirrors
 * {@link import("../PersonalProjectDashboard").PersonalProjectDashboard}'s block
 * layout (hero {@link ContinueCard} + {@link ProgressMeter} + item grid in a
 * {@link LabeledCard}) using the REAL milestone-0 task titles of the active course
 * (`state.course.displayId`, not fabricated copy), fed to
 * {@link import("../../shared/EnrollGate").EnrollGate} as its `preview` so a trial
 * viewer sees the actual hands-on work behind the faded enroll card. Decorative only
 * (`aria-hidden` applied by the gate) — no state, no interactivity.
 */
export const PersonalProjectGatePreview = () => {
    const t = useTranslations()
    const courseSlug = useAppSelector((state) => state.course.displayId)
    const course = isCourseSlug(courseSlug) ? courseSlug : DEFAULT_COURSE
    const key = COURSE_I18N_KEY[course]
    const taskMeta = t("finalProject.gatePreview.taskMeta")

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <ContinueCard
                    variant="hero"
                    icon={<PlayIcon weight="fill" />}
                    title={t(`finalProject.gatePreview.${key}.heroTitle`)}
                    subtitle={taskMeta}
                    ctaLabel={t("finalProject.dashboard.continue")}
                />
                <ProgressMeter
                    value={0}
                    max={3}
                    label={t("finalProject.dashboard.completion")}
                    showValue
                />
            </div>
            <LabeledCard
                label={t(`finalProject.gatePreview.${key}.milestone`)}
                frameless
                contentClassName="grid gap-3 @app-sm:grid-cols-2"
            >
                <ContinueCard
                    variant="item"
                    title={t(`finalProject.gatePreview.${key}.item1Title`)}
                    subtitle={taskMeta}
                    ctaLabel={t("finalProject.dashboard.continue")}
                />
                <ContinueCard
                    variant="item"
                    title={t(`finalProject.gatePreview.${key}.item2Title`)}
                    subtitle={taskMeta}
                    ctaLabel={t("finalProject.dashboard.continue")}
                />
            </LabeledCard>
        </div>
    )
}
