"use client"

import { ClockIcon, FlameIcon } from "@phosphor-icons/react"
import _ from "lodash"
import React, {
    useMemo,
} from "react"
import {
    Typography,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    ReadBadge,
} from "../ReadBadge"
import { Chip } from "@/components/atoms/chips/Chip"
import { CheckListCard, CheckListItem } from "@/components/blocks/cards/CheckListCard"
import { SurfaceCardHeader } from "@/components/composites/cards/SurfaceCard/surface-card-header"
import { StackV } from "@/components/frames/Stack"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { ResponsiveBreadcrumb } from "@/components/blocks/navigation/ResponsiveBreadcrumb"
import type { ResponsiveBreadcrumbItem } from "@/components/blocks/navigation/ResponsiveBreadcrumb"
import { useAppSelector } from "@/redux/hooks"
import { getContentChallengeCount } from "@/modules/types/entities/content"
import { pathConfig } from "@/resources/path"

/**
 * Title, description and meta-chip row (reading time, challenges, read state)
 * for the loaded content view.
 *
 * Self-contained section (single-use): reads the content entity + read state
 * from redux; the container renders `<ContentHeader />` with no props.
 */
export const ContentHeader = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const content = useAppSelector((state) => state.content.entity)
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const title = content?.title
    const description = content?.description
    const minutesRead = content?.minutesRead ?? 0

    /** Tier-1 breadcrumb (Home › Courses › <course> › Module) — lives in the PageHeader
     *  breadcrumb slot so the whole header is one unit (moved out of the route layout). */
    const breadcrumbItems = useMemo<Array<ResponsiveBreadcrumbItem>>(() => [
        { key: "home", label: t("nav.home"), onPress: () => router.push(pathConfig().locale().build()) },
        { key: "courses", label: t("nav.courses"), onPress: () => router.push(pathConfig().locale(locale).course().build()) },
        { key: "course", label: course?.title || t("nav.courses"), onPress: () => router.push(pathConfig().locale(locale).course(courseDisplayId).build()) },
        { key: "modules", label: t("modules.title"), onPress: () => router.push(pathConfig().locale(locale).course(courseDisplayId).learn().content().build()) },
    ], [t, locale, router, course?.title, courseDisplayId])

    /** Challenge count for the meta chip, tolerant of a missing entity. */
    const challengeCount = useMemo(
        () => getContentChallengeCount(content ?? {}),
        [content],
    )

    /** "What you'll learn" bullets, ordered (mount `# outcomes`); empty → callout hidden. */
    const outcomes = useMemo(
        () => _.sortBy(content?.outcomes ?? [], (outcome) => outcome.sortIndex),
        [content],
    )

    return (
        // header proper (title+desc+meta) → outcomes = header → content boundary = gap-10 (page-heading debt)
        <div className="flex flex-col gap-10">
            {/* header (tier 1/2) via the shared PageHeader block for cross-page consistency:
                title (H3) + description + a quiet meta-chip row (read state · time · challenges). */}
            <PageHeader
                breadcrumb={<ResponsiveBreadcrumb items={breadcrumbItems} />}
                title={title}
                description={description || undefined}
                meta={(
                    <div className="flex flex-wrap items-center gap-2">
                        <ReadBadge />
                        <Chip
                            tone="default"
                            icon={ClockIcon}
                            text={t("content.minutesRead", { minutes: minutesRead })}
                        />
                        <Typography type="body-xs" color="muted" className="flex items-center gap-1">
                            <FlameIcon className="size-4" />
                            {t("content.challengeCount", { count: challengeCount })}
                        </Typography>
                    </div>
                )}
            />
            {/* "What you'll learn" — first CONTENT block, gap-10 below the header above */}
            {outcomes.length > 0 ? (
                // B37 Decision E: CheckListCard self-frames — StackV label-field
                // replaces LabeledCard frameless around the checklist.
                <StackV
                    gap={3}
                    principle="label-field"
                    explain="Section label above its control is label-field — not title-subtitle (no paired title/supporting lines), not name-handle, not icon-text; the label names the surface the way a field label names its control."
                    items={[
                        () => <SurfaceCardHeader label={t("content.outcomes")} />,
                        () => (
                            <CheckListCard>
                                {outcomes.map((outcome) => (
                                    <CheckListItem key={outcome.id}>
                                        <Typography type="body-sm">{outcome.text}</Typography>
                                    </CheckListItem>
                                ))}
                            </CheckListCard>
                        ),
                    ]}
                />
            ) : null}
        </div>
    )
}
